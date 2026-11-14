// Initial seed data representing exact records from Figma mockups & clinical backlog
import { Patient, DialysisSession, SessionVitalsLog, SessionMedication, SessionIncident, ClinicalAlert } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: '018f3a12-1001-7000-8000-000000000001',
    patient_code: 'P-1024',
    full_name: 'Ahmed Mohamed',
    age: 45,
    gender: 'Male',
    blood_type: 'O+',
    insurance_provider: 'ABC Insurance',
    policy_number: 'ABC-884920',
    assigned_bed: 'Bed 04 - Bay B',
    vascular_access_type: 'AVF',
    viral_status: 'Negative',
    target_dry_weight_kg: 69.5,
    last_post_weight_kg: 69.4,
    baseline_nadir_sbp: 105.0,
    oxygen_support_advised: 1, // BL-404 Hb = 8.1 g/dL
    session_status: 'In Session',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1002-7000-8000-000000000002',
    patient_code: 'P-1021',
    full_name: 'Mona Ali',
    age: 52,
    gender: 'Female',
    blood_type: 'A+',
    insurance_provider: 'National Health Care',
    policy_number: 'NHC-40912',
    assigned_bed: 'Bed 02 - Bay A',
    vascular_access_type: 'AVF',
    viral_status: 'HCV+', // BL-102 Red Isolation
    target_dry_weight_kg: 62.0,
    last_post_weight_kg: 62.1,
    baseline_nadir_sbp: 95.0,
    oxygen_support_advised: 0,
    session_status: 'In Session',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1003-7000-8000-000000000003',
    patient_code: 'P-1031',
    full_name: 'Omar Hassan',
    age: 38,
    gender: 'Male',
    blood_type: 'B+',
    insurance_provider: 'Misr Life Insurance',
    policy_number: 'MLI-88219',
    assigned_bed: 'Bed 06 - Bay C',
    vascular_access_type: 'AVG',
    viral_status: 'HBV+', // BL-102 Amber Alert
    target_dry_weight_kg: 74.0,
    last_post_weight_kg: 73.8,
    baseline_nadir_sbp: 110.0,
    oxygen_support_advised: 0,
    session_status: 'Waiting',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1004-7000-8000-000000000004',
    patient_code: 'P-1041',
    full_name: 'Sara Mohamed',
    age: 41,
    gender: 'Female',
    blood_type: 'AB+',
    insurance_provider: 'Bupa Global Health',
    policy_number: 'BUP-11942',
    assigned_bed: 'Bed 08 - Bay D',
    vascular_access_type: 'CVC',
    viral_status: 'Negative',
    target_dry_weight_kg: 58.5,
    last_post_weight_kg: 58.2,
    baseline_nadir_sbp: 100.0,
    oxygen_support_advised: 0,
    session_status: 'Waiting',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1005-7000-8000-000000000005',
    patient_code: 'P-1051',
    full_name: 'Nour Ahmed',
    age: 49,
    gender: 'Female',
    blood_type: 'O-',
    insurance_provider: 'CareShield Plus',
    policy_number: 'CSP-9031',
    assigned_bed: 'Bed 01 - Bay A',
    vascular_access_type: 'AVF',
    viral_status: 'Negative',
    target_dry_weight_kg: 65.0,
    last_post_weight_kg: 64.9,
    baseline_nadir_sbp: 102.0,
    oxygen_support_advised: 0,
    session_status: 'Waiting',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1006-7000-8000-000000000006',
    patient_code: 'P-1061',
    full_name: 'Ali Mahmoud',
    age: 60,
    gender: 'Male',
    blood_type: 'A-',
    insurance_provider: 'Allianz Egypt',
    policy_number: 'ALZ-4412',
    assigned_bed: 'Bed 03 - Bay B',
    vascular_access_type: 'AVF',
    viral_status: 'Negative',
    target_dry_weight_kg: 81.0,
    last_post_weight_kg: 80.8,
    baseline_nadir_sbp: 115.0,
    oxygen_support_advised: 0,
    session_status: 'Waiting',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1007-7000-8000-000000000007',
    patient_code: 'P-1081',
    full_name: 'Nada Fathy',
    age: 34,
    gender: 'Female',
    blood_type: 'B-',
    insurance_provider: 'Misr Insurance',
    policy_number: 'MIS-7721',
    assigned_bed: 'Bed 05 - Bay C',
    vascular_access_type: 'AVF',
    viral_status: 'Negative',
    target_dry_weight_kg: 53.0,
    last_post_weight_kg: 53.1,
    baseline_nadir_sbp: 98.0,
    oxygen_support_advised: 0,
    session_status: 'Completed',
    updated_at: new Date().toISOString()
  },
  {
    id: '018f3a12-1008-7000-8000-000000000008',
    patient_code: 'P-1091',
    full_name: 'Mahmoud Youssef',
    age: 58,
    gender: 'Male',
    blood_type: 'O+',
    insurance_provider: 'National Health Care',
    policy_number: 'NHC-9931',
    assigned_bed: 'Bed 07 - Bay D',
    vascular_access_type: 'AVG',
    viral_status: 'Negative',
    target_dry_weight_kg: 77.5,
    last_post_weight_kg: 77.2,
    baseline_nadir_sbp: 108.0,
    oxygen_support_advised: 0,
    session_status: 'Waiting',
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_SESSION: DialysisSession = {
  id: '018f3a22-2001-7000-8000-000000000001',
  session_code: '#SES-2026-0894',
  patient_id: '018f3a12-1001-7000-8000-000000000001',
  station_pod: 'Station A • Pod 2',
  bed_number: 'Bed 04',
  assigned_nurse_name: 'Sara Ali',
  assigned_doctor_name: 'Dr. A. Hassan',
  arrival_weight_kg: 72.0,
  target_dry_weight_kg: 69.5,
  excess_water_liters: 2.5,
  idwg_percentage: 3.6,
  planned_uf_ml: 2500,
  blood_flow_qb_ml_min: 300,
  dialysate_flow_qd_ml_min: 500,
  dialysate_temp_c: 36.5,
  bath_na_meq_l: 138,
  bath_k_meq_l: 2.0,
  bath_hco3_meq_l: 32,
  intake_duration_ms: 32400,
  started_at: '2026-10-01T08:30:00.000Z',
  status: 'Active',
  doctor_directive: 'Maintain UF <= 650 mL/h. Patient reported mild dizziness earlier.',
  doctor_directive_time: '2026-10-01T09:48:00.000Z'
};

export const INITIAL_VITALS: SessionVitalsLog[] = [
  {
    id: '018f3a33-3001-7000-8000-000000000001',
    session_id: '018f3a22-2001-7000-8000-000000000001',
    hour_mark: 'Pre-HD',
    systolic_bp: 130,
    diastolic_bp: 80,
    mean_arterial_pressure: 96.7, // 80 + (130 - 80) / 3
    heart_rate_bpm: 78,
    spo2_percentage: 98,
    temperature_c: 36.8,
    current_uf_rate_ml_h: 625,
    news2_score: 1,
    idh_risk_probability: 0.12,
    shap_drivers_json: JSON.stringify([
      { feature: 'uf_rate_kg_h', impact: 0.28, display_name: 'High UF Removal Rate (8.9 mL/kg/h)', clinical_context: 'UF rate approaches safe microcirculatory refill threshold', suggested_action: 'Reduce UF Rate' },
      { feature: 'delta_sbp_pre_hd', impact: 0.19, display_name: 'Pre-HD SBP Borderline Nadir', clinical_context: 'Pre-session MAP is within low-normal spectrum', suggested_action: 'Cool Dialysate to 35.5°C' },
      { feature: 'serum_albumin', impact: -0.14, display_name: 'Protective Serum Albumin (4.1 g/dL)', clinical_context: 'Oncotic pressure supports adequate intravascular refill', suggested_action: 'Continue Monitoring' }
    ]),
    entry_duration_ms: 18200,
    recorded_at: '2026-10-01T08:35:00.000Z'
  }
];

export const INITIAL_MEDICATIONS: SessionMedication[] = [
  {
    id: '018f3a44-4001-7000-8000-000000000001',
    session_id: '018f3a22-2001-7000-8000-000000000001',
    drug_name: 'Heparin Sodium',
    dosage: '1000 IU Bolus',
    scheduled_time: '08:30 AM',
    administered_time: '08:32 AM',
    time_gap_minutes: 2,
    administered_by: 'Sara Ali',
    status: 'Administered'
  },
  {
    id: '018f3a44-4002-7000-8000-000000000002',
    session_id: '018f3a22-2001-7000-8000-000000000001',
    drug_name: 'Epoetin alfa (EPO)',
    dosage: '4000 IU IV',
    scheduled_time: '10:30 AM',
    status: 'Upcoming'
  },
  {
    id: '018f3a44-4003-7000-8000-000000000003',
    session_id: '018f3a22-2001-7000-8000-000000000001',
    drug_name: 'IV Iron Sucrose (Venofer)',
    dosage: '100 mg slow IV push',
    scheduled_time: '11:00 AM',
    status: 'Upcoming'
  }
];

export const INITIAL_INCIDENTS: SessionIncident[] = [
  {
    id: '018f3a55-5001-7000-8000-000000000001',
    session_id: '018f3a22-2001-7000-8000-000000000001',
    incident_type: 'Transient Mild Hypotension',
    severity: 'Medium',
    action_taken: 'UF rate paused for 5 mins; blood pressure re-checked and normalized.',
    notes: 'Slight dizziness noted during UF run. Rate paused for 5 mins; blood pressure re-checked and normalized.',
    is_resolved: 1,
    logged_at: '2026-10-01T09:45:00.000Z'
  }
];

export const INITIAL_ALERTS: ClinicalAlert[] = [
  {
    id: 'alert-01',
    category: 'CLINICAL',
    severity: 'High',
    patient_name: 'Ahmed Mohamed',
    bed_number: 'Bed 04',
    patient_code: 'P-1024',
    description: 'Pre-session review recommended — elevated BP recorded prior to cannulation (168/96 mmHg). Target dry weight verification required.',
    time_label: 'Today • 09:10 AM',
    action_label: 'View Session >',
    action_route: 'session'
  },
  {
    id: 'alert-02',
    category: 'SESSION',
    severity: 'High',
    patient_name: 'Mona Ali',
    bed_number: 'Bed 02',
    patient_code: 'P-1021',
    description: 'Sudden drop in MAP detected during UF hour 3 (MAP 58 mmHg). Automated ultrafiltration suspended pending nursing assessment.',
    time_label: 'Today • 08:45 AM',
    action_label: 'Machine Telemetry >',
    action_route: 'session'
  },
  {
    id: 'alert-03',
    category: 'RISK',
    severity: 'Medium',
    patient_name: 'Omar Hassan',
    bed_number: 'Bed 06',
    patient_code: 'P-1031',
    description: 'Ultrafiltration rate threshold warning — circuit arterial pressure deviation (-220 mmHg). Please inspect vascular access line.',
    time_label: 'Today • 08:15 AM',
    action_label: 'Access Log >',
    action_route: 'profile'
  }
];
