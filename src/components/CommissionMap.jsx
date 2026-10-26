import React, { useState } from 'react';
import { Map, TrendingDown, AlertTriangle, ShieldCheck, Download, BarChart3, Building, FileSpreadsheet, MapPin } from 'lucide-react';
import { COMMISSION_METRICS, DISTRICT_PERFORMANCE } from '../data/commissionData.js';

export default function CommissionMap({ selectedState = "MH" }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const metrics = selectedState === "KA" ? COMMISSION_METRICS.karnataka : COMMISSION_METRICS.maharashtra;
  const districts = selectedState === "KA" ? DISTRICT_PERFORMANCE.KA : DISTRICT_PERFORMANCE.MH;
  const stateTitle = selectedState === "KA" ? "Karnataka Sakala Mission" : selectedState === "DL" ? "Delhi e-SLA Commission" : "Maharashtra State Right to Services Commission";

  const activeDistrict = selectedDistrict || districts[0];

  const handleExportReport = () => {
    const reportData = {
      title: `${stateTitle} - Right to Services Compliance Audit Report`,
      generatedAt: new Date().toISOString(),
      cagBenchmark: "CAG Audit Report No. 1 of 2023",
      totalDecidedLateHistorical: metrics.lateDisposalsCag,
      activePenaltiesAccrued: metrics.totalPenaltiesImposedINR,
      districtBreakdown: districts
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SAMAY_RTS_Audit_${selectedState}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Commission Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>State RTS Statutory Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {stateTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time cross-district compliance radar, penalty liability telemetry, and CAG audit tracking.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export CAG Audit Report</span>
          </button>
        </div>

        {/* CAG Audit Comparison Stat Strip (Matching Slide 2 & Slide 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              CAG Late Disposals
            </span>
            <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">
              {metrics.lateDisposalsRate}%
            </span>
            <span className="text-[10px] text-slate-400">
              {metrics.lateDisposalsCag.toLocaleString('en-IN')} cases (2016-21)
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              CAG Pending Backlog
            </span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
              {(metrics.pendingBeyondSla / 100000).toFixed(2)} Lakh
            </span>
            <span className="text-[10px] text-slate-400">
              Applications overdue beyond SLA
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Citizen Unawareness
            </span>
            <span className="text-xl font-black text-blue-400 font-mono mt-0.5 block">
              63%
            </span>
            <span className="text-[10px] text-slate-400">
              Citizens unaware of right to appeal
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Seva Kendra Share
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
              {metrics.sevaKendraShare}%
            </span>
            <span className="text-[10px] text-slate-400">
              Applications filed on paper/kiosks
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive District Map & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District Compliance Grid / Heatmap */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>District Compliance Heatmap ({selectedState})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any district to inspect taluka-level breaches and accumulated statutory penalties.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-[10px] font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>&gt;85%</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>75-85%</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
                <span>&lt;75%</span>
              </span>
            </div>
          </div>

          {/* Interactive District Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {districts.map((dist) => {
              const isSelected = activeDistrict.id === dist.id;
              const isRed = dist.status === 'red';
              const isAmber = dist.status === 'amber';

              return (
                <button
                  key={dist.id}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                      : isRed
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                      : isAmber
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                      : 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[100px]">
                      {dist.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isRed ? 'bg-rose-100 text-rose-800' : isAmber ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {dist.onTime}%
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Breached:</span>
                      <span className="font-semibold text-rose-600 font-mono">
                        {dist.breached.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Delay:</span>
                      <span className="font-semibold text-slate-700">
                        {dist.avgDays}d (SLA {dist.slaDays}d)
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>District telemetry synchronized with State Data Centre</span>
            <span className="font-mono text-emerald-600 font-semibold">● 100% Hash Verifiable</span>
          </div>
        </div>

        {/* Selected District Deep Dive */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  District Audit Dossier
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {activeDistrict.name} District
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                activeDistrict.status === 'red'
                  ? 'bg-rose-100 text-rose-800'
                  : activeDistrict.status === 'amber'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeDistrict.onTime}% Compliance
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Applications Logged:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {activeDistrict.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Late Disposals / Breached:</span>
                  <span className="font-bold text-rose-600 font-mono">
                    {activeDistrict.breached.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Disposal Time:</span>
                  <span className="font-bold text-slate-900">
                    {activeDistrict.avgDays} Days (Statutory SLA: {activeDistrict.slaDays} Days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Bottleneck Service:</span>
                  <span className="font-bold text-indigo-700">
                    {activeDistrict.topDelayed}
                  </span>
                </div>
              </div>

              {/* Statutory Penalty Accumulation */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider block">
                  Cumulative Statutory Penalty Liability
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-rose-700 font-mono">
                    ₹{(activeDistrict.penaltyINR / 100000).toFixed(2)} Lakh
                  </span>
                  <span className="text-[11px] text-rose-600 font-medium">
                    in {activeDistrict.name}
                  </span>
                </div>
                <p className="text-[10px] text-rose-700 mt-1">
                  Statutorily recoverable from defaulting designated officers under Section 18 of the State RTS Act.
                </p>
              </div>

              {/* Commission Recommended Order */}
              <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Commission Directive Recommendation
                </span>
                <p className="text-slate-700 font-medium text-[11px]">
                  Direct Collector & SDO of {activeDistrict.name} to initiate departmental enquiry for {activeDistrict.topDelayed} backlogs and convene special Lok Adalat.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Jurisdiction: State RTS Commission</span>
            <button
              onClick={handleExportReport}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Issue Notice to Collector →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
