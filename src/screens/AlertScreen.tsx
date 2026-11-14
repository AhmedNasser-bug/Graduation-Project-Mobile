import React from 'react';
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { INITIAL_ALERTS } from '../db/initialData';
import { telemetryService } from '../services/telemetryService';

interface AlertScreenProps {
  onOpenSession: () => void;
  onOpenPatientProfile: (patientId: string) => void;
}

export const AlertScreen: React.FC<AlertScreenProps> = ({
  onOpenSession,
  onOpenPatientProfile
}) => {
  const alerts = INITIAL_ALERTS;

  const handleAction = (alert: typeof alerts[0]) => {
    // Log latency to Firebase Analytics
    telemetryService.sendEvent('clinical_alert_acknowledged', {
      alert_id: alert.id,
      severity: alert.severity,
      patient: alert.patient_name,
      acknowledged_at: new Date().toISOString()
    });

    if (alert.action_route === 'session') {
      onOpenSession();
    } else {
      onOpenPatientProfile('018f3a12-1003-7000-8000-000000000003');
    }
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-[#EAF6FA] text-brand-dark flex flex-col justify-between select-none relative overflow-y-auto pb-10">
      <div>
        <IOSStatusBar variant="dark" />

        {/* Title */}
        <div className="px-6 pt-2 pb-2 text-center">
          <h1 className="text-2xl font-bold text-[#0B2E40]">Alerts</h1>
        </div>

        {/* Alerts List */}
        <div className="px-6 pt-3 space-y-4">
          {alerts.map((alert) => {
            const isHigh = alert.severity === 'High';
            return (
              <div
                key={alert.id}
                className="bg-white border border-[#7BAEC4] rounded-2xl p-4 shadow-xs space-y-2.5 hover:border-[#12617A] transition-all"
              >
                {/* Header Row: Category + Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12617A] tracking-wider uppercase">
                    {alert.category} ALERT
                  </span>

                  {isHigh ? (
                    <span className="bg-[#FDE8E8] text-[#C81E1E] border border-[#F8B4B4] text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                      <span>▲ High</span>
                    </span>
                  ) : (
                    <span className="bg-[#EBF0FF] text-[#1E40AF] text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                      <span>① Medium</span>
                    </span>
                  )}
                </div>

                {/* Patient & Bed Information */}
                <div>
                  <h3 className="text-base font-bold text-[#0B2E40] leading-snug">
                    {alert.patient_name}
                  </h3>
                  <div className="text-xs text-[#5A7684]">
                    {alert.bed_number} • ID: {alert.patient_code}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#0B2E40] leading-relaxed">
                  {alert.description}
                </p>

                {/* Divider Line */}
                <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-[#5A7684]">
                    <Clock size={13} />
                    <span>{alert.time_label}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAction(alert)}
                    className="font-bold text-[#12617A] hover:underline flex items-center space-x-0.5 min-h-[36px]"
                  >
                    <span>{alert.action_label}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
