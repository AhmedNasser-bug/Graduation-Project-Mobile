import React from 'react';
import { Home, Calendar, Users, Bell, User } from 'lucide-react';

export type TabType = 'home' | 'sessions' | 'patients' | 'alerts' | 'profile';

interface NurseBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  alertCount?: number;
}

export const NurseBottomNav: React.FC<NurseBottomNavProps> = ({
  activeTab,
  onTabChange,
  alertCount = 2
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'sessions' as TabType, label: 'Sessions', icon: Calendar },
    { id: 'patients' as TabType, label: 'Patients', icon: Users },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell, badge: alertCount },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Bedside Floor Navigation" 
      className="w-full bg-[#12617A] text-white pt-2.5 pb-2 px-3 shadow-lg select-none z-30 flex-shrink-0"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all ${
                isActive ? 'opacity-100 font-bold scale-105' : 'opacity-70 hover:opacity-90 font-medium'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-2"></div>
    </nav>
  );
};
