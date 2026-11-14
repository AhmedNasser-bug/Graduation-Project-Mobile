import React, { useState, useEffect } from 'react';
import { User, Clock, ChevronRight, MessageSquare, Database, Cloud, WifiOff } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { sqliteService } from '../db/sqliteHelper';
import { outboxSyncWorker } from '../services/outboxSyncService';
import { TabType } from '../components/NurseBottomNav';

interface HomeNurseScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSession: (sessionId?: string) => void;
  onOpenChat: () => void;
}

export const HomeNurseScreen: React.FC<HomeNurseScreenProps> = ({
  onNavigateTab,
  onOpenSession,
  onOpenChat
}) => {
  const [outboxStats, setOutboxStats] = useState(sqliteService.getOutboxStats());
  const [isOnline, setIsOnline] = useState(outboxSyncWorker.isOnline);
  const [latency, setLatency] = useState(sqliteService.getAverageLatency());

  useEffect(() => {
    const unsub = outboxSyncWorker.subscribe(() => {
      setOutboxStats(sqliteService.getOutboxStats());
      setIsOnline(outboxSyncWorker.isOnline);
      setLatency(sqliteService.getAverageLatency());
    });
    return unsub;
  }, []);

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Top Header */}
        <div className="px-6 pt-3 pb-3 border-b border-[#7BAEC4]/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A7684]">Good Morning</span>
              <h1 className="text-xl font-extrabold text-[#0B2E40] tracking-tight">Mr Youssef</h1>
            </div>

            {/* Circular Avatar */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#12617A] text-white font-bold flex items-center justify-center text-base shadow-xs">
                Y
              </div>
            </div>
          </div>

          {/* Live Offline/Sync Status Pill */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
              isOnline
                ? outboxStats.pendingCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {isOnline ? (
                <>
                  <Database size={12} className="text-[#12617A]" />
                  <span>
                    SQLite Active • {outboxStats.pendingCount > 0 ? `${outboxStats.pendingCount} Pending` : 'Synced'}
                  </span>
                </>
              ) : (
                <>
                  <WifiOff size={12} className="text-red-600" />
                  <span>Offline • {outboxStats.pendingCount} Pending</span>
                </>
              )}
            </div>

            <div className="text-[10px] text-[#5A7684] font-mono">
              SQL Latency: {latency}ms
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-4 space-y-5">
          {/* TODAY Summary (3 Cards in a row) */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              TODAY
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <div 
                onClick={() => onNavigateTab('sessions')}
                className="bg-white border border-[#7BAEC4] rounded-2xl p-3 text-center shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <div className="text-2xl font-bold text-[#0B2E40]">6</div>
                <div className="text-xs text-[#5A7684] font-medium mt-0.5">Sessions</div>
              </div>

              <div 
                onClick={() => onNavigateTab('patients')}
                className="bg-white border border-[#7BAEC4] rounded-2xl p-3 text-center shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <div className="text-2xl font-bold text-[#0B2E40]">8</div>
                <div className="text-xs text-[#5A7684] font-medium mt-0.5">Patients</div>
              </div>

              <div 
                onClick={() => onNavigateTab('alerts')}
                className="bg-white border border-[#7BAEC4] rounded-2xl p-3 text-center shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <div className="text-2xl font-bold text-[#0B2E40]">2</div>
                <div className="text-xs text-[#5A7684] font-medium mt-0.5">Alerts</div>
              </div>
            </div>
          </div>

          {/* TODAY'S PROGRESS */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              TODAY'S PROGRESS
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0B2E40]">3 / 6 Sessions Completed</span>
              </div>
              <p className="text-xs text-[#5A7684]">3 sessions remaining</p>
              
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-200/70 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#12617A] rounded-full w-1/2 transition-all duration-500"></div>
              </div>
            </div>
          </div>

          {/* NEXT SESSION Card */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              NEXT SESSION
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-2">
              <div className="text-base font-bold text-[#0B2E40]">Ahmed Mohammed</div>
              <div className="flex items-center space-x-3 text-xs text-[#5A7684]">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>P-1001</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>09:00 AM</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenSession()}
                  className="inline-flex items-center space-x-1 text-sm font-bold text-[#12617A] hover:underline"
                >
                  <span>View Session</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* CHAT WITH DOCTOR Card */}
          <div>
            <h2 className="text-xs font-bold text-[#5A7684] uppercase tracking-wider mb-2">
              CHAT WITH DOCTOR
            </h2>
            <div className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="text-base font-bold text-[#0B2E40]">Dr Ahmed Hassan</div>
              <p className="text-xs text-[#5A7684]">Discuss patient care</p>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="inline-flex items-center space-x-1 text-sm font-bold text-[#12617A] hover:underline"
                >
                  <span>View Chat</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
