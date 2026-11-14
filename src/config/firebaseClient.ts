// Firebase Client Configuration & Dual-Mode Telemetry Transport
// Supports both Production Firebase Cloud Projects and Local Offline Real-Time BroadcastChannel
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyNephroEdgeDemoKey2026Prototype',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nephroedge-clinical.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nephroedge-clinical',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nephroedge-clinical.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '89210491024',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:89210491024:web:3c50cbd0eaf6fa',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-NEPHROEDGE4'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isLiveFirebase = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
  // If user provided a real non-demo key, mark as live
  if (import.meta.env.VITE_FIREBASE_API_KEY && !import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey')) {
    isLiveFirebase = true;
  }
} catch (err) {
  console.warn('[Firebase Client] Running in local high-fidelity telemetry bus mode', err);
}

// Hybrid Telemetry & Outbox Bus: combines BroadcastChannel with zero-config local HTTP/SSE relay for physical mobile device testing
const SENDER_ID = Math.random().toString(36).slice(2);

export class HybridTelemetryBus {
  private localBus: BroadcastChannel | null = null;
  private sse: EventSource | null = null;
  private messageHandler: ((event: { data: any }) => void) | null = null;

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.localBus = new BroadcastChannel('nephroedge_telemetry_bus');
        this.localBus.onmessage = (ev) => {
          if (ev.data?._senderId !== SENDER_ID && this.messageHandler) {
            this.messageHandler(ev);
          }
        };
      } catch (e) {
        // BroadcastChannel unavailable
      }
    }
    this.connectRelay();
  }

  set onmessage(handler: ((event: { data: any }) => void) | null) {
    this.messageHandler = handler;
  }

  get onmessage() {
    return this.messageHandler;
  }

  private connectRelay() {
    if (typeof window === 'undefined') return;
    try {
      const host = window.location.hostname || 'localhost';
      const url = `http://${host}:5175/events`;
      this.sse = new EventSource(url);
      this.sse.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload?._senderId !== SENDER_ID && this.messageHandler) {
            this.messageHandler({ data: payload });
          }
        } catch (e) {
          // ignore heartbeat
        }
      };
    } catch (e) {
      // Relay not running or offline
    }
  }

  public postMessage(data: any) {
    const wrapped = { ...data, _senderId: SENDER_ID };
    if (this.localBus) {
      try {
        this.localBus.postMessage(wrapped);
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      try {
        const host = window.location.hostname || 'localhost';
        fetch(`http://${host}:5175/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wrapped)
        }).catch(() => {});
      } catch (e) {}
    }
  }
}

export const telemetryBus = new HybridTelemetryBus();

export { app, db, auth, isLiveFirebase };
