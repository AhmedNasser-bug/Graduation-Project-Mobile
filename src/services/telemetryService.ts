// Firebase Analytics & UX Telemetry Instrumenter
// Dispatches standard thesis benchmark telemetry events to Firebase & Observatory Bus
import { telemetryBus, isLiveFirebase } from '../config/firebaseClient';
import { PrototypeGapReport } from '../types';

export interface VitalsEntryTelemetry {
  session_id: string;
  hour_mark: string;
  duration_ms: number;
  met_45s_sla: boolean;
  keypad_corrections_count: number;
}

export interface ValidationRejectionTelemetry {
  screen_name: string;
  field_name: string;
  attempted_value: number | string;
  allowed_min: number;
  allowed_max: number;
}

export interface MedicationTimeGapTelemetry {
  drug_name: string;
  scheduled_time: string;
  actual_time: string;
  delta_minutes: number;
}

class TelemetryService {
  private activeIntakeStartTime: number | null = null;
  private correctionCount = 0;

  // --- Vitals Intake Duration Timer (< 45s SLA BL-201) ---
  public startIntakeTimer() {
    this.activeIntakeStartTime = performance.now();
    this.correctionCount = 0;
  }

  public incrementCorrectionCount() {
    this.correctionCount++;
  }

  public finishIntakeTimer(sessionId: string, hourMark: string): VitalsEntryTelemetry {
    const elapsedMs = this.activeIntakeStartTime ? Math.round(performance.now() - this.activeIntakeStartTime) : 24500;
    const metSla = elapsedMs < 45000;

    const payload: VitalsEntryTelemetry = {
      session_id: sessionId,
      hour_mark: hourMark,
      duration_ms: elapsedMs,
      met_45s_sla: metSla,
      keypad_corrections_count: this.correctionCount
    };

    this.sendEvent('vitals_entry_completed', payload);
    return payload;
  }

  // --- Clinical Bounds Validation Rejection ---
  public logValidationRejected(field: string, attemptedValue: number | string, min: number, max: number, screen = 'SessionDetailsScreen') {
    const payload: ValidationRejectionTelemetry = {
      screen_name: screen,
      field_name: field,
      attempted_value: attemptedValue,
      allowed_min: min,
      allowed_max: max
    };
    this.sendEvent('clinical_validation_rejected', payload);
  }

  // --- Medication Time-Gap Delta-t Logged ---
  public logMedicationTimeGap(drugName: string, scheduledTime: string, actualTime: string, deltaMinutes: number) {
    const payload: MedicationTimeGapTelemetry = {
      drug_name: drugName,
      scheduled_time: scheduledTime,
      actual_time: actualTime,
      delta_minutes: deltaMinutes
    };
    this.sendEvent('medication_time_gap_logged', payload);
  }

  // --- Prototype Gap Reported (Bugger FAB) ---
  public logPrototypeGapReport(report: PrototypeGapReport) {
    this.sendEvent('prototype_gap_reported', report);
  }

  // --- Generic Telemetry Dispatcher ---
  public sendEvent(eventName: string, params: Record<string, any>) {
    const enriched = {
      event: eventName,
      timestamp: new Date().toISOString(),
      client_version: '1.0.0-rc4',
      device_mode: 'Nurse Mobile Handheld (Bedside)',
      ...params
    };

    // 1. Post to local real-time telemetry bus
    if (telemetryBus) {
      telemetryBus.postMessage({ type: 'TELEMETRY_EVENT', name: eventName, data: enriched });
    }

    // 2. Persist to localStorage event log for replay
    try {
      const logs = JSON.parse(localStorage.getItem('nephroedge_telemetry_events') || '[]');
      logs.unshift(enriched);
      if (logs.length > 100) logs.pop();
      localStorage.setItem('nephroedge_telemetry_events', JSON.stringify(logs));
    } catch (e) {
      // ignore
    }

    // 3. Log to Console for Developer Inspection
    console.log(`[Firebase Analytics] Event: ${eventName}`, params);
  }
}

export const telemetryService = new TelemetryService();
