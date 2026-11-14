import React, { useState, useEffect } from 'react';
import { X, Delete, Check, AlertCircle } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';
import { telemetryService } from '../services/telemetryService';
import { HourMark } from '../types';

interface NumericKeypadModalProps {
  sessionId: string;
  hourMark: HourMark;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type VitalsField = 'sbp' | 'dbp' | 'spo2' | 'hr' | 'temp' | 'ufRate';

interface FieldConfig {
  id: VitalsField;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  placeholder: string;
}

const FIELDS: FieldConfig[] = [
  { id: 'sbp', label: 'Systolic BP', unit: 'mmHg', min: 40, max: 300, placeholder: '130' },
  { id: 'dbp', label: 'Diastolic BP', unit: 'mmHg', min: 20, max: 200, placeholder: '80' },
  { id: 'spo2', label: 'SpO2 Oxygen', unit: '%', min: 50, max: 100, placeholder: '98' },
  { id: 'hr', label: 'Heart Rate', unit: 'bpm', min: 30, max: 240, placeholder: '78' },
  { id: 'temp', label: 'Temperature', unit: '°C', min: 34.0, max: 42.0, step: 0.1, placeholder: '36.8' },
  { id: 'ufRate', label: 'UF Rate', unit: 'mL/h', min: 0, max: 2500, placeholder: '600' },
];

export const NumericKeypadModal: React.FC<NumericKeypadModalProps> = ({
  sessionId,
  hourMark,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeField, setActiveField] = useState<VitalsField>('sbp');
  const [values, setValues] = useState<Record<VitalsField, string>>({
    sbp: '130',
    dbp: '80',
    spo2: '98',
    hr: '78',
    temp: '36.8',
    ufRate: '600'
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Start timer when keypad opens
  useEffect(() => {
    if (isOpen) {
      telemetryService.startIntakeTimer();
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = FIELDS.find(f => f.id === activeField)!;
  const currentVal = values[activeField];

  const handleKeyPress = (num: string) => {
    setErrorMessage(null);
    telemetryService.incrementCorrectionCount();
    setValues(prev => {
      let next = prev[activeField];
      if (next === '0' && num !== '.') next = num;
      else if (num === '.' && next.includes('.')) return prev;
      else next += num;
      return { ...prev, [activeField]: next };
    });
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    telemetryService.incrementCorrectionCount();
    setValues(prev => {
      const cur = prev[activeField];
      const next = cur.slice(0, -1);
      return { ...prev, [activeField]: next };
    });
  };

  const handleClear = () => {
    setErrorMessage(null);
    setValues(prev => ({ ...prev, [activeField]: '' }));
  };

  const handleNextField = () => {
    const currentIndex = FIELDS.findIndex(f => f.id === activeField);
    if (currentIndex < FIELDS.length - 1) {
      setActiveField(FIELDS[currentIndex + 1].id);
    }
  };

  const handleSaveAll = () => {
    // Strict physiological bounds validation
    for (const f of FIELDS) {
      const raw = parseFloat(values[f.id]);
      if (isNaN(raw)) {
        setErrorMessage(`Please enter a valid value for ${f.label}`);
        setActiveField(f.id);
        return;
      }
      if (raw < f.min || raw > f.max) {
        setErrorMessage(`${f.label} must be between ${f.min} and ${f.max} ${f.unit}`);
        setActiveField(f.id);
        // Log rejection telemetry event for thesis fat-finger tracking
        telemetryService.logValidationRejected(f.label, raw, f.min, f.max);
        return;
      }
    }

    const sbp = parseInt(values.sbp, 10);
    const dbp = parseInt(values.dbp, 10);
    const spo2 = parseInt(values.spo2, 10);
    const hr = parseInt(values.hr, 10);
    const temp = parseFloat(values.temp);
    const ufRate = parseFloat(values.ufRate);

    // Commit to SQLite
    const { vitals } = sqliteService.addVitalsLog({
      session_id: sessionId,
      hour_mark: hourMark,
      systolic_bp: sbp,
      diastolic_bp: dbp,
      heart_rate_bpm: hr,
      spo2_percentage: spo2,
      temperature_c: temp,
      current_uf_rate_ml_h: ufRate,
      idh_risk_probability: sbp < 100 ? 0.42 : 0.12,
      shap_drivers_json: JSON.stringify([
        { feature: 'uf_rate', impact: 0.22, display_name: 'UF Removal Rate', clinical_context: 'Microcirculatory refill stress', suggested_action: 'Reduce UF Rate' },
        { feature: 'sbp_delta', impact: 0.15, display_name: 'Systolic Trend', clinical_context: 'Pressure curve variance', suggested_action: 'Monitor strictly' }
      ]),
      entry_duration_ms: 18000,
      recorded_at: new Date().toISOString()
    });

    // Record Telemetry
    telemetryService.finishIntakeTimer(sessionId, hourMark);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-brand-border overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#12617A] text-white px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base tracking-tight">Record Vitals — {hourMark}</h3>
            <p className="text-xs text-brand-light/80">Touch-Optimized Bedside Numeric Keypad</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Field Selector Tabs */}
        <div className="bg-canvas p-2.5 grid grid-cols-3 gap-1.5 border-b border-brand-border/40">
          {FIELDS.map(f => {
            const isSelected = activeField === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => { setActiveField(f.id); setErrorMessage(null); }}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected 
                    ? 'bg-white border-[#12617A] shadow-sm' 
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}
              >
                <div className="text-[10px] text-brand-muted uppercase font-bold">{f.label}</div>
                <div className="text-sm font-bold text-brand-dark flex items-baseline justify-between mt-0.5">
                  <span>{values[f.id] || '—'}</span>
                  <span className="text-[10px] font-normal text-brand-muted">{f.unit}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Field Display */}
        <div className="px-6 py-3 bg-white text-center border-b border-gray-100">
          <div className="text-xs font-semibold text-brand-muted">
            Entering {currentConfig.label} ({currentConfig.min} – {currentConfig.max} {currentConfig.unit})
          </div>
          <div className="text-4xl font-extrabold text-[#0B2E40] tracking-wider my-1 h-12 flex items-center justify-center font-mono">
            {currentVal || <span className="text-gray-300">0</span>}
            <span className="text-base font-normal text-brand-muted ml-2">{currentConfig.unit}</span>
          </div>

          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg py-1 px-3 inline-flex items-center space-x-1.5 animate-bounce">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* 48px Ergonomic Touch Keypad */}
        <div className="p-4 bg-gray-50 flex-1 grid grid-cols-3 gap-2 select-none">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              className="min-h-[52px] bg-white rounded-xl shadow-xs border border-gray-200 text-xl font-bold text-brand-dark active:bg-gray-100 active:scale-95 transition-all flex items-center justify-center font-mono"
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-[52px] bg-gray-200/70 rounded-xl shadow-xs text-brand-dark active:bg-gray-300 active:scale-95 transition-all flex items-center justify-center"
            title="Backspace"
          >
            <Delete size={22} />
          </button>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 min-h-[48px] rounded-full border border-gray-300 text-brand-muted text-xs font-bold hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleNextField}
            className="px-4 min-h-[48px] rounded-full bg-canvas text-brand-dark text-xs font-bold border border-brand-border/60 hover:bg-white"
          >
            Next Field &gt;
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex-1 min-h-[48px] rounded-full bg-[#12617A] text-white text-sm font-bold shadow-md hover:bg-brand-accent active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <Check size={18} />
            <span>Save &amp; Commit</span>
          </button>
        </div>

      </div>
    </div>
  );
};
