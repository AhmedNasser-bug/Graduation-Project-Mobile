import React, { useState } from 'react';
import { X, Cpu, Check, Activity } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';

interface MachineSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  initialSettings: {
    qb: number;
    qd: number;
    temp: number;
    bathNa?: number;
    bathK?: number;
    bathHco3?: number;
  };
  onSave: () => void;
}

export const MachineSettingsDrawer: React.FC<MachineSettingsDrawerProps> = ({
  isOpen,
  onClose,
  sessionId,
  initialSettings,
  onSave
}) => {
  const [qb, setQb] = useState(initialSettings.qb || 300);
  const [qd, setQd] = useState(initialSettings.qd || 500);
  const [temp, setTemp] = useState(initialSettings.temp || 36.5);
  const [bathNa, setBathNa] = useState(initialSettings.bathNa || 138);
  const [bathK, setBathK] = useState(initialSettings.bathK || 2.0);
  const [bathHco3, setBathHco3] = useState(initialSettings.bathHco3 || 32);

  if (!isOpen) return null;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    sqliteService.updateSessionMachineSettings(sessionId, {
      qb,
      qd,
      temp,
      bathNa,
      bathK,
      bathHco3
    });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-brand-border overflow-hidden">
        {/* Header */}
        <div className="bg-[#12617A] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu size={20} className="text-brand-light" />
            <div>
              <h3 className="font-bold text-base tracking-tight">Machine Telemetry Settings</h3>
              <p className="text-[11px] text-white/80">Fresenius 4008S #04 • BL-202</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCommit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Blood & Dialysate Flow Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-canvas border border-brand-border/60">
              <label className="text-[10px] font-bold text-brand-muted uppercase block">Blood Flow (Qb)</label>
              <div className="flex items-baseline space-x-1 mt-1">
                <input
                  type="number"
                  value={qb}
                  onChange={(e) => setQb(Number(e.target.value))}
                  min={100}
                  max={500}
                  className="w-full text-lg font-bold text-brand-dark bg-white px-2 py-1 rounded border border-brand-border"
                />
                <span className="text-xs text-brand-muted">mL/min</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-brand-border/60">
              <label className="text-[10px] font-bold text-brand-muted uppercase block">Dialysate Flow (Qd)</label>
              <div className="flex items-baseline space-x-1 mt-1">
                <input
                  type="number"
                  value={qd}
                  onChange={(e) => setQd(Number(e.target.value))}
                  min={300}
                  max={800}
                  className="w-full text-lg font-bold text-brand-dark bg-white px-2 py-1 rounded border border-brand-border"
                />
                <span className="text-xs text-brand-muted">mL/min</span>
              </div>
            </div>
          </div>

          {/* Dialysate Bath Temperature */}
          <div className="p-3 rounded-xl bg-canvas border border-brand-border/60">
            <label className="text-[10px] font-bold text-brand-muted uppercase block">Dialysate Bath Temp</label>
            <div className="flex items-center space-x-3 mt-1">
              <input
                type="range"
                min="35.0"
                max="37.5"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="flex-1 accent-[#12617A]"
              />
              <span className="text-lg font-bold font-mono text-brand-dark min-w-[50px]">{temp.toFixed(1)} °C</span>
            </div>
            <p className="text-[10px] text-brand-muted mt-1">Isothermic dialysis (35.5 - 36.0°C) reduces IDH collapse risk.</p>
          </div>

          {/* Electrolyte Bath Prescription */}
          <div className="p-3 rounded-xl bg-canvas border border-brand-border/60 space-y-2">
            <label className="text-[10px] font-bold text-brand-muted uppercase block">Dialysate Bath Electrolytes</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-brand-dark font-semibold">Na+ (mEq/L)</span>
                <input
                  type="number"
                  value={bathNa}
                  onChange={(e) => setBathNa(Number(e.target.value))}
                  className="w-full text-sm font-bold bg-white p-1.5 rounded border border-brand-border"
                />
              </div>
              <div>
                <span className="text-[10px] text-brand-dark font-semibold">K+ (mEq/L)</span>
                <input
                  type="number"
                  step="0.5"
                  value={bathK}
                  onChange={(e) => setBathK(parseFloat(e.target.value))}
                  className="w-full text-sm font-bold bg-white p-1.5 rounded border border-brand-border"
                />
              </div>
              <div>
                <span className="text-[10px] text-brand-dark font-semibold">HCO3- (mEq/L)</span>
                <input
                  type="number"
                  value={bathHco3}
                  onChange={(e) => setBathHco3(Number(e.target.value))}
                  className="w-full text-sm font-bold bg-white p-1.5 rounded border border-brand-border"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-full border border-brand-border text-brand-muted text-xs font-semibold hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[48px] rounded-full bg-[#12617A] text-white text-xs font-bold hover:bg-brand-accent flex items-center justify-center space-x-1.5"
            >
              <Check size={16} />
              <span>Update Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
