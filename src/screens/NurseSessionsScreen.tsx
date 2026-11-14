import React, { useState } from 'react';
import { ChevronRight, Calendar, Plus } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';

interface NurseSessionsScreenProps {
  onSelectSession: (patientId?: string) => void;
}

export const NurseSessionsScreen: React.FC<NurseSessionsScreenProps> = ({ onSelectSession }) => {
  const [selectedDate, setSelectedDate] = useState('Thursday , Oct 1');

  const activeSessions = [
    { id: '1', name: 'Ahmed Mohamed', code: 'P-1001', time: '9 AM' },
    { id: '2', name: 'Mona Ali', code: 'P-1021', time: '9 AM' },
    { id: '3', name: 'Omar Hassan', code: 'P-1031', time: '9 AM' },
    { id: '4', name: 'Sara Mohamed', code: 'P-1041', time: '9 AM' },
    { id: '5', name: 'Nour Ahmed', code: 'P-1051', time: '9 AM' },
    { id: '6', name: 'Ali Mahmoud', code: 'P-1061', time: '9 AM' },
  ];

  const completedSessions = [
    { id: '7', name: 'Nada Fathy', code: 'P-1081', time: '9 AM' }
  ];

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-20">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Title & Date Dropdown Pill */}
        <div className="px-6 pt-2 pb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0B2E40]">Sessions</h1>

          <div className="bg-white border border-[#7BAEC4] rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B2E40] flex items-center space-x-1.5 shadow-2xs">
            <span>{selectedDate}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Active Sessions List */}
        <div className="px-6 space-y-3">
          {activeSessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSession()}
              className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs hover:border-[#12617A] cursor-pointer active:scale-98 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-[#0B2E40]">{s.name}</h3>
                <div className="text-xs text-[#5A7684] mt-0.5">
                  {s.code} <span className="mx-1">|</span> {s.time}
                </div>
              </div>
              <ChevronRight size={18} className="text-[#5A7684]/80" />
            </div>
          ))}

          {/* COMPLETED Section */}
          <div className="pt-3">
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              COMPLETED
            </h2>

            {completedSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSession()}
                className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs opacity-75 hover:opacity-100 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-[#0B2E40]">{s.name}</h3>
                  <div className="text-xs text-[#5A7684] mt-0.5">
                    {s.code} <span className="mx-1">|</span> {s.time}
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#5A7684]/80" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button: New Session + */}
      <div className="fixed bottom-20 right-6 z-40">
        <button
          type="button"
          onClick={() => onSelectSession()}
          className="min-h-[48px] px-5 rounded-full bg-[#12617A] text-white text-sm font-bold shadow-float hover:bg-[#0f4f64] active:scale-95 transition-all flex items-center space-x-2"
        >
          <span>New Session</span>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
