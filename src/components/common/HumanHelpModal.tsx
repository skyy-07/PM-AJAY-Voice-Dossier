import React, { useState } from 'react';
import { HelpCircle, X, CheckCircle2, Phone, User, MapPin } from 'lucide-react';
import { api } from '../../lib/api.js';

interface HumanHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  defaultDistrict?: string;
  defaultLanguage?: string;
}

export const HumanHelpModal: React.FC<HumanHelpModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  defaultDistrict = 'Varanasi',
  defaultLanguage = 'hi'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('Beneficiary requests assistance from Block Development Officer.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createEscalation({
        candidateId: candidateId || 'BEN-OFFICER-HELP',
        candidateName: name || 'Beneficiary Caller',
        candidatePhone: phone || '+91 98765 43210',
        reason,
        priority: 'High',
        district: defaultDistrict,
        preferredLanguage: defaultLanguage
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit escalation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#181818] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>

        <h3 className="font-editorial-serif text-xl font-bold text-white tracking-tight">
          Request Block Officer Assistance
        </h3>
        <p className="text-xs text-white/50 mt-1 mb-6 font-light">
          Connect directly with a PM-AJAY Block Livelihood Facilitator if you require in-person counseling or special accommodations.
        </p>

        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-editorial-serif font-bold text-white text-base">Escalation Logged Successfully</h4>
            <p className="text-xs text-emerald-300 font-light">
              The Block Development Officer in {defaultDistrict} has been notified and will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">Reason for Officer Assistance</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl shadow-md uppercase tracking-wider transition cursor-pointer"
            >
              {isSubmitting ? 'Submitting Request...' : 'Send Help Request to Block Officer'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
