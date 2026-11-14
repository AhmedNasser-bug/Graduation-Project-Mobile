import React, { useEffect, useState } from 'react';
import { KidneyIcon } from '../components/KidneyIcon';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { sqliteService } from '../db/sqliteHelper';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [initStatus, setInitStatus] = useState('Initializing SQLite & Firebase SDKs...');

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        setInitStatus('Mounting SQLite WAL database...');
        await sqliteService.init();
        if (mounted) {
          setInitStatus('SQLite & Outbox Ready');
          setTimeout(() => {
            onComplete();
          }, 1200);
        }
      } catch (err) {
        console.error('Bootstrap error', err);
        if (mounted) {
          setTimeout(onComplete, 1500);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full min-h-[780px] bg-[#12617A] text-white flex flex-col justify-between select-none relative overflow-hidden">
      {/* iOS Status Bar in light mode (white text) */}
      <IOSStatusBar variant="light" />

      {/* Centered Kidney Icon & Title */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-10">
        <div className="mb-6 animate-pulse">
          <KidneyIcon color="#FFFFFF" size={88} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight leading-snug">
          Kidney Care
        </h1>
        <h2 className="text-xl font-medium tracking-tight text-brand-light/90 mt-1">
          Health Care Solutions
        </h2>

        {/* Boot Status */}
        <div className="mt-8 flex items-center space-x-2 text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span>{initStatus}</span>
        </div>
      </div>

      {/* Footer Version */}
      <div className="pb-6 text-center">
        <p className="text-xs text-white/60 font-medium">Version 1.0.0</p>
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-3"></div>
      </div>
    </div>
  );
};
