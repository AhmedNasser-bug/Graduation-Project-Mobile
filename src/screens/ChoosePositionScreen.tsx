import React, { useState } from 'react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { KidneyIcon } from '../components/KidneyIcon';

interface ChoosePositionScreenProps {
  onSelectRole: (role: 'Doctor' | 'Nurse') => void;
}

export const ChoosePositionScreen: React.FC<ChoosePositionScreenProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<'Doctor' | 'Nurse'>('Nurse');
  const [doctorNotice, setDoctorNotice] = useState(false);

  const handleChoose = (role: 'Doctor' | 'Nurse') => {
    setSelectedRole(role);
    if (role === 'Nurse') {
      onSelectRole('Nurse');
    } else {
      setDoctorNotice(true);
    }
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto">
      <IOSStatusBar variant="dark" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-sm mx-auto w-full text-center">
        {/* Kidney Logo */}
        <div className="mb-4">
          <KidneyIcon color="#12617A" size={72} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-[#0B2E40] tracking-tight">
          Choose Your Position
        </h1>
        <p className="text-xs text-[#5A7684] mt-2 max-w-xs leading-relaxed">
          Please select your clinical duty role to access customized patient sessions
        </p>

        {/* Illustration Card */}
        <div className="w-full my-6 bg-linear-to-b from-white/90 to-cyan-50/60 rounded-3xl p-6 border border-[#7BAEC4]/40 shadow-sm flex items-center justify-center min-h-[220px]">
          <div className="flex items-end justify-center space-x-4">
            {/* Doctor */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#E5D2BA] mb-1 relative">
                <div className="w-9 h-3 bg-amber-400/90 rounded-t-full"></div>
              </div>
              <div className="w-14 h-24 bg-white border border-gray-200 rounded-t-xl relative flex flex-col items-center pt-2">
                <div className="w-1.5 h-16 bg-blue-500 rounded-full"></div>
                {/* Clipboard */}
                <div className="absolute -left-3 top-5 w-5 h-7 bg-amber-500 rounded-xs"></div>
              </div>
              <div className="flex space-x-1 mt-0.5">
                <div className="w-4 h-12 bg-[#0B2E40]"></div>
                <div className="w-4 h-12 bg-[#0B2E40]"></div>
              </div>
            </div>

            {/* Dialysis Machine */}
            <div className="w-16 h-36 bg-white border-2 border-cyan-400 rounded-xl p-1.5 flex flex-col justify-between items-center shadow-xs">
              <div className="w-full h-8 bg-blue-500 rounded flex items-center justify-center">
                <div className="w-8 h-2 border-b-2 border-white"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-4 h-8 bg-gray-100 rounded border border-gray-300"></div>
                <div className="w-4 h-8 bg-gray-100 rounded border border-gray-300"></div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            </div>

            {/* Nurse */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#D4A373] mb-1 relative">
                <div className="w-7 h-4 bg-amber-700/80 rounded-t-full mx-auto"></div>
              </div>
              <div className="w-14 h-24 bg-[#12617A] text-white rounded-t-xl relative flex flex-col items-center pt-2">
                <div className="w-6 h-5 bg-white text-red-500 text-[10px] font-bold rounded-xs flex items-center justify-center shadow-xs">
                  +
                </div>
              </div>
              <div className="flex space-x-1 mt-0.5">
                <div className="w-4 h-12 bg-[#12617A]"></div>
                <div className="w-4 h-12 bg-[#12617A]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Segmented Role Selector Container */}
        <div className="w-full bg-white/70 p-1.5 rounded-full border border-[#7BAEC4] flex items-center shadow-xs">
          <button
            type="button"
            onClick={() => handleChoose('Doctor')}
            className={`flex-1 min-h-[48px] rounded-full text-sm font-bold transition-all ${
              selectedRole === 'Doctor'
                ? 'bg-[#12617A] text-white shadow-md'
                : 'text-[#0B2E40] hover:bg-white/60'
            }`}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => handleChoose('Nurse')}
            className={`flex-1 min-h-[48px] rounded-full text-sm font-bold transition-all ${
              selectedRole === 'Nurse'
                ? 'bg-[#12617A] text-white shadow-md'
                : 'text-[#0B2E40] hover:bg-white/60'
            }`}
          >
            Nurse
          </button>
        </div>

        {/* Doctor Notice / Handoff */}
        {doctorNotice && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-1 animate-fade-in">
            <span className="font-bold block">Doctor Role Routing:</span>
            <span>
              Attending Nephrologist functions operate via the Telemetry Web Portal. You can switch to Nurse bedside mode or open the companion dashboard.
            </span>
            <div className="pt-1 flex space-x-2">
              <button
                onClick={() => onSelectRole('Nurse')}
                className="text-xs font-bold text-[#12617A] underline"
              >
                Continue in Nurse Mode &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pb-4">
        <div className="w-32 h-1 bg-black/40 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};
