import React, { useState } from 'react';
import { X, UserPlus, Check, AlertTriangle } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';
import { VascularAccessType, ViralStatus, Gender } from '../types';

interface PatientOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: () => void;
}

export const PatientOnboardingModal: React.FC<PatientOnboardingModalProps> = ({
  isOpen,
  onClose,
  onPatientAdded
}) => {
  const [fullName, setFullName] = useState('');
  const [patientCode, setPatientCode] = useState(`P-${Math.floor(1000 + Math.random() * 900)}`);
  const [age, setAge] = useState(48);
  const [gender, setGender] = useState<Gender>('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [insurance, setInsurance] = useState('National Health Care');
  const [assignedBed, setAssignedBed] = useState('Bed 09 - Bay B');
  const [accessType, setAccessType] = useState<VascularAccessType>('AVF');
  const [viralStatus, setViralStatus] = useState<ViralStatus>('Negative');
  const [targetDryWeight, setTargetDryWeight] = useState(68.0);
  const [baselineSbp, setBaselineSbp] = useState(105);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    sqliteService.addPatient({
      patient_code: patientCode,
      full_name: fullName.trim(),
      age: Number(age),
      gender,
      blood_type: bloodType,
      insurance_provider: insurance,
      policy_number: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
      assigned_bed: assignedBed,
      vascular_access_type: accessType,
      viral_status: viralStatus,
      target_dry_weight_kg: Number(targetDryWeight),
      baseline_nadir_sbp: Number(baselineSbp),
      oxygen_support_advised: 0,
      session_status: 'Waiting'
    });

    onPatientAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#12617A] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus size={18} className="text-white" />
            <div>
              <h3 className="font-bold text-base tracking-tight">Rapid Patient Onboarding</h3>
              <p className="text-[11px] text-brand-light/80">Clinical Bedside Registration • BL-101</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-brand-dark block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Tamer Mansour"
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="font-bold text-brand-dark block mb-1">Patient Code</label>
              <input
                type="text"
                required
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-brand-dark block mb-1">Age</label>
              <input
                type="number"
                min={10}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              />
            </div>
            <div>
              <label className="font-bold text-brand-dark block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-brand-dark block mb-1">Blood Type</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mandatory Viral Screening Status (BL-102) */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <div className="flex items-center space-x-1 text-amber-900 font-bold">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Mandatory Viral Serology Status (BL-102)</span>
            </div>
            <p className="text-[10px] text-amber-800">
              Isolation bay assignment requires mandatory HCV/HBV/HIV verification.
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(['Negative', 'HCV+', 'HBV+', 'HIV+'] as ViralStatus[]).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setViralStatus(v)}
                  className={`p-1.5 rounded-md font-bold text-center border text-[11px] transition-all ${
                    viralStatus === v
                      ? v === 'Negative'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-brand-dark border-gray-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-brand-dark block mb-1">Vascular Access</label>
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value as VascularAccessType)}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              >
                <option value="AVF">AV Fistula (AVF)</option>
                <option value="AVG">AV Graft (AVG)</option>
                <option value="CVC">Central Venous (CVC)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-brand-dark block mb-1">Assigned Bed</label>
              <input
                type="text"
                value={assignedBed}
                onChange={(e) => setAssignedBed(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-brand-dark block mb-1">Target Dry Wt (kg)</label>
              <input
                type="number"
                step="0.5"
                value={targetDryWeight}
                onChange={(e) => setTargetDryWeight(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-brand-dark block mb-1">Baseline Nadir SBP</label>
              <input
                type="number"
                value={baselineSbp}
                onChange={(e) => setBaselineSbp(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-brand-border bg-canvas/40"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-full border border-brand-border text-brand-muted font-bold hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] rounded-full bg-[#12617A] text-white font-bold hover:bg-brand-accent flex items-center justify-center space-x-1.5"
            >
              <Check size={16} />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
