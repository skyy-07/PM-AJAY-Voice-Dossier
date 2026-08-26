import React, { useState } from 'react';
import { MapPin, Building2, Users, Layers, Award } from 'lucide-react';
import { DistrictInfo, TrainingProvider } from '../../types.js';

interface GeospatialMapProps {
  districts: DistrictInfo[];
  providers: TrainingProvider[];
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  districts = [],
  providers = []
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>((districts && districts[0]) || null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'centers' | 'demand'>('all');

  return (
    <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-editorial-serif font-bold text-white text-lg">
            Geospatial Training Center &amp; Beneficiary Density Map
          </h3>
          <p className="text-xs text-white/50 mt-0.5 font-light">
            Real-time visual proximity mapping of PMKK/RSETI centers across target PM-AJAY districts.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center space-x-1.5 bg-[#121212] p-1 rounded-xl text-xs font-mono border border-white/10">
          <button
            onClick={() => setFilterLayer('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterLayer === 'all' ? 'bg-white/15 text-white font-medium shadow-xs' : 'text-white/50 hover:text-white'
            }`}
          >
            All Layers
          </button>
          <button
            onClick={() => setFilterLayer('centers')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterLayer === 'centers' ? 'bg-white/15 text-white font-medium shadow-xs' : 'text-white/50 hover:text-white'
            }`}
          >
            Training Centers
          </button>
          <button
            onClick={() => setFilterLayer('demand')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterLayer === 'demand' ? 'bg-white/15 text-white font-medium shadow-xs' : 'text-white/50 hover:text-white'
            }`}
          >
            Economic Demand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas Mockup */}
        <div className="lg:col-span-8 bg-[#0e0e0e] rounded-xl p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden border border-white/10">
          {/* Subtle Map Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* India Regional Nodes Visual Representation */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(districts || []).map((dist) => {
              const isSelected = selectedDistrict?.districtCode === dist.districtCode;
              const distProviders = (providers || []).filter(p => p.district === dist.name);
              const totalSeats = distProviders.reduce((acc, p) => acc + p.availableSeats, 0);

              return (
                <div
                  key={dist.districtCode}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : 'bg-[#151515] hover:bg-[#1a1a1a] border-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-editorial-serif font-bold text-white text-xs">{dist.name}</span>
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      {(dist.state || 'IN').slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-white/50 space-y-0.5 font-light">
                    <div>Beneficiaries: <span className="text-white/90 font-mono font-medium">{(dist.totalBeneficiariesRecorded || 0).toLocaleString()}</span></div>
                    <div>Available Seats: <span className="text-emerald-400 font-mono font-medium">{totalSeats} seats</span></div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-white/40 font-mono">Demand Index:</span>
                    <span className="text-amber-400 font-mono font-bold">{dist.demandScore || 80} / 100</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Status Bar */}
          <div className="relative z-10 mt-6 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/50 gap-2 font-light">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px] text-white/70">8 Priority PM-AJAY Districts Active</span>
            </div>
            <div className="text-[11px]">
              Click any district node to inspect training centers &amp; local vacancy clusters.
            </div>
          </div>
        </div>

        {/* Right Detail Panel for Selected District */}
        <div className="lg:col-span-4 bg-[#141414] rounded-xl p-5 border border-white/10 space-y-4">
          {selectedDistrict ? (
            <>
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    District Focus
                  </span>
                  <span className="text-xs font-mono text-white/50">
                    {selectedDistrict.state}
                  </span>
                </div>
                <h4 className="font-editorial-serif text-xl font-bold text-white mt-1">
                  {selectedDistrict.name}
                </h4>
                <p className="text-xs text-white/50 font-light">
                  Primary Language: <span className="text-white font-medium">{selectedDistrict.primaryLanguage}</span> ({selectedDistrict.primaryDialect})
                </p>
              </div>

              {/* District Stats */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50 font-light">Top Growth Trade:</span>
                  <span className="font-medium text-white">{(selectedDistrict.topTrades || [])[0] || 'Technical Trades'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50 font-light">Recorded Beneficiaries:</span>
                  <span className="font-mono text-white font-medium">{(selectedDistrict.totalBeneficiariesRecorded || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50 font-light">RPL Fast-Track Candidates:</span>
                  <span className="font-mono text-emerald-400 font-medium">{selectedDistrict.rplCandidatesIdentified || 0} identified</span>
                </div>
              </div>

              {/* Training Centers in this District */}
              <div>
                <h5 className="font-mono text-white/40 text-[10px] uppercase tracking-wider mb-2">
                  Accredited PM-AJAY Centers ({((providers || []).filter(p => p.district === selectedDistrict.name)).length}):
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(providers || [])
                    .filter(p => p.district === selectedDistrict.name)
                    .map(prov => (
                      <div key={prov.id} className="bg-[#181818] p-3 rounded-xl border border-white/10 text-xs space-y-1">
                        <div className="font-editorial-serif font-bold text-white">{prov.name}</div>
                        <div className="text-white/50 text-[11px] font-light">{prov.type} &bull; {prov.affiliatedSSC}</div>
                        <div className="flex justify-between text-[11px] text-emerald-400 font-mono pt-1">
                          <span>Capacity: {prov.allocatedSeats}/{prov.totalCapacity}</span>
                          <span>{prov.availableSeats} Open Seats</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-xs text-white/40 font-light">
              Select a district to view training center details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
