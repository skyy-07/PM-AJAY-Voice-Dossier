import React from 'react';
import { Sparkles, X, ArrowRight, Award, Zap, TrendingUp, MapPin } from 'lucide-react';

interface DemoConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sampleType: 'welder' | 'tailor' | 'tractor' | 'weaver') => void;
}

export const DemoConversationModal: React.FC<DemoConversationModalProps> = ({
  isOpen,
  onClose,
  onSelectSample
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#181818] rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Evaluation Showcase</span>
        </div>

        <h3 className="font-editorial-serif text-2xl font-bold text-white tracking-tight">
          Select a Rural Livelihood Case Study
        </h3>
        <p className="text-xs text-white/50 mt-1 mb-6 font-light">
          Test the end-to-end AI slot filling, NSQF Level 1-5 mapping, and local district economic matching with realistic beneficiary personas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Persona 1 */}
          <div
            onClick={() => {
              onSelectSample('welder');
              onClose();
            }}
            className="bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-amber-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-editorial-serif font-bold text-white text-sm">🔥 Ramesh Kumar</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Varanasi, UP
                </span>
              </div>
              <p className="text-xs text-white/60 font-light">
                6 years informal grill welding. Wants own workshop near village (10 km limit).
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-400">
                &rarr; Maps to: Manual Metal Arc Welder (NSQF 3)
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Run Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Persona 2 */}
          <div
            onClick={() => {
              onSelectSample('tailor');
              onClose();
            }}
            className="bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-amber-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-editorial-serif font-bold text-white text-sm">🧵 Sushila Devi</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Varanasi, UP
                </span>
              </div>
              <p className="text-xs text-white/60 font-light">
                4 years blouse stitching on manual machine. Seeking commercial motorized garment training.
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-400">
                &rarr; Maps to: Self Employed Tailor (NSQF 4)
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Run Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Persona 3 */}
          <div
            onClick={() => {
              onSelectSample('tractor');
              onClose();
            }}
            className="bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-amber-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-editorial-serif font-bold text-white text-sm">🚜 Santosh Manjhi</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Gaya, Bihar
                </span>
              </div>
              <p className="text-xs text-white/60 font-light">
                7 years seasonal diesel pump &amp; tractor mechanic. Seeking formal RPL certificate.
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-400">
                &rarr; Maps to: Agri Machinery Mechanic (NSQF 4)
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Run Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Persona 4 */}
          <div
            onClick={() => {
              onSelectSample('weaver');
              onClose();
            }}
            className="bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-amber-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-editorial-serif font-bold text-white text-sm">🧶 Murugan K.</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Salem, Tamil Nadu
                </span>
              </div>
              <p className="text-xs text-white/60 font-light">
                Traditional pit loom silk weaver. High local textile export demand.
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-400">
                &rarr; Maps to: Jacquard Handloom Weaver (NSQF 3)
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Run Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
