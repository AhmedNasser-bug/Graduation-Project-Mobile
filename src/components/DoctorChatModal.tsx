import React, { useState, useEffect } from 'react';
import { X, Send, User, CheckCheck } from 'lucide-react';
import { sqliteService } from '../db/sqliteHelper';
import { telemetryBus } from '../config/firebaseClient';

interface DoctorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'Doctor' | 'Nurse';
  text: string;
  time: string;
}

export const DoctorChatModal: React.FC<DoctorChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Doctor',
      text: 'Good morning Sara. Please monitor Ahmed Mohamed (Bed 04) closely during Hour 2. His pre-dialysis MAP was borderline low.',
      time: '08:40 AM'
    },
    {
      id: '2',
      sender: 'Nurse',
      text: 'Good morning Dr. Hassan. Noted. Pre-HD vitals logged: 130/80 mmHg, MAP 96.7 mmHg, Temp 36.8°C. Heparin bolus given.',
      time: '08:44 AM'
    },
    {
      id: '3',
      sender: 'Doctor',
      text: 'Directive: Maintain UF <= 650 mL/h. If SBP drops < 100, reduce rate by 200 mL/h and notify me immediately.',
      time: '08:50 AM'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Nurse',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Dispatch to Web Dashboard
    if (telemetryBus) {
      telemetryBus.postMessage({
        type: 'NURSE_CHAT_MESSAGE',
        data: newMsg
      });
    }

    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#12617A] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-sm">
              AH
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Dr. Ahmed Hassan</h3>
              <p className="text-[11px] text-brand-light/80">Attending Nephrologist • Ward Bay A/B</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EAF6FA]/40 text-xs">
          {messages.map((m) => {
            const isNurse = m.sender === 'Nurse';
            return (
              <div key={m.id} className={`flex ${isNurse ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-2xs space-y-1 ${
                  isNurse ? 'bg-[#12617A] text-white rounded-br-xs' : 'bg-white text-[#0B2E40] border border-[#7BAEC4] rounded-bl-xs'
                }`}>
                  <div className="text-[10px] font-bold opacity-75">
                    {m.sender === 'Doctor' ? 'Dr. Ahmed Hassan' : 'Nurse Sara Ali'}
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end space-x-1 text-[9px] opacity-70">
                    <span>{m.time}</span>
                    {isNurse && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message to attending nephrologist..."
            className="flex-1 min-h-[44px] px-3.5 rounded-full border border-brand-border bg-canvas/30 text-xs text-[#0B2E40] focus:outline-none focus:ring-2 focus:ring-[#12617A]"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-full bg-[#12617A] text-white flex items-center justify-center hover:bg-brand-accent active:scale-95 transition-all shadow-xs"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
