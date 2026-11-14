import React, { useState } from 'react';
import { Wrench, X, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';
import { telemetryService } from '../services/telemetryService';
import { PrototypeGapReport } from '../types';

interface IterationFeedbackFABProps {
  currentRoute: string;
}

export const IterationFeedbackFAB: React.FC<IterationFeedbackFABProps> = ({ currentRoute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'MISSING_FIELD' | 'INPUT_BOUND' | 'UX_FRICTION' | 'LOGIC_ERROR'>('MISSING_FIELD');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'MISSING_FIELD' as const, label: 'Missing Clinical Field' },
    { id: 'INPUT_BOUND' as const, label: 'Input Bound Too Strict' },
    { id: 'UX_FRICTION' as const, label: 'UI Button Hard to Reach' },
    { id: 'LOGIC_ERROR' as const, label: 'Calculation Error' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      const stateDump = sqliteService.dumpState();
      const report: Omit<PrototypeGapReport, 'id' | 'created_at'> = {
        screen_name: currentRoute,
        category,
        nurse_note: note.trim(),
        sqlite_state_dump: stateDump,
      };

      const savedReport = sqliteService.addPrototypeGapReport(report);
      telemetryService.logPrototypeGapReport(savedReport);

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setNote('');
      }, 1500);
    } catch (err) {
      console.error('Failed to log feedback:', err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-11 h-11 rounded-full bg-amber-500 text-white shadow-float flex items-center justify-center hover:bg-amber-600 active:scale-95 transition-all"
        title="Week 4 UX & Missing Data Feedback Bugger"
      >
        <Wrench size={20} className="animate-pulse" />
      </button>

      {/* Feedback Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden">
            {/* Header */}
            <div className="bg-[#12617A] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench size={18} className="text-amber-400" />
                <span className="font-bold text-sm tracking-tight">Week 4 UX & Gap Bugger</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Form */}
            {isSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
                <h4 className="font-bold text-brand-dark">Feedback Logged!</h4>
                <p className="text-xs text-brand-muted">
                  State snapshot captured & pushed to Firebase Web Observatory.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div className="text-[11px] text-brand-muted flex items-center justify-between">
                  <span>Current Route:</span>
                  <span className="font-mono font-bold text-brand-dark bg-canvas px-2 py-0.5 rounded">
                    {currentRoute}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Select Gap Category:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`text-[11px] text-left p-2 rounded-lg border transition-all ${
                          category === c.id
                            ? 'bg-[#12617A] text-white border-[#12617A] font-bold'
                            : 'bg-canvas text-brand-dark border-brand-border/40 hover:bg-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    Nurse / Tester Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Describe missing clinical field or UX difficulty..."
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-border bg-canvas/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    required
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-900 flex items-start space-x-1.5">
                  <AlertTriangle size={14} className="flex-shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Auto-captures local SQLite tables, MAP metrics, and outbox queue status for thesis audit.
                  </span>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 min-h-[44px] rounded-full border border-brand-border text-brand-muted text-xs font-semibold hover:bg-canvas"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] rounded-full bg-[#12617A] text-white text-xs font-bold hover:bg-brand-accent flex items-center justify-center space-x-1.5"
                  >
                    <Send size={14} />
                    <span>Send Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
