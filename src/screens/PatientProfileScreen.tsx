import React, { useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Files, 
  FlaskConical, 
  Pill, 
  History, 
  ChevronRight, 
  Wind,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { sqliteService } from '../db/sqliteHelper';

interface PatientProfileScreenProps {
  patientId: string;
  onBack: () => void;
  onOpenSession: () => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  patientId,
  onBack,
  onOpenSession
}) => {
  const patient = sqliteService.getPatientById(patientId) || sqliteService.getPatients().patients[0];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-10">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Top Header with Circular Back Button */}
        <div className="px-6 pt-2 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-[#7BAEC4] bg-white text-[#0B2E40] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-xl font-bold text-[#0B2E40]">Patient Details</h1>
          <div className="w-10"></div>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-3 space-y-4">
          
          {/* Header Card */}
          <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">
            {/* Avatar AM */}
            <div className="w-14 h-14 rounded-full bg-[#EAF6FA] border border-[#7BAEC4] text-[#12617A] text-lg font-bold flex items-center justify-center flex-shrink-0">
              {patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0B2E40] leading-tight">
                  {patient.full_name}
                </h2>
                {/* Viral Status Badge */}
                {patient.viral_status === 'HCV+' && (
                  <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                    HCV (+) Isolation
                  </span>
                )}
                {patient.viral_status === 'Negative' && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Viral Negative
                  </span>
                )}
              </div>

              <div className="text-xs text-[#5A7684]">
                ID: <span className="font-semibold text-[#0B2E40]">{patient.patient_code}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-[#5A7684]">
                {/* Hospital Bed Icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#12617A" strokeWidth="2">
                  <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
                </svg>
                <span>Assigned: {patient.assigned_bed}</span>
              </div>

              {/* BL-404 Oxygen Support Advised Badge */}
              {patient.oxygen_support_advised === 1 && (
                <div className="pt-1">
                  <span className="bg-cyan-50 text-cyan-800 border border-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                    <Wind size={10} className="text-cyan-700" />
                    <span>Oxygen Support Advised (Hb &lt; 8.5 g/dL)</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PERSONAL INFORMATION Card */}
          <div>
            <h3 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              PERSONAL INFORMATION
            </h3>

            <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs divide-y divide-gray-100 text-xs">
              <div className="flex justify-between py-2 first:pt-0">
                <span className="text-[#5A7684]">Full Name</span>
                <span className="font-bold text-[#0B2E40]">{patient.full_name}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-[#5A7684]">Patient ID</span>
                <span className="font-semibold text-[#0B2E40]">{patient.patient_code}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-[#5A7684]">Age / Gender</span>
                <span className="font-medium text-[#0B2E40]">{patient.age} yrs • {patient.gender}</span>
              </div>

              <div className="flex justify-between py-2 items-center">
                <span className="text-[#5A7684]">Blood Type</span>
                <span className="px-2 py-0.5 rounded border border-red-300 text-red-600 font-bold text-[11px] bg-red-50">
                  {patient.blood_type}
                </span>
              </div>

              <div className="flex justify-between py-2 items-baseline">
                <span className="text-[#5A7684]">Insurance Provider</span>
                <div className="text-right">
                  <span className="font-bold text-[#0B2E40] block">{patient.insurance_provider}</span>
                  <span className="text-[10px] text-[#5A7684]">Policy #{patient.policy_number}</span>
                </div>
              </div>

              <div className="flex justify-between py-2 last:pb-0">
                <span className="text-[#5A7684]">Vascular Access</span>
                <span className="font-bold text-[#12617A]">{patient.vascular_access_type} (Left Forearm)</span>
              </div>
            </div>
          </div>

          {/* MEDICAL INFORMATION Accordion Card */}
          <div>
            <h3 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              MEDICAL INFORMATION
            </h3>

            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 overflow-hidden">
              {/* Medical History */}
              <div 
                onClick={() => toggleSection('history')}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 text-[#12617A] flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2E40]">Medical History</div>
                    <div className="text-[11px] text-[#5A7684]">ESRD, Hypertension (Stage 2)</div>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSection === 'history' ? 'rotate-90' : ''}`} />
              </div>

              {expandedSection === 'history' && (
                <div className="p-3.5 bg-canvas/30 text-xs text-[#0B2E40] space-y-1">
                  <p>• Primary Etiology: Diabetic Nephropathy &amp; Nephrosclerosis.</p>
                  <p>• Dialysis Initiation: November 2024.</p>
                  <p>• Baseline Nadir SBP: {patient.baseline_nadir_sbp} mmHg.</p>
                </div>
              )}

              {/* Medical Reports */}
              <div 
                onClick={() => toggleSection('reports')}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <Files size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2E40]">Medical Reports</div>
                    <div className="text-[11px] text-[#5A7684]">3 reports available (Latest: Sep 2026)</div>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSection === 'reports' ? 'rotate-90' : ''}`} />
              </div>

              {expandedSection === 'reports' && (
                <div className="p-3.5 bg-canvas/30 text-xs text-[#0B2E40] space-y-1">
                  <p>• Echocardiography (Sep 14, 2026): LVEF 55%, mild concentric LVH.</p>
                  <p>• Vascular Access Doppler (Aug 22, 2026): AVF flow 950 mL/min, patent.</p>
                  <p>• Chest X-Ray (Jul 10, 2026): Cardiomegaly grade 1, clear costophrenic angles.</p>
                </div>
              )}

              {/* Laboratory Results */}
              <div 
                onClick={() => toggleSection('labs')}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <FlaskConical size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2E40]">Laboratory Results</div>
                    <div className="text-[11px] text-[#5A7684]">Urea, Creatinine, Electrolytes (Updated 2d ago)</div>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSection === 'labs' ? 'rotate-90' : ''}`} />
              </div>

              {expandedSection === 'labs' && (
                <div className="p-3.5 bg-canvas/30 text-xs text-[#0B2E40] space-y-1 font-mono">
                  <p>• Serum Creatinine: 8.4 mg/dL | BUN: 72 mg/dL</p>
                  <p>• Potassium (K+): 5.1 mEq/L | Sodium (Na+): 139 mEq/L</p>
                  <p>• Hemoglobin (Hb): 8.1 g/dL (BL-404 Alert Triggered)</p>
                  <p>• Ferritin: 380 ng/mL | TSAT: 24%</p>
                </div>
              )}
            </div>
          </div>

          {/* MEDICATIONS Card */}
          <div>
            <h3 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              MEDICATIONS
            </h3>

            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 overflow-hidden">
              <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Pill size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2E40]">Current Prescriptions</div>
                    <div className="text-[11px] text-[#5A7684]">Heparin, Erythropoietin, Calcium Acetate</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                    <History size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2E40]">Medication History</div>
                    <div className="text-[11px] text-[#5A7684]">View dosage logs and adjustments</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* SESSION HISTORY Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider">
                SESSION HISTORY
              </h3>
              <span className="text-xs font-bold text-[#12617A]">Total: 141</span>
            </div>

            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 overflow-hidden text-xs">
              <div 
                onClick={onOpenSession}
                className="p-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-bold text-[#0B2E40]">Oct 1 • 09:00 AM</div>
                  <div className="text-[11px] text-[#5A7684]">4.0 hrs • UF Goal 2.5L • Dr. Sara Ali</div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-bold text-[#0B2E40]">Sep 29 • 11:00 AM</div>
                  <div className="text-[11px] text-[#5A7684]">3.5 hrs • UF Goal 2.2L • Dr. Ahmed Hassan</div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-bold text-[#0B2E40]">Sep 26 • 09:00 AM</div>
                  <div className="text-[11px] text-[#5A7684]">4.0 hrs • UF Goal 2.4L • Dr. Ahmed Hassan</div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
