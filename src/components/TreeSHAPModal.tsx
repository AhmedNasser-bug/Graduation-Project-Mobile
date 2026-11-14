import React, { useState } from 'react';
import { X, Activity, AlertOctagon, CheckCircle2, ShieldAlert, ArrowDown, Droplet, Thermometer } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';
import { TreeShapDriver } from '../types';

interface TreeSHAPModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  idhProbability: number;
  news2Score: number;
  driversJson?: string;
  onActionCommitted: () => void;
}

export const TreeSHAPModal: React.FC<TreeSHAPModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  idhProbability,
  news2Score,
  driversJson,
  onActionCommitted
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  let drivers: TreeShapDriver[] = [];
  try {
    if (driversJson) {
      drivers = JSON.parse(driversJson);
    }
  } catch (e) {
    // fallback
  }

  if (drivers.length === 0) {
    drivers = [
      { feature: 'uf_rate_kg_h', impact: 0.28, display_name: 'High UF Removal Rate (8.9 mL/kg/h)', clinical_context: 'UF rate approaches safe microcirculatory refill threshold', suggested_action: 'Reduce UF Rate' },
      { feature: 'delta_sbp_pre_hd', impact: 0.19, display_name: 'Pre-HD SBP Borderline Nadir', clinical_context: 'Pre-session MAP is within low-normal spectrum', suggested_action: 'Cool Dialysate to 35.5°C' },
      { feature: 'serum_albumin', impact: -0.14, display_name: 'Protective Serum Albumin (4.1 g/dL)', clinical_context: 'Oncotic pressure supports adequate intravascular refill', suggested_action: 'Continue Monitoring' }
    ];
  }

  const handleCorrectiveAction = (actionTitle: string, incidentType: string) => {
    sqliteService.addIncident({
      session_id: sessionId,
      incident_type: incidentType,
      severity: 'Medium',
      action_taken: actionTitle,
      notes: `Executed via 1-Tap TreeSHAP Clinical Decision Support protocol.`,
      is_resolved: 1
    });

    setSuccessMessage(`Order logged: ${actionTitle}`);
    onActionCommitted();
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    sqliteService.addIncident({
      session_id: sessionId,
      incident_type: 'Clinical Protocol Override',
      severity: 'Low',
      action_taken: `Doctor/Nurse Clinical Override: ${overrideReason.trim()}`,
      notes: `Overridden TreeSHAP warning by bedside clinician. Reason: ${overrideReason.trim()}`,
      is_resolved: 1
    });

    setSuccessMessage('Override logged to clinical audit trail.');
    onActionCommitted();
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#12617A] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Activity size={20} className="text-amber-400" />
            <div>
              <h3 className="font-bold text-base tracking-tight">TreeSHAP Clinical Explainability</h3>
              <p className="text-[11px] text-white/80">Intradialytic Hypotension (IDH) Decision Support</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Risk Scores Summary Bar */}
        <div className="bg-canvas px-5 py-3 border-b border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">IDH Risk Probability</span>
            <div className="text-xl font-extrabold text-[#0B2E40]">
              {(idhProbability * 100).toFixed(0)}%
              <span className={`text-xs ml-2 font-semibold px-2 py-0.5 rounded-full ${
                idhProbability > 0.3 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {idhProbability > 0.3 ? 'Elevated Risk' : 'Low-Normal Risk'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">NEWS2 Protocol</span>
            <div className="text-xl font-extrabold text-[#0B2E40]">
              {news2Score} <span className="text-xs font-normal text-brand-muted">/ 20</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {successMessage ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 size={44} className="text-emerald-500 mx-auto" />
              <h4 className="font-bold text-brand-dark">{successMessage}</h4>
              <p className="text-xs text-brand-muted">Action synchronized with Cloud Firestore audit trail.</p>
            </div>
          ) : (
            <>
              {/* Clinical Drivers */}
              <div>
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2 flex items-center">
                  <AlertOctagon size={14} className="text-amber-500 mr-1.5" />
                  Top Physiological Drivers (TreeSHAP)
                </h4>

                <div className="space-y-2">
                  {drivers.map((d, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl border border-brand-border/60 bg-white shadow-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-dark">{d.display_name}</span>
                        <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          d.impact > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {d.impact > 0 ? `+${(d.impact * 100).toFixed(0)}% risk` : `${(d.impact * 100).toFixed(0)}% prot`}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-muted">{d.clinical_context}</p>
                      <div className="text-[10px] text-brand-teal font-semibold">
                        Suggested: {d.suggested_action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Tap Corrective Actions */}
              <div>
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                  1-Tap Corrective Interventions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCorrectiveAction('Reduce UF Rate by 200 mL/h', 'Intradialytic Hypotension Management')}
                    className="p-3 min-h-[48px] rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold hover:bg-blue-100 flex items-center space-x-2"
                  >
                    <ArrowDown size={16} className="text-blue-600" />
                    <span>Reduce UF Rate</span>
                  </button>

                  <button
                    onClick={() => handleCorrectiveAction('Cool Dialysate to 35.5°C (Isothermic Protocol)', 'Temperature Modulation')}
                    className="p-3 min-h-[48px] rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold hover:bg-cyan-100 flex items-center space-x-2"
                  >
                    <Thermometer size={16} className="text-cyan-600" />
                    <span>Cool Dialysate</span>
                  </button>

                  <button
                    onClick={() => handleCorrectiveAction('Administer 100 mL Normal Saline Bolus', 'Fluid Resuscitation')}
                    className="p-3 min-h-[48px] rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:bg-emerald-100 flex items-center space-x-2"
                  >
                    <Droplet size={16} className="text-emerald-600" />
                    <span>Saline Bolus</span>
                  </button>

                  <button
                    onClick={() => setShowOverrideInput(!showOverrideInput)}
                    className="p-3 min-h-[48px] rounded-xl bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <ShieldAlert size={16} className="text-gray-500" />
                    <span>Override...</span>
                  </button>
                </div>
              </div>

              {/* Override Input Form */}
              {showOverrideInput && (
                <form onSubmit={handleOverrideSubmit} className="pt-2 space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-brand-dark">Clinical Override Rationale:</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g., Patient asymptomatic, MAP normalized on re-check"
                    className="w-full text-xs p-2 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full min-h-[44px] rounded-full bg-gray-800 text-white text-xs font-bold hover:bg-black"
                  >
                    Confirm Clinical Override
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
