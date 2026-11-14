// SQLite DDL Schema for NephroEdge Mobile Prototype
// Strictly adheres to Week 4 Specification (WAL mode, UUIDv7, physiological bounds)

export const SQLITE_SCHEMA_DDL = `
-- Enable Write-Ahead Logging for zero lock contention during background Firebase sync
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- 1. Patients Table (Aligned with BL-101, BL-102, BL-404)
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    patient_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK(gender IN ('Male', 'Female')) NOT NULL,
    blood_type TEXT NOT NULL,
    insurance_provider TEXT,
    policy_number TEXT,
    assigned_bed TEXT,
    vascular_access_type TEXT CHECK(vascular_access_type IN ('AVF', 'AVG', 'CVC')) DEFAULT 'AVF',
    viral_status TEXT CHECK(viral_status IN ('Negative', 'HCV+', 'HBV+', 'HIV+')) NOT NULL DEFAULT 'Negative',
    target_dry_weight_kg REAL NOT NULL,
    last_post_weight_kg REAL,
    baseline_nadir_sbp REAL DEFAULT 100.0,
    oxygen_support_advised INTEGER DEFAULT 0,
    session_status TEXT CHECK(session_status IN ('In Session', 'Waiting', 'Completed')) DEFAULT 'Waiting',
    updated_at TEXT NOT NULL
);

-- 2. Dialysis Sessions Table (Aligned with BL-201, BL-202, BL-205)
CREATE TABLE IF NOT EXISTS dialysis_sessions (
    id TEXT PRIMARY KEY,
    session_code TEXT NOT NULL UNIQUE,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    station_pod TEXT NOT NULL,
    bed_number TEXT NOT NULL,
    assigned_nurse_name TEXT NOT NULL,
    assigned_doctor_name TEXT NOT NULL,
    arrival_weight_kg REAL,
    target_dry_weight_kg REAL NOT NULL,
    excess_water_liters REAL,
    idwg_percentage REAL,
    planned_uf_ml REAL,
    blood_flow_qb_ml_min REAL DEFAULT 300,
    dialysate_flow_qd_ml_min REAL DEFAULT 500,
    dialysate_temp_c REAL DEFAULT 36.5,
    bath_na_meq_l REAL DEFAULT 138,
    bath_k_meq_l REAL DEFAULT 2.0,
    bath_hco3_meq_l REAL DEFAULT 32,
    post_weight_kg REAL,
    actual_uf_removed_ml REAL,
    intake_duration_ms INTEGER,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    status TEXT CHECK(status IN ('Pre-Session', 'Active', 'Completed')) DEFAULT 'Active',
    doctor_directive TEXT,
    doctor_directive_time TEXT
);

-- 3. Hourly Vitals & Telemetry Logs (Aligned with BL-203, BL-502, BL-503)
CREATE TABLE IF NOT EXISTS session_vitals_logs (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES dialysis_sessions(id),
    hour_mark TEXT CHECK(hour_mark IN ('Pre-HD', 'Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Post-HD')) NOT NULL,
    systolic_bp INTEGER NOT NULL CHECK(systolic_bp BETWEEN 40 AND 300),
    diastolic_bp INTEGER NOT NULL CHECK(diastolic_bp BETWEEN 20 AND 200),
    mean_arterial_pressure REAL NOT NULL,
    heart_rate_bpm INTEGER NOT NULL CHECK(heart_rate_bpm BETWEEN 30 AND 240),
    spo2_percentage INTEGER NOT NULL CHECK(spo2_percentage BETWEEN 50 AND 100),
    temperature_c REAL NOT NULL CHECK(temperature_c BETWEEN 34.0 AND 42.0),
    current_uf_rate_ml_h REAL NOT NULL,
    news2_score INTEGER NOT NULL DEFAULT 0,
    idh_risk_probability REAL NOT NULL DEFAULT 0.12,
    shap_drivers_json TEXT,
    entry_duration_ms INTEGER,
    recorded_at TEXT NOT NULL
);

-- 4. Scheduled Medications & Time-Gap Tracker (Aligned with BL-301, BL-302)
CREATE TABLE IF NOT EXISTS session_medications (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES dialysis_sessions(id),
    drug_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    administered_time TEXT,
    time_gap_minutes INTEGER,
    administered_by TEXT,
    status TEXT CHECK(status IN ('Upcoming', 'Due Now', 'Overdue', 'Administered')) DEFAULT 'Upcoming'
);

-- 5. Structured Clinical Incidents (Aligned with BL-204)
CREATE TABLE IF NOT EXISTS session_incidents (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES dialysis_sessions(id),
    incident_type TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('Low', 'Medium', 'High')) NOT NULL,
    action_taken TEXT NOT NULL,
    notes TEXT,
    is_resolved INTEGER DEFAULT 1,
    logged_at TEXT NOT NULL
);

-- 6. Transactional Outbox & UX Telemetry Queue (Syncs to Firebase Firestore)
CREATE TABLE IF NOT EXISTS sync_outbox (
    id TEXT PRIMARY KEY,
    collection_target TEXT NOT NULL,
    document_id TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    sync_status TEXT CHECK(sync_status IN ('PENDING', 'SYNCED', 'FAILED')) DEFAULT 'PENDING',
    retry_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);

-- 7. Prototype Gap Reports (From Bedside Feedback Bugger FAB)
CREATE TABLE IF NOT EXISTS prototype_gap_reports (
    id TEXT PRIMARY KEY,
    screen_name TEXT NOT NULL,
    category TEXT NOT NULL,
    nurse_note TEXT NOT NULL,
    sqlite_state_dump TEXT,
    created_at TEXT NOT NULL
);
`;
