import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  HardDrive, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { CandidateProfile, SyncQueueRecord } from '../../types.js';
import { api } from '../../lib/api.js';
import { audioController } from '../../lib/audio.js';

export const OfflineKioskScreen: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<SyncQueueRecord[]>([]);

  const [activeCandidateName, setActiveCandidateName] = useState('');
  const [activeTrade, setActiveTrade] = useState('');

  const handleRecordOfflineEntry = async () => {
    if (isRecording) {
      setIsRecording(false);
      await audioController.stopRecording();

      // Add to offline queue
      const newRecord: SyncQueueRecord = {
        id: `OFF-${Date.now().toString().slice(-4)}`,
        candidateId: `BEN-KIOSK-${Date.now().toString().slice(-3)}`,
        action: 'NEW_ASSESSMENT',
        payload: {
          name: activeCandidateName || 'Kiosk Beneficiary',
          trade: activeTrade || 'Masonry & Plastering',
          village: 'Pipri Gram Panchayat',
          experienceYears: 5
        },
        status: 'pending',
        retryCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setOfflineQueue([newRecord, ...offlineQueue]);
      setActiveCandidateName('');
      setActiveTrade('');
    } else {
      setIsRecording(true);
      await audioController.startRecording();
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await api.syncOfflineRecords(offlineQueue);
      setOfflineQueue([]);
      setIsOnline(true);
    } catch (err) {
      console.error('Error syncing records:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Kiosk Mode Top Header */}
      <div className="bg-[#181818] text-white rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-editorial-serif text-xl sm:text-2xl font-normal tracking-tight">
                Gram Panchayat Kiosk <span className="italic text-amber-400">Terminal</span>
              </h2>
              <span className="bg-white/10 text-white/70 font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-white/10">
                Touch Node v1.4
              </span>
            </div>
            <p className="text-white/50 text-xs mt-0.5 font-light">
              Village Pipri &bull; Block Kashi Vidyapeeth &bull; District Varanasi
            </p>
          </div>
        </div>

        {/* Online / Offline Simulator Toggle */}
        <div className="flex items-center space-x-3 bg-[#111111] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono uppercase tracking-wider transition cursor-pointer ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online (Connected)' : 'Offline (Simulated No Signal)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Touch Recording Terminal */}
        <div className="lg:col-span-7 bg-[#181818] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h3 className="font-editorial-serif text-lg font-bold text-white">
              Spoken Beneficiary Intake
            </h3>
            <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded">
              Kiosk Station #04
            </span>
          </div>

          <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed font-light">
            Beneficiary touches the screen and speaks directly in Bhojpuri or Hindi. Audio is compressed and stored locally in the kiosk SSD queue.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Beneficiary Name (Optional Spoken or Typed):
              </label>
              <input
                type="text"
                value={activeCandidateName}
                onChange={(e) => setActiveCandidateName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Known Trade / Work:
              </label>
              <input
                type="text"
                value={activeTrade}
                onChange={(e) => setActiveTrade(e.target.value)}
                placeholder="e.g. Masonry, Inverter Repair, Handloom"
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          {/* Large Touch Button */}
          <button
            onClick={handleRecordOfflineEntry}
            className={`w-full py-7 rounded-2xl font-semibold text-xs tracking-wider uppercase shadow-2xl flex flex-col items-center justify-center space-y-2 transition cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 hover:scale-[1.01]'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-8 h-8 mb-1" />
                <span>Tap Screen to Finish Spoken Assessment</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 mb-1" />
                <span>Touch Screen &amp; Speak Your Work (बोलकर बताएं)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Offline Queue & Sync Manager */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <h3 className="font-editorial-serif font-bold text-white text-sm">
                  Local Kiosk Storage Queue
                </h3>
              </div>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] px-2.5 py-0.5 rounded">
                {offlineQueue.length} Pending
              </span>
            </div>

            <p className="text-xs text-white/50 mb-4 font-light leading-relaxed">
              Encrypted assessments saved on-device. When network is restored, the queue syncs with the central PM-AJAY cloud database.
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {(offlineQueue || []).length === 0 ? (
                <div className="text-center py-6 text-xs text-white/40 bg-[#121212] border border-white/5 rounded-xl font-light">
                  ✓ All offline assessments are fully synced with PM-AJAY Cloud.
                </div>
              ) : (
                (offlineQueue || []).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141414] border border-white/10 rounded-xl p-3 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-medium text-white">
                      <span>{item.payload.name}</span>
                      <span className="text-amber-400 font-mono text-[10px]">{item.id}</span>
                    </div>
                    <div className="text-white/60 font-light">
                      Trade: <span className="font-medium text-white/90">{item.payload.trade}</span> ({item.payload.experienceYears} yrs)
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/40 pt-1 border-t border-white/5 font-mono">
                      <span>{item.payload.village}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Queued locally</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sync Trigger */}
            <button
              onClick={handleSyncAll}
              disabled={offlineQueue.length === 0 || isSyncing}
              className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                offlineQueue.length === 0
                  ? 'bg-[#222222] text-white/20 border border-white/5 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing with PM-AJAY Cloud...' : 'Sync Local Queue to Cloud Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
