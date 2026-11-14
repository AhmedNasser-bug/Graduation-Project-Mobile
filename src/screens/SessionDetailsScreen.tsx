import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Heart, 
  Wind, 
  Thermometer, 
  Droplet, 
  Check, 
  Activity, 
  AlertTriangle, 
  Edit3, 
  Plus, 
  Clock, 
  Cpu, 
  Pill, 
  CheckCircle2,
  ShieldAlert,
  Send
} from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { sqliteService } from '../db/sqliteHelper';
import { telemetryService } from '../services/telemetryService';
import { DialysisSession, SessionVitalsLog, SessionMedication, SessionIncident, HourMark } from '../types';
import { NumericKeypadModal } from '../components/NumericKeypadModal';
import { TreeSHAPModal } from '../components/TreeSHAPModal';
import { MachineSettingsDrawer } from '../components/MachineSettingsDrawer';

interface SessionDetailsScreenProps {
  onBack: () => void;
  onOpenPatientProfile: (patientId: string) => void;
}

export const SessionDetailsScreen: React.FC<SessionDetailsScreenProps> = ({
  onBack,
  onOpenPatientProfile
}) => {
  const [session, setSession] = useState<DialysisSession | null>(null);
  const [vitalsList, setVitalsList] = useState<SessionVitalsLog[]>([]);
  const [medications, setMedications] = useState<SessionMedication[]>([]);
  const [incidents, setIncidents] = useState<SessionIncident[]>([]);
  const [selectedHour, setSelectedHour] = useState<HourMark>('Pre-HD');

  // Modals state
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isShapOpen, setIsShapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [selectedIncidentType, setSelectedIncidentType] = useState('Transient Mild Hypotension');
  const [incidentAction, setIncidentAction] = useState('Reduced UF rate & re-checked BP');
  const [incidentNotes, setIncidentNotes] = useState('');

  const hourMarks: HourMark[] = ['Pre-HD', 'Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Post-HD'];

  const refreshData = () => {
    const s = sqliteService.getActiveSession();
    if (s) {
      setSession(s);
      setVitalsList(sqliteService.getVitalsForSession(s.id));
      setMedications(sqliteService.getMedicationsForSession(s.id));
      setIncidents(sqliteService.getIncidentsForSession(s.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!session) {
    return (
      <div className="w-full h-full bg-[#EAF6FA] flex items-center justify-center text-brand-dark">
        Loading session flowsheet...
      </div>
    );
  }

  // Active vitals for selected hour mark or latest fallback
  const currentHourVitals = vitalsList.find(v => v.hour_mark === selectedHour) || vitalsList[vitalsList.length - 1] || {
    systolic_bp: 130,
    diastolic_bp: 80,
    mean_arterial_pressure: 96.7,
    spo2_percentage: 98,
    heart_rate_bpm: 78,
    temperature_c: 36.8,
    news2_score: 1,
    idh_risk_probability: 0.12,
    current_uf_rate_ml_h: 625,
    shap_drivers_json: ''
  };

  const handleAdministerMed = (medId: string) => {
    const updated = sqliteService.administerMedication(medId, 'Sara Ali');
    if (updated) {
      telemetryService.logMedicationTimeGap(
        updated.drug_name,
        updated.scheduled_time,
        updated.administered_time || '10:44 AM',
        updated.time_gap_minutes || 14
      );
      refreshData();
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    sqliteService.addIncident({
      session_id: session.id,
      incident_type: selectedIncidentType,
      severity: selectedIncidentType.includes('Air Embolism') ? 'High' : 'Medium',
      action_taken: incidentAction,
      notes: incidentNotes,
      is_resolved: 1
    });
    setIsIncidentModalOpen(false);
    setIncidentNotes('');
    refreshData();
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-24">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Top Header with Back Button */}
        <div className="px-6 pt-2 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-[#7BAEC4] bg-white text-[#0B2E40] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-xl font-bold text-[#0B2E40]">Session Details</h1>
          <div className="w-10"></div>
        </div>

        {/* Doctor Directive Banner (if active) */}
        {session.doctor_directive && (
          <div className="mx-6 mb-3 p-3 bg-blue-900 text-white rounded-2xl shadow-md border border-cyan-400 flex items-start space-x-2.5 animate-pulse">
            <ShieldAlert size={18} className="text-cyan-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="font-bold text-cyan-200 flex items-center justify-between">
                <span>Doctor Directive ({session.assigned_doctor_name})</span>
                <span className="text-[10px] text-white/70">Live Stream</span>
              </div>
              <p className="mt-0.5 font-medium">{session.doctor_directive}</p>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="px-6 space-y-4">

          {/* Top Session Code & Machine Metadata Card */}
          <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1 text-xs font-bold text-[#12617A]">
                <span>#</span>
                <span className="tracking-wide">{session.session_code}</span>
              </div>
              <div className="text-xs text-[#5A7684]">
                Oct 1, 2026 • 08:30 AM
              </div>
            </div>

            {/* BL-202 Machine Settings Chip */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-canvas border border-[#7BAEC4] px-3 py-1.5 rounded-xl text-left hover:bg-white active:scale-95 transition-all shadow-2xs"
            >
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#12617A]">
                <Cpu size={13} />
                <span>Fresenius 4008S #04</span>
              </div>
              <div className="text-[10px] text-[#5A7684]">
                Qb: {session.blood_flow_qb_ml_min} | Qd: {session.dialysate_flow_qd_ml_min} | {session.dialysate_temp_c}°C
              </div>
            </button>
          </div>

          {/* SESSION PERSONNEL & BED Card */}
          <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5A7684] uppercase tracking-wider">
                SESSION PERSONNEL &amp; BED
              </span>
              <span className="font-bold text-[#12617A] bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                {session.station_pod}
              </span>
            </div>

            {/* Patient Row */}
            <div 
              onClick={() => onOpenPatientProfile(session.patient_id)}
              className="p-2.5 rounded-xl bg-canvas border border-brand-border/40 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-300 text-[#12617A] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-[#5A7684]">Patient</div>
                  <div className="text-sm font-bold text-[#0B2E40]">Ahmed Mohamed</div>
                </div>
              </div>

              <div className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg border border-blue-200">
                {session.bed_number}
              </div>
            </div>

            {/* Assigned Nurse & Doctor Columns */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-canvas border border-brand-border/40 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Plus size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-[#5A7684]">Assigned Nurse</div>
                  <div className="font-bold text-[#0B2E40]">{session.assigned_nurse_name}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-canvas border border-brand-border/40 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 3h15M12 3v11M8 14h8M12 17v4M8 21h8" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-[#5A7684]">Assigned Doctor</div>
                  <div className="font-bold text-[#0B2E40]">{session.assigned_doctor_name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Telemetry Timeline Switcher (BL-203) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5A7684] uppercase tracking-wider">
                HOURLY VITALS TIMELINE (BL-203)
              </span>
              <span className="text-[10px] text-[#12617A] font-semibold">1-Tap Selector</span>
            </div>

            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {hourMarks.map((hr) => {
                const isSelected = selectedHour === hr;
                const hasLog = vitalsList.some(v => v.hour_mark === hr);
                return (
                  <button
                    key={hr}
                    type="button"
                    onClick={() => setSelectedHour(hr)}
                    className={`min-h-[38px] px-3 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-[#12617A] text-white shadow-xs'
                        : hasLog
                          ? 'bg-white border border-[#7BAEC4] text-[#0B2E40]'
                          : 'bg-white/50 border border-dashed border-gray-300 text-gray-400'
                    }`}
                  >
                    <span>{hr}</span>
                    {hasLog && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Measurements 2x2 Grid */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              Session Measurements ({selectedHour})
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Blood Pressure Card */}
              <div className="bg-white border border-[#7BAEC4] rounded-2xl p-3.5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5A7684]">
                  <span>Blood Pressure</span>
                  <Heart size={16} className="text-[#12617A]" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-[#0B2E40]">
                    {currentHourVitals.systolic_bp}/{currentHourVitals.diastolic_bp}
                  </span>
                  <span className="text-[11px] text-[#5A7684]">mmHg</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <Check size={12} className="mr-0.5" /> Normal
                  </span>
                  <span className="text-[10px] text-[#5A7684] font-mono">
                    MAP: {currentHourVitals.mean_arterial_pressure}
                  </span>
                </div>
              </div>

              {/* Oxygen (SpO2) Card */}
              <div className="bg-white border border-[#7BAEC4] rounded-2xl p-3.5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5A7684]">
                  <span>Oxygen (SpO2)</span>
                  <Wind size={16} className="text-[#12617A]" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-[#0B2E40]">
                    {currentHourVitals.spo2_percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <Check size={12} className="mr-0.5" /> Optimal range
                  </span>
                  <span className="text-[10px] text-[#5A7684] font-mono">
                    HR: {currentHourVitals.heart_rate_bpm} bpm
                  </span>
                </div>
              </div>

              {/* Temperature Card */}
              <div className="bg-white border border-[#7BAEC4] rounded-2xl p-3.5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5A7684]">
                  <span>Temperature</span>
                  <Thermometer size={16} className="text-[#12617A]" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-[#0B2E40]">
                    {currentHourVitals.temperature_c}
                  </span>
                  <span className="text-[11px] text-[#5A7684]">°C</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center pt-0.5">
                  <Check size={12} className="mr-0.5" /> Afebrile
                </div>
              </div>

              {/* Excess Water / Fluid Removal Card (BL-201 & BL-601) */}
              <div className="bg-white border border-[#7BAEC4] rounded-2xl p-3.5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5A7684]">
                  <span>Excess Water</span>
                  <Droplet size={16} className="text-[#12617A]" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-[#0B2E40]">
                    {session.excess_water_liters || 2.5}
                  </span>
                  <span className="text-[11px] text-[#5A7684]">L</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5A7684] pt-0.5">
                  <span>Target removal</span>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1 rounded">
                    IDWG: {session.idwg_percentage || 3.6}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Early Warning Score & TreeSHAP Risk Banner (BL-502 & BL-503) */}
          <div 
            onClick={() => setIsShapOpen(true)}
            className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#12617A] active:scale-98 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-[#12617A] flex items-center justify-center flex-shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0B2E40]">Early Warning Score</div>
                <div className="text-xs text-[#5A7684]">NEWS2 Clinical Protocol • Tap for TreeSHAP</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-[#0B2E40]">
                {currentHourVitals.news2_score}
              </span>
            </div>
          </div>

          {/* Scheduled Mid-Session eMAR & Time-Gap Tracker (BL-301 & BL-302) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5A7684] uppercase tracking-wider">
                MID-SESSION eMAR &amp; TIME-GAP TRACKER (BL-301)
              </span>
              <span className="text-[10px] text-[#12617A] font-semibold">Shift Queue</span>
            </div>

            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 overflow-hidden text-xs">
              {medications.map((m) => {
                const isAdministered = m.status === 'Administered';
                return (
                  <div key={m.id} className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#0B2E40] flex items-center space-x-1.5">
                        <Pill size={14} className={isAdministered ? 'text-emerald-600' : 'text-amber-500'} />
                        <span>{m.drug_name}</span>
                      </div>
                      <div className="text-[11px] text-[#5A7684]">
                        {m.dosage} • Sched: {m.scheduled_time}
                      </div>

                      {isAdministered && (
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Administered at {m.administered_time} (Δt: +{m.time_gap_minutes} mins)
                        </div>
                      )}
                    </div>

                    <div>
                      {isAdministered ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 size={12} />
                          <span>Given</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdministerMed(m.id)}
                          className="min-h-[36px] px-3 rounded-full bg-[#12617A] text-white font-bold text-xs hover:bg-brand-accent active:scale-95 transition-all shadow-xs"
                        >
                          Administer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Report Section (BL-204) */}
          <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B2E40]">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Incident Report</span>
              </div>
              <button
                type="button"
                onClick={() => setIsIncidentModalOpen(true)}
                className="text-xs font-bold text-[#12617A] hover:underline flex items-center space-x-0.5"
              >
                <span>+ Add Incident</span>
              </button>
            </div>

            {incidents.map((inc) => (
              <div key={inc.id} className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B2E40]">{inc.incident_type}</span>
                  <span className="bg-[#E0E7FF] text-[#1E3A8A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Resolved
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-[#5A7684]">
                  <Clock size={12} />
                  <span>{new Date(inc.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[#0B2E40] text-[11px] leading-relaxed">
                  {inc.notes || inc.action_taken}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Primary Bottom Button (Update Measurements) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#7BAEC4]/40 z-30 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setIsKeypadOpen(true)}
          className="w-full min-h-[48px] rounded-full bg-[#12617A] text-white text-base font-bold shadow-md hover:bg-[#0f4f64] active:scale-98 transition-all flex items-center justify-center space-x-2"
        >
          <Edit3 size={18} />
          <span>Update Measurements</span>
        </button>
      </div>

      {/* Numeric Keypad Modal */}
      <NumericKeypadModal
        sessionId={session.id}
        hourMark={selectedHour}
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        onSuccess={refreshData}
      />

      {/* TreeSHAP Modal */}
      <TreeSHAPModal
        isOpen={isShapOpen}
        onClose={() => setIsShapOpen(false)}
        sessionId={session.id}
        idhProbability={currentHourVitals.idh_risk_probability}
        news2Score={currentHourVitals.news2_score}
        driversJson={currentHourVitals.shap_drivers_json}
        onActionCommitted={refreshData}
      />

      {/* Machine Settings Drawer */}
      <MachineSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sessionId={session.id}
        initialSettings={{
          qb: session.blood_flow_qb_ml_min,
          qd: session.dialysate_flow_qd_ml_min,
          temp: session.dialysate_temp_c,
          bathNa: session.bath_na_meq_l,
          bathK: session.bath_k_meq_l,
          bathHco3: session.bath_hco3_meq_l,
        }}
        onSave={refreshData}
      />

      {/* Add Incident Modal */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden">
            <div className="bg-[#12617A] text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-sm">Log Clinical Incident (BL-204)</span>
              <button onClick={() => setIsIncidentModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateIncident} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-dark block mb-1">Complication Type:</label>
                <select
                  value={selectedIncidentType}
                  onChange={(e) => setSelectedIncidentType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
                >
                  <option value="Transient Mild Hypotension">Transient Mild Hypotension</option>
                  <option value="Severe Muscle Cramps">Severe Muscle Cramps</option>
                  <option value="Access Hematoma/Leak">Access Hematoma/Leak</option>
                  <option value="Nausea/Vomiting">Nausea/Vomiting</option>
                  <option value="Line Clotting">Line Clotting</option>
                  <option value="Air Embolism Alert">Air Embolism Alert</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-brand-dark block mb-1">Action Taken:</label>
                <input
                  type="text"
                  required
                  value={incidentAction}
                  onChange={(e) => setIncidentAction(e.target.value)}
                  className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
                />
              </div>

              <div>
                <label className="font-bold text-brand-dark block mb-1">Clinical Notes:</label>
                <textarea
                  rows={2}
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  placeholder="Additional observations..."
                  className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="flex-1 min-h-[44px] rounded-full border border-brand-border text-brand-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-full bg-[#12617A] text-white font-bold"
                >
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
