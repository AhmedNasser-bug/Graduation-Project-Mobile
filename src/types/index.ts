// Clinical & System Type Definitions for NephroEdge Week 4 MFP Prototype

export type Gender = 'Male' | 'Female';
export type VascularAccessType = 'AVF' | 'AVG' | 'CVC';
export type ViralStatus = 'Negative' | 'HCV+' | 'HBV+' | 'HIV+';
export type SessionStatus = 'Waiting' | 'In Session' | 'Completed';
export type DialysisStatus = 'Pre-Session' | 'Active' | 'Completed';
export type HourMark = 'Pre-HD' | 'Hour 1' | 'Hour 2' | 'Hour 3' | 'Hour 4' | 'Post-HD';
export type OutboxStatus = 'PENDING' | 'SYNCED' | 'FAILED';
export type AlertSeverity = 'High' | 'Medium' | 'Low';
export type AlertCategory = 'CLINICAL' | 'SESSION' | 'RISK';
export type ClinicalRole = 'Doctor' | 'Nurse';

export interface Patient {
  id: string; // UUIDv7
  patient_code: string; // e.g. P-1024
  full_name: string;
  age: number;
  gender: Gender;
  blood_type: string;
  insurance_provider: string;
  policy_number: string;
  assigned_bed: string; // e.g. Bed 04 - Bay B
  vascular_access_type: VascularAccessType;
  viral_status: ViralStatus;
  target_dry_weight_kg: number;
  last_post_weight_kg?: number;
  baseline_nadir_sbp: number;
  oxygen_support_advised: number; // 0 or 1 (BL-404 if Hb < 8.5)
  session_status: SessionStatus;
  updated_at: string;
}

export interface DialysisSession {
  id: string; // UUIDv7
  session_code: string; // e.g. #SES-2026-0894
  patient_id: string;
  station_pod: string; // e.g. Station A • Pod 2
  bed_number: string; // e.g. Bed 04
  assigned_nurse_name: string;
  assigned_doctor_name: string;
  arrival_weight_kg?: number;
  target_dry_weight_kg: number;
  excess_water_liters?: number;
  idwg_percentage?: number;
  planned_uf_ml?: number;
  blood_flow_qb_ml_min: number;
  dialysate_flow_qd_ml_min: number;
  dialysate_temp_c: number;
  bath_na_meq_l?: number;
  bath_k_meq_l?: number;
  bath_hco3_meq_l?: number;
  post_weight_kg?: number;
  actual_uf_removed_ml?: number;
  intake_duration_ms?: number;
  started_at: string;
  ended_at?: string;
  status: DialysisStatus;
  doctor_directive?: string;
  doctor_directive_time?: string;
}

export interface SessionVitalsLog {
  id: string; // UUIDv7
  session_id: string;
  hour_mark: HourMark;
  systolic_bp: number;
  diastolic_bp: number;
  mean_arterial_pressure: number;
  heart_rate_bpm: number;
  spo2_percentage: number;
  temperature_c: number;
  current_uf_rate_ml_h: number;
  news2_score: number;
  idh_risk_probability: number;
  shap_drivers_json: string;
  entry_duration_ms: number;
  recorded_at: string;
}

export interface SessionMedication {
  id: string; // UUIDv7
  session_id: string;
  drug_name: string;
  dosage: string;
  scheduled_time: string;
  administered_time?: string;
  time_gap_minutes?: number;
  administered_by?: string;
  status: 'Upcoming' | 'Due Now' | 'Overdue' | 'Administered';
}

export interface SessionIncident {
  id: string; // UUIDv7
  session_id: string;
  incident_type: string;
  severity: AlertSeverity;
  action_taken: string;
  notes?: string;
  is_resolved: number;
  logged_at: string;
}

export interface SyncOutboxRecord {
  id: string;
  collection_target: string;
  document_id: string;
  payload_json: string;
  sync_status: OutboxStatus;
  retry_count: number;
  created_at: string;
}

export interface PrototypeGapReport {
  id: string;
  screen_name: string;
  category: 'MISSING_FIELD' | 'UX_FRICTION' | 'LOGIC_ERROR' | 'INPUT_BOUND';
  nurse_note: string;
  sqlite_state_dump: string;
  created_at: string;
}

export interface ClinicalAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  patient_name: string;
  bed_number: string;
  patient_code: string;
  description: string;
  time_label: string;
  action_label: string;
  action_route: string;
}

export interface TreeShapDriver {
  feature: string;
  impact: number; // positive = increased risk, negative = protective
  display_name: string;
  clinical_context: string;
  suggested_action: string;
}
