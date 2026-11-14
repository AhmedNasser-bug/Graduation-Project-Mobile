import React, { useState, useEffect } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { ChoosePositionScreen } from './screens/ChoosePositionScreen';
import { HomeNurseScreen } from './screens/HomeNurseScreen';
import { NursePatientsScreen } from './screens/NursePatientsScreen';
import { PatientProfileScreen } from './screens/PatientProfileScreen';
import { SessionDetailsScreen } from './screens/SessionDetailsScreen';
import { AlertScreen } from './screens/AlertScreen';
import { NurseSessionsScreen } from './screens/NurseSessionsScreen';
import { NurseProfileScreen } from './screens/NurseProfileScreen';
import { NurseBottomNav, TabType } from './components/NurseBottomNav';
import { IterationFeedbackFAB } from './components/IterationFeedbackFAB';
import { DoctorChatModal } from './components/DoctorChatModal';
import { outboxSyncWorker } from './services/outboxSyncService';
import { Smartphone, Monitor } from 'lucide-react';

export type ScreenRoute = 
  | 'splash'
  | 'onboarding'
  | 'signin'
  | 'signup'
  | 'choose_role'
  | 'home'
  | 'sessions'
  | 'patients'
  | 'patient_profile'
  | 'session'
  | 'alerts'
  | 'profile';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('splash');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('018f3a12-1001-7000-8000-000000000001');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFrameMode, setIsFrameMode] = useState(true);

  // Start background outbox synchronizer
  useEffect(() => {
    outboxSyncWorker.start();
    return () => {
      outboxSyncWorker.stop();
    };
  }, []);

  const isNavVisible = ['home', 'sessions', 'patients', 'alerts', 'profile'].includes(currentRoute);

  const handleTabChange = (tab: TabType) => {
    setCurrentRoute(tab as ScreenRoute);
  };

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setCurrentRoute('patient_profile');
  };

  const renderScreen = () => {
    switch (currentRoute) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentRoute('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setCurrentRoute('signin')} />;
      case 'signin':
        return (
          <SignInScreen
            onSignInSuccess={() => setCurrentRoute('choose_role')}
            onNavigateToSignUp={() => setCurrentRoute('signup')}
          />
        );
      case 'signup':
        return (
          <SignUpScreen
            onSignUpSuccess={() => setCurrentRoute('choose_role')}
            onNavigateToSignIn={() => setCurrentRoute('signin')}
          />
        );
      case 'choose_role':
        return (
          <ChoosePositionScreen
            onSelectRole={(role) => {
              if (role === 'Nurse') setCurrentRoute('home');
            }}
          />
        );
      case 'home':
        return (
          <HomeNurseScreen
            onNavigateTab={handleTabChange}
            onOpenSession={() => setCurrentRoute('session')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      case 'sessions':
        return (
          <NurseSessionsScreen
            onSelectSession={() => setCurrentRoute('session')}
          />
        );
      case 'patients':
        return (
          <NursePatientsScreen
            onSelectPatient={handleSelectPatient}
          />
        );
      case 'patient_profile':
        return (
          <PatientProfileScreen
            patientId={selectedPatientId}
            onBack={() => setCurrentRoute('patients')}
            onOpenSession={() => setCurrentRoute('session')}
          />
        );
      case 'session':
        return (
          <SessionDetailsScreen
            onBack={() => setCurrentRoute('home')}
            onOpenPatientProfile={(pId) => handleSelectPatient(pId)}
          />
        );
      case 'alerts':
        return (
          <AlertScreen
            onOpenSession={() => setCurrentRoute('session')}
            onOpenPatientProfile={(pId) => handleSelectPatient(pId)}
          />
        );
      case 'profile':
        return (
          <NurseProfileScreen
            onLogout={() => setCurrentRoute('signin')}
          />
        );
      default:
        return <HomeNurseScreen onNavigateTab={handleTabChange} onOpenSession={() => setCurrentRoute('session')} onOpenChat={() => setIsChatOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 md:p-6 font-sans">
      
      {/* Top Testing Controls Bar (for desktop reviewers) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-slate-200">NephroEdge Mobile MFP (Week 4)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 px-2"
            title="Toggle device bezel"
          >
            {isFrameMode ? <Smartphone size={14} /> : <Monitor size={14} />}
            <span className="text-[11px]">{isFrameMode ? 'iPhone Bezel' : 'Full Width'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Shell Device Frame */}
      <div 
        className={`relative w-full overflow-hidden transition-all duration-300 flex flex-col ${
          isFrameMode 
            ? 'max-w-[390px] h-[844px] max-h-[92vh] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-slate-800 ring-1 ring-slate-700/50' 
            : 'max-w-md h-[92vh] rounded-2xl shadow-xl border border-slate-700'
        }`}
      >
        {/* Dynamic Island / Notch */}
        {isFrameMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
          </div>
        )}

        {/* Screen Viewport */}
        <div className="flex-1 w-full bg-[#EAF6FA] overflow-y-auto no-scrollbar relative flex flex-col">
          {renderScreen()}

          {/* Floating Feedback Bugger (available on all screens for thesis error audit) */}
          <IterationFeedbackFAB currentRoute={currentRoute} />

          {/* Doctor Chat Modal */}
          <DoctorChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </div>

        {/* Persistent Bottom Nav for Main Nurse Flow */}
        {isNavVisible && (
          <NurseBottomNav
            activeTab={currentRoute as TabType}
            onTabChange={handleTabChange}
          />
        )}
      </div>

      {/* Instructions footer for testers */}
      <div className="hidden md:block text-center mt-3 text-[11px] text-slate-500">
        Clinical UX Testbench • Local SQLite (WAL) + Firebase Telemetry Bus Active
      </div>
    </div>
  );
};
