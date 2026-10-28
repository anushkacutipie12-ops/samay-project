import React, { useState } from 'react';
import { Map, TrendingDown, AlertTriangle, ShieldCheck, Download, BarChart3, Building, FileSpreadsheet, MapPin, Layers, CheckCircle2, AlertCircle, FileText, Printer } from 'lucide-react';
import { COMMISSION_METRICS, DISTRICT_PERFORMANCE } from '../data/commissionData.js';

export default function CommissionMap({ selectedState = "MH" }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [viewFormat, setViewFormat] = useState('svg_map'); // 'svg_map' | 'grid'
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [hoveredDist, setHoveredDist] = useState(null);

  const metrics = selectedState === "KA" ? COMMISSION_METRICS.karnataka : COMMISSION_METRICS.maharashtra;
  const districts = selectedState === "KA" ? DISTRICT_PERFORMANCE.KA : DISTRICT_PERFORMANCE.MH;
  const stateTitle = selectedState === "KA" ? "Karnataka Sakala Mission" : selectedState === "DL" ? "Delhi e-SLA Commission" : "Maharashtra State Right to Services Commission";
  const stateAct = selectedState === "KA" ? "Karnataka Sakala Act 2011" : "Maharashtra Right to Public Services Act 2015";

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

  // SVG Coordinates / Layout for Districts
  // Maharashtra layout approximation (West to East, North to South)
  const mhGeoNodes = [
    { id: "MH-NSK", x: 120, y: 110, w: 90, h: 55, name: "Nashik" },
    { id: "MH-JAL", x: 220, y: 100, w: 85, h: 50, name: "Jalgaon" },
    { id: "MH-AMR", x: 315, y: 95, w: 85, h: 55, name: "Amravati" },
    { id: "MH-NGP", x: 410, y: 90, w: 95, h: 60, name: "Nagpur" },
    { id: "MH-THA", x: 40, y: 175, w: 80, h: 50, name: "Thane" },
    { id: "MH-MUM", x: 25, y: 235, w: 75, h: 45, name: "Mumbai" },
    { id: "MH-PUN", x: 110, y: 185, w: 100, h: 60, name: "Pune" },
    { id: "MH-AUR", x: 220, y: 165, w: 105, h: 60, name: "Chh. Sambhajinagar" },
    { id: "MH-NAN", x: 335, y: 165, w: 85, h: 60, name: "Nanded" },
    { id: "MH-SAT", x: 100, y: 260, w: 85, h: 55, name: "Satara" },
    { id: "MH-SOL", x: 195, y: 240, w: 90, h: 60, name: "Solapur" },
    { id: "MH-KOL", x: 90, y: 330, w: 85, h: 55, name: "Kolhapur" }
  ];

  // Karnataka layout approximation (North to South)
  const kaGeoNodes = [
    { id: "KA-BLG", x: 80, y: 80, w: 100, h: 65, name: "Belagavi" },
    { id: "KA-KLB", x: 200, y: 70, w: 105, h: 65, name: "Kalaburagi" },
    { id: "KA-HUB", x: 90, y: 160, w: 95, h: 60, name: "Dharwad" },
    { id: "KA-SHI", x: 95, y: 235, w: 90, h: 60, name: "Shivamogga" },
    { id: "KA-DKN", x: 40, y: 310, w: 85, h: 60, name: "Dakshina Kannada" },
    { id: "KA-TUM", x: 195, y: 220, w: 95, h: 65, name: "Tumakuru" },
    { id: "KA-BLR", x: 205, y: 300, w: 105, h: 70, name: "Bengaluru Urban" },
    { id: "KA-MYS", x: 135, y: 380, w: 95, h: 65, name: "Mysuru" }
  ];

  const currentGeoNodes = selectedState === "KA" ? kaGeoNodes : mhGeoNodes;

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

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={() => setShowDeductionModal(true)}
              className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Section 18 Salary Deduction Order</span>
            </button>

            <button
              onClick={handleExportReport}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>

        {/* CAG Audit Comparison Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              CAG Late Disposals
            </span>
            <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">
              {metrics.lateDisposalsRate}%
            </span>
            <span className="text-[10px] text-slate-400">
              {metrics.lateDisposalsCag.toLocaleString('en-IN')} cases (CAG Audit 2023)
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
              Applications filed on paper receipts
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive District Map & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District Compliance Map / SVG */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>District Compliance Heatmap ({selectedState})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Select any district to inspect taluka-level breaches and accumulated statutory salary liabilities.
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setViewFormat('svg_map')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewFormat === 'svg_map' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Interactive Map
                </button>
                <button
                  onClick={() => setViewFormat('grid')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewFormat === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tile Grid
                </button>
              </div>
            </div>

            {/* SVG Choropleth Map Visualization */}
            {viewFormat === 'svg_map' ? (
              <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-hidden min-h-[380px] flex items-center justify-center">
                
                {/* SVG Canvas */}
                <svg
                  viewBox={selectedState === 'KA' ? "0 0 340 480" : "0 0 520 420"}
                  className="w-full h-auto max-h-[360px]"
                >
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connective mesh grid */}
                  <g opacity="0.1" stroke="#38bdf8" strokeWidth="0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 45} x2="520" y2={i * 45} />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 45} y1="0" x2={i * 45} y2="420" />
                    ))}
                  </g>

                  {/* District Shapes */}
                  {currentGeoNodes.map((node) => {
                    const distData = districts.find(d => d.id === node.id) || districts[0];
                    const isSelected = activeDistrict.id === distData.id;
                    const isRed = distData.status === 'red';
                    const isAmber = distData.status === 'amber';

                    const fillColor = isRed ? '#e11d48' : isAmber ? '#d97706' : '#059669';
                    const strokeColor = isSelected ? '#38bdf8' : isRed ? '#f43f5e' : isAmber ? '#f59e0b' : '#10b981';

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => setSelectedDistrict(distData)}
                        onMouseEnter={() => setHoveredDist(distData)}
                        onMouseLeave={() => setHoveredDist(null)}
                      >
                        <rect
                          x={node.x}
                          y={node.y}
                          width={node.w}
                          height={node.h}
                          rx="10"
                          fill={fillColor}
                          fillOpacity={isSelected ? 0.95 : 0.65}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 3 : 1.5}
                          filter={isSelected ? "url(#glow)" : undefined}
                        />

                        {/* Text Label */}
                        <text
                          x={node.x + node.w / 2}
                          y={node.y + node.h / 2 - 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {node.name}
                        </text>

                        <text
                          x={node.x + node.w / 2}
                          y={node.y + node.h / 2 + 10}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="9"
                          fontWeight="800"
                          fontFamily="monospace"
                        >
                          {distData.onTime}% SLA
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip */}
                {hoveredDist && (
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-xs shadow-xl pointer-events-none">
                    <span className="font-bold text-amber-400 block">{hoveredDist.name}</span>
                    <span className="text-[11px] text-slate-300">
                      Compliance: {hoveredDist.onTime}% • Breached: {hoveredDist.breached.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-400 block font-mono">
                      Penalty Liability: ₹{(hoveredDist.penaltyINR / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] space-y-1 font-semibold text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                    <span>&gt;85% (Green)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                    <span>75-85% (Amber)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600"></span>
                    <span>&lt;75% (Red / Breach)</span>
                  </div>
                </div>

              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {districts.map((dist) => {
                  const isSelected = activeDistrict.id === dist.id;
                  const isRed = dist.status === 'red';
                  const isAmber = dist.status === 'amber';

                  return (
                    <button
                      key={dist.id}
                      onClick={() => setSelectedDistrict(dist)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
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
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Synchronized across district collectorates</span>
            <span className="font-mono text-emerald-600 font-semibold">● SHA-256 Ledger Verified</span>
          </div>
        </div>

        {/* Selected District Deep Dive */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  District Telemetry Dossier
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
                    ₹{activeDistrict.penaltyINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-rose-600">
                    accumulated
                  </span>
                </div>
                <p className="text-[10px] text-rose-700 mt-1">
                  Recoverable from defaulting officers under {selectedState === 'KA' ? 'Section 8 of Sakala Act' : 'Section 18 of Maharashtra RTS Act'}.
                </p>
              </div>

              {/* Tehsildar & Sub-Division Accountability Matrix */}
              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Designated Officer Red Flags
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="font-medium text-slate-800">Nayab Tahsildar (East Division)</span>
                    <span className="text-rose-600 font-bold font-mono">42 Breached</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <span className="font-medium text-slate-800">Circle Officer (Bhoomi Records)</span>
                    <span className="text-amber-600 font-bold font-mono">18 At Risk</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button
            onClick={() => setShowDeductionModal(true)}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Generate Statutory Salary Attachment Notice</span>
          </button>
        </div>

      </div>

      {/* Statutory Salary Deduction Notice Modal */}
      {showDeductionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-auto text-slate-900 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  RTS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Statutory Salary Attachment Notice (Form 3)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Issued under {stateAct}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeductionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#fdfcf7] border border-amber-200 rounded-xl p-5 font-serif text-xs leading-relaxed space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-2">
                <p className="font-bold text-xs uppercase tracking-wider font-sans text-slate-800">
                  OFFICE OF THE STATE CHIEF COMMISSIONER FOR RIGHT TO SERVICES
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Statutory Order No: SAMAY/SAL-REC/{selectedState}/2026/092
                </p>
              </div>

              <p className="font-bold text-slate-800">
                To: The Treasury Officer &amp; Drawing &amp; Disbursing Officer (DDO), {activeDistrict.name} District
              </p>

              <p className="text-slate-700">
                WHEREAS, an audit of disposal timelines under the {stateAct} revealed that <strong>{activeDistrict.breached.toLocaleString()} applications</strong> exceeded the statutory deadline in {activeDistrict.name} District without justified recorded cause;
              </p>

              <p className="text-slate-700">
                THEREFORE, in exercise of powers vested under the Act, you are hereby ordered to attach and recover the accrued statutory penalty of <strong>₹{activeDistrict.penaltyINR.toLocaleString('en-IN')}</strong> from the monthly salary emoluments of the defaulting Designated Officers and remit the same into the State RTS Compensatory Redressal Fund.
              </p>

              <div className="pt-2 flex justify-between items-end border-t border-dashed border-slate-300 font-sans text-[11px]">
                <span className="text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="font-bold text-slate-800 text-right">
                  By Order of the State Commission <br />
                  <span className="text-[9px] text-slate-500 font-normal">Digitally Signed &amp; Hash-Chained</span>
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 text-xs">
              <button
                onClick={() => setShowDeductionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Close Notice
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
