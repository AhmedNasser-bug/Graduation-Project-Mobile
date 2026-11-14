import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { KidneyIcon } from '../components/KidneyIcon';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToSignIn: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToSignIn
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess();
    }, 400);
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto">
      <IOSStatusBar variant="dark" />

      <div className="flex-1 flex flex-col justify-center px-6 py-4 max-w-sm mx-auto w-full">
        {/* Kidney Logo */}
        <div className="flex justify-center mb-4">
          <KidneyIcon color="#12617A" size={68} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-[#0B2E40] mb-6">
          Create new Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#0B2E40] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full min-h-[48px] px-4 rounded-xl border border-[#7BAEC4] bg-white text-sm text-[#0B2E40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12617A] shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2E40] mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full min-h-[48px] px-4 rounded-xl border border-[#7BAEC4] bg-white text-sm text-[#0B2E40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12617A] shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2E40] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full min-h-[48px] px-4 pr-11 rounded-xl border border-[#7BAEC4] bg-white text-sm text-[#0B2E40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12617A] shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2E40] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full min-h-[48px] px-4 pr-11 rounded-xl border border-[#7BAEC4] bg-white text-sm text-[#0B2E40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12617A] shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Primary Sign Up Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] rounded-full bg-[#12617A] text-white text-base font-bold shadow-md hover:bg-[#0f4f64] active:scale-98 transition-all flex items-center justify-center"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          {/* Google Sign Up Button */}
          <div>
            <button
              type="button"
              onClick={onSignUpSuccess}
              disabled={isLoading}
              className="w-full min-h-[48px] rounded-full bg-white border border-[#12617A] text-[#0B2E40] text-sm font-bold shadow-xs hover:bg-gray-50 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </form>

        {/* Footer switch to Sign In */}
        <div className="mt-6 text-center text-xs text-[#5A7684]">
          Already have an account?{' '}
          <button
            onClick={onNavigateToSignIn}
            className="text-[#0B2E40] font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="pb-4">
        <div className="w-32 h-1 bg-black/40 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};
