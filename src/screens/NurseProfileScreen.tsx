import React, { useState } from 'react';
import { Key, LogOut, ChevronRight, Globe, Moon } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';

interface NurseProfileScreenProps {
  onLogout: () => void;
}

export const NurseProfileScreen: React.FC<NurseProfileScreenProps> = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-6">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Avatar & Header */}
        <div className="px-6 pt-4 pb-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#12617A] text-white text-2xl font-bold flex items-center justify-center shadow-sm mb-3">
            YA
          </div>

          <h1 className="text-xl font-bold text-[#0B2E40]">Youssef Anwar</h1>
          <div className="text-xs text-[#5A7684] mt-0.5 font-medium">Nurse</div>
          <div className="text-[11px] text-[#5A7684]">Nurse ID: N-1004</div>
        </div>

        {/* Content Body */}
        <div className="px-6 space-y-4">
          {/* ACCOUNT INFORMATION Card */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              ACCOUNT INFORMATION
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs divide-y divide-gray-100 text-xs">
              <div className="flex justify-between py-2 first:pt-0">
                <span className="text-[#5A7684]">Email</span>
                <span className="font-semibold text-[#0B2E40]">youssefanwar@nursecare.eg</span>
              </div>
              <div className="flex justify-between py-2 last:pb-0">
                <span className="text-[#5A7684]">Phone</span>
                <span className="font-semibold text-[#0B2E40]">+20 1125551574</span>
              </div>
            </div>
          </div>

          {/* PREFERENCES Card */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              PREFERENCES
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 text-xs overflow-hidden">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon size={16} className="text-[#5A7684]" />
                  <span className="font-semibold text-[#0B2E40]">Dark Mode</span>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    darkMode ? 'bg-[#12617A]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Globe size={16} className="text-[#5A7684]" />
                  <span className="font-semibold text-[#0B2E40]">Language</span>
                </div>
                <div className="flex items-center space-x-1 text-[#5A7684]">
                  <span>English</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT Card */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              ACCOUNT
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl shadow-xs divide-y divide-gray-100 text-xs overflow-hidden">
              <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2.5">
                  <Key size={16} className="text-[#5A7684]" />
                  <span className="font-semibold text-[#0B2E40]">Change Password</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div 
                onClick={onLogout}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-red-50 text-red-600 font-semibold"
              >
                <div className="flex items-center space-x-2.5">
                  <LogOut size={16} />
                  <span>Log Out</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Footer Version */}
          <div className="text-center pt-4 text-xs text-[#5A7684]">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};
