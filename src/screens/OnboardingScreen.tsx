import React, { useState } from 'react';
import { IOSStatusBar } from '../components/IOSStatusBar';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Everything About Your Patients',
      description: 'Review clinical alerts, patient risks, and decision-support information when it matters.',
      illustration: (
        <div className="relative w-64 h-56 flex items-center justify-center">
          {/* Medical charts and doctor illustration */}
          <div className="absolute top-4 left-6 w-16 h-20 bg-white rounded-lg shadow-sm border border-gray-200 p-2 opacity-80 flex flex-col justify-between">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600">♥</div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-200 rounded"></div>
              <div className="h-1 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="w-24 h-44 bg-[#12617A] rounded-t-full relative flex flex-col items-center pt-3">
            <div className="w-10 h-10 rounded-full bg-[#E5D2BA] mb-1"></div>
            <div className="w-16 h-20 bg-white rounded-t-lg"></div>
            <div className="w-8 h-14 bg-[#0B2E40] mt-auto"></div>
          </div>
          <div className="absolute -top-1 w-10 h-10 rounded-full bg-cyan-700/80 flex items-center justify-center text-white text-base">
            ♥
          </div>
        </div>
      )
    },
    {
      title: 'Stay On Top Of Every session',
      description: 'Access essential patient information, medical history, and dialysis records in one place.',
      illustration: (
        <div className="relative w-64 h-56 flex items-center justify-center">
          <div className="w-24 h-44 bg-[#12617A] rounded-t-full relative flex flex-col items-center pt-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A373] mb-1"></div>
            <div className="w-16 h-20 bg-[#12617A] text-white flex items-center justify-center text-xs font-bold">
              +
            </div>
            <div className="w-14 h-14 bg-cyan-800 mt-auto"></div>
          </div>
          <div className="absolute right-4 bottom-8 w-20 h-24 bg-cyan-100/70 border border-cyan-300 rounded-lg p-2 flex flex-col justify-between">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] text-cyan-700 font-bold">+</div>
            <div className="space-y-1">
              <div className="h-1 bg-cyan-300 rounded"></div>
              <div className="h-1 bg-cyan-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Make Informed Decisions',
      description: 'Review clinical alerts, patient risks, and decision-support information when it matters.',
      illustration: (
        <div className="relative w-64 h-56 flex items-center justify-center">
          <div className="absolute left-4 top-2 w-28 h-32 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="text-[10px] font-bold text-cyan-800">Rx Prescription</div>
            <div className="w-12 h-14 bg-blue-50 border border-blue-200 rounded mt-2 mx-auto flex items-center justify-center text-xs text-blue-500">
              Rx
            </div>
          </div>
          <div className="w-20 h-40 bg-[#12617A] rounded-t-full relative flex flex-col items-center pt-2 ml-16">
            <div className="w-9 h-9 rounded-full bg-[#E5D2BA] mb-1"></div>
            <div className="w-14 h-16 bg-white rounded-t-lg"></div>
            <div className="w-8 h-12 bg-[#0B2E40] mt-auto"></div>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-hidden">
      {/* iOS Status Bar in dark mode */}
      <IOSStatusBar variant="dark" />

      {/* Skip Button Top Right */}
      <div className="flex justify-end px-6 pt-1">
        <button
          onClick={onComplete}
          className="text-sm font-semibold text-brand-muted/70 hover:text-brand-dark"
        >
          Skip
        </button>
      </div>

      {/* Main Illustration Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="my-6">
          {currentSlide.illustration}
        </div>

        <h2 className="text-2xl font-extrabold text-[#0B2E40] tracking-tight mt-4">
          {currentSlide.title}
        </h2>
        <p className="text-sm text-brand-muted mt-2 max-w-xs leading-relaxed">
          {currentSlide.description}
        </p>

        {/* Dot Pagination */}
        <div className="flex items-center space-x-2 mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-[#12617A]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="px-6 pb-6 pt-2">
        <button
          onClick={handleNext}
          className="w-full min-h-[48px] rounded-full bg-[#12617A] text-white text-base font-bold shadow-md hover:bg-brand-accent active:scale-98 transition-all flex items-center justify-center"
        >
          {step === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>

        {/* Home Indicator */}
        <div className="w-32 h-1 bg-black/40 rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  );
};
