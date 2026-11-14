import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, UserPlus, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { sqliteService } from '../db/sqliteHelper';
import { Patient } from '../types';
import { PatientOnboardingModal } from '../components/PatientOnboardingModal';

interface NursePatientsScreenProps {
  onSelectPatient: (patientId: string) => void;
}

export const NursePatientsScreen: React.FC<NursePatientsScreenProps> = ({ onSelectPatient }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_session' | 'waiting'>('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queryLatency, setQueryLatency] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const fetchPatients = () => {
    const res = sqliteService.getPatients(search, filter);
    setPatients(res.patients);
    setQueryLatency(res.latencyMs);
  };

  useEffect(() => {
    fetchPatients();
  }, [search, filter]);

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-6">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Title */}
        <div className="px-6 pt-2 pb-1 text-center">
          <h1 className="text-2xl font-bold text-[#0B2E40]">Patients</h1>
        </div>

        {/* Search & Query Latency Banner */}
        <div className="px-6 pt-3 space-y-2">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full min-h-[48px] pl-11 pr-4 rounded-xl border border-[#7BAEC4] bg-white text-sm text-[#0B2E40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12617A] shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-[#5A7684]">
            <span>SQLite Filter Query (BL-103)</span>
            <span className="font-mono font-bold text-[#12617A] bg-white px-2 py-0.5 rounded border border-[#7BAEC4]/40">
              {queryLatency} ms &lt; 200ms SLA
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#12617A] text-white shadow-xs'
                  : 'bg-white border border-[#7BAEC4] text-[#0B2E40]'
              }`}
            >
              All Patients ({sqliteService.getPatients('', 'all').patients.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('in_session')}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'in_session'
                  ? 'bg-[#12617A] text-white shadow-xs'
                  : 'bg-white border border-[#7BAEC4] text-[#0B2E40]'
              }`}
            >
              In Session ({sqliteService.getPatients('', 'in_session').patients.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('waiting')}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === 'waiting'
                  ? 'bg-[#12617A] text-white shadow-xs'
                  : 'bg-white border border-[#7BAEC4] text-[#0B2E40]'
              }`}
            >
              Waiting ({sqliteService.getPatients('', 'waiting').patients.length})
            </button>
          </div>
        </div>

        {/* Assigned Patients List */}
        <div className="px-6 pt-5 pb-20 space-y-3">
          <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider">
            ASSIGNED PATIENTS LIST
          </h2>

          <div className="space-y-3">
            {patients.map((patient) => {
              // Viral Status styling (BL-102)
              const isHCV = patient.viral_status === 'HCV+';
              const isHBV = patient.viral_status === 'HBV+';
              const isNegative = patient.viral_status === 'Negative';

              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient.id)}
                  className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs hover:border-[#12617A] cursor-pointer active:scale-98 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1 pr-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-[#0B2E40] leading-tight">
                        {patient.full_name}
                      </h3>
                      
                      {/* BL-102 Viral Isolation Tag */}
                      {isHCV && (
                        <span className="bg-[#FDE8E8] text-[#C81E1E] border border-[#F8B4B4] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                          <ShieldAlert size={10} />
                          <span>HCV (+) Isolation</span>
                        </span>
                      )}
                      {isHBV && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                          <AlertTriangle size={10} />
                          <span>HBV (+)</span>
                        </span>
                      )}
                      {isNegative && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          HCV (-)
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#5A7684]">
                      ID: <span className="font-semibold text-[#0B2E40]">{patient.patient_code}</span>
                      {' • '}
                      {patient.age} yrs • {patient.gender}
                      {' • '}
                      <span className="font-semibold text-brand-teal">Dry Wt: {patient.target_dry_weight_kg} kg</span>
                    </div>

                    <div className="text-xs text-[#5A7684]">
                      Insurance: <span className="font-medium text-[#0B2E40]">{patient.insurance_provider}</span>
                    </div>
                  </div>

                  <ChevronRight size={20} className="text-[#5A7684]/80 flex-shrink-0" />
                </div>
              );
            })}

            {patients.length === 0 && (
              <div className="text-center py-10 text-xs text-brand-muted">
                No patients found matching query.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button (New Patient +) */}
      <div className="fixed bottom-20 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="min-h-[48px] px-5 rounded-full bg-[#12617A] text-white text-sm font-bold shadow-float hover:bg-[#0f4f64] active:scale-95 transition-all flex items-center space-x-2"
        >
          <span>New Patient</span>
          <UserPlus size={16} />
        </button>
      </div>

      {/* Rapid Onboarding Modal */}
      <PatientOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onPatientAdded={fetchPatients}
      />
    </div>
  );
};
