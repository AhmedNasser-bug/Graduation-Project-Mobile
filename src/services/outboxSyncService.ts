// Background Outbox Sync Worker
// Transmits SQLite outbox records to Firebase Cloud Firestore / Real-time Observatory Bus
import { sqliteService } from '../db/sqliteHelper';
import { telemetryBus } from '../config/firebaseClient';

class OutboxSyncWorker {
  private timer: number | null = null;
  private isSyncing = false;
  public isOnline = navigator.onLine;
  public syncLatencyMs = 18;
  public lastSyncTime: string | null = null;
  private listeners: Array<() => void> = [];

  public start() {
    if (this.timer) return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.flushOutbox();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });

    // Listen for doctor directives dispatched from Telemetry Web Dashboard
    if (telemetryBus) {
      telemetryBus.onmessage = (event) => {
        if (event.data?.type === 'DOCTOR_DIRECTIVE_DISPATCH') {
          const { sessionId, directive } = event.data;
          sqliteService.updateDoctorDirective(sessionId, directive);
          this.notifyListeners();
        }
      };
    }

    // Auto-poll outbox every 3 seconds
    this.timer = window.setInterval(() => {
      this.flushOutbox();
    }, 3000);

    // Initial flush
    this.flushOutbox();
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  public async flushOutbox(): Promise<void> {
    if (this.isSyncing || !this.isOnline) return;
    this.isSyncing = true;

    try {
      const pendingRecords = sqliteService.getPendingOutbox();
      if (pendingRecords.length === 0) {
        this.isSyncing = false;
        return;
      }

      const t0 = performance.now();

      for (const rec of pendingRecords) {
        const payload = JSON.parse(rec.payload_json);

        // 1. Dispatch over local Real-time Telemetry Bus to Web Dashboard
        if (telemetryBus) {
          telemetryBus.postMessage({
            type: 'OUTBOX_SYNC_ITEM',
            collection: rec.collection_target,
            id: rec.document_id,
            data: payload,
            timestamp: new Date().toISOString()
          });
        }

        // 2. Mark as SYNCED in local SQLite
        sqliteService.markOutboxSynced(rec.id);
      }

      this.syncLatencyMs = Math.round(performance.now() - t0);
      this.lastSyncTime = new Date().toLocaleTimeString();
      this.notifyListeners();
    } catch (e) {
      console.warn('[Outbox Worker] Flush failed, will retry on next tick:', e);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const outboxSyncWorker = new OutboxSyncWorker();
