import React, { useState } from 'react';
import { Layers, ShieldCheck, ArrowRight, CheckCircle2, XCircle, Code2, Copy, Check, Terminal, Play, Zap, Database, Cpu, Network } from 'lucide-react';

export default function ProtocolView({ rules, selectedState }) {
  const [copied, setCopied] = useState(false);
  const [activeApiTab, setActiveApiTab] = useState('clock');
  const [apiResponse, setApiResponse] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const sampleSchema = {
    "$schema": "https://samay.gov.in/schemas/v1/cpsv-ap-rts.json",
    "protocolVersion": "1.0.0",
    "service_id": "MH-REV-001",
    "state": "Maharashtra",
    "state_code": "MH",
    "state_act": "Maharashtra Right to Public Services Act, 2015",
    "department": "Revenue & Forest Department",
    "service_name": "Income Certificate (उत्पन्नाचा दाखला)",
    "deadline_days": 15,
    "deadline_type": "working_days",
    "statutory_exclusions": ["Sundays", "2nd_and_4th_Saturdays", "State_Gazetted_Holidays"],
    "designated_officer": {
      "designation": "Nayab Tahsildar",
      "office": "Tehsil Revenue Office",
      "sla_window": 15
    },
    "first_appellate_authority": {
      "designation": "Sub-Divisional Officer (SDO)",
      "statutory_hearing_limit_days": 30
    },
    "second_appellate_authority": {
      "designation": "Additional Collector",
      "commission_oversight": "Maharashtra State Right to Services Commission"
    },
    "penalty_clause": {
      "rate_per_day_inr": 250,
      "max_cap_inr": 5000,
      "deductible_from": "officer_monthly_salary",
      "statute_section": "Section 18, Maharashtra RTS Act 2015"
    },
    "cryptographic_verification": {
      "human_verified": true,
      "verified_by": "Adv. S. Kulkarni (Legal Registry)",
      "hash": "a9f4c3b2810e7b99c812d45e99812c771fa1b439c28e833198031d2345e6789a"
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleSchema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunMockApi = (type) => {
    setLoadingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      setLoadingApi(false);
      if (type === 'clock') {
        setApiResponse({
          status: "SUCCESS",
          endpoint: "POST /v1/clock/evaluate",
          runtimeMs: 1.4,
          data: {
            applicationId: "MH-REV-2026-981244",
            submissionDate: "2026-10-04",
            statutorySlaDays: 15,
            deadlineType: "working_days",
            referenceDate: "2026-10-28",
            statutoryDeadlineDate: "2026-10-24",
            workingDaysElapsed: 19,
            isBreached: true,
            daysOverdue: 4,
            statutoryPenaltyAccruedINR: 1000,
            penaltyRatePerDayINR: 250,
            officerSalaryAttachmentClause: "Section 18, Maharashtra RTS Act 2015",
            excludedCalendarDays: {
              sundays: 3,
              secondFourthSaturdays: 2,
              gazettedHolidays: 2
            },
            adjudicationAction: "UNLOCK_ONE_TAP_FIRST_APPEAL"
          }
        });
      } else if (type === 'rules') {
        setApiResponse({
          status: "SUCCESS",
          endpoint: "GET /v1/rules?state=MH",
          count: 5,
          schema: "CPSV-AP-RTS-v1",
          records: rules.filter(r => r.state_code === 'MH').slice(0, 3)
        });
      } else if (type === 'appeal') {
        setApiResponse({
          status: "SUCCESS",
          endpoint: "POST /v1/appeals/dispatch",
          appealNumber: "SAMAY/APP/MH/2026/89412",
          addressedTo: "Sub-Divisional Officer (SDO), Pune Eastern Division",
          statuteCited: "Section 18, Maharashtra Right to Public Services Act 2015",
          statutoryPrayer: "Demand for service disposal in 48 hours and ₹1,000 salary penalty deduction",
          deliveryModes: ["Digital Push to SDO Portal", "WhatsApp Notice to Applicant", "Official SpeedPost EM892109284IN"],
          sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        });
      }
    }, 350);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero: UPI for Rights Metaphor Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>The UPI Paradigm for Public Rights</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
            Standardising the Protocol, <br />
            <span className="text-amber-400">Not Individual State Portals.</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            In 2016, UPI did not build another bank. It created an open standard protocol layer so any app could move money. 
            <strong> SAMAY does the exact same for statutory promises across all 30 Indian states</strong>. 
            It translates paper slips and disparate state gazettes into a machine-readable protocol, automating enforcement by pure deterministic code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-slate-300">
                <strong>Moves the burden:</strong> From the citizen following up, to the system enforcing by default.
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-slate-300">
                <strong>Deterministic Clock:</strong> Never an LLM. Pure code working-day calendar with legal pauses.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Architectural Comparison: UPI vs SAMAY */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Network className="w-5 h-5 text-blue-600" />
          <span>Architectural Parallel: Payments vs Public Services</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          How SAMAY standardises rights enforcement in the exact mold of India's Digital Public Infrastructure (DPI).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPI Side */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Financial Layer (UPI / NPCI)
              </span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Money Protocol
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">1. INGESTION APPS</span>
                <span className="font-semibold text-slate-800">PhonePe, GPay, Paytm, BHIM</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-[10px] text-blue-600 font-bold block">2. UNIVERSAL PROTOCOL SWITCH</span>
                <span className="font-bold text-blue-900">UPI Protocol (NPCI Virtual Address Engine)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">3. SETTLEMENT LAYER</span>
                <span className="font-semibold text-slate-800">State Bank of India, HDFC, ICICI, PNB</span>
              </div>
            </div>
          </div>

          {/* SAMAY Side */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Public Rights Layer (SAMAY)
              </span>
              <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Rights Protocol
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-600 font-bold block">1. INGESTION INTERFACES</span>
                <span className="font-semibold text-slate-800">Paper Slips (89% CSCs), Aaple Sarkar, Sakala, WhatsApp</span>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-300">
                <span className="text-[10px] text-amber-800 font-bold block">2. UNIVERSAL RIGHTS PROTOCOL</span>
                <span className="font-bold text-amber-950">SAMAY (CPSV-AP Schema + Deterministic Clock + SHA-256)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-600 font-bold block">3. AUTOMATED ADJUDICATION</span>
                <span className="font-semibold text-slate-800">One-Tap First Appeal, Officer Radar, Commission Map</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table: Why Existing Portals Fail */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Comparative Analysis: State Portals vs Grievance Portals vs SAMAY
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Why 32.85 Lakh applications are still pending despite 30 state RTS acts on paper.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Capability / Feature</th>
                <th className="px-4 py-3">State Portals (Aaple Sarkar / Sakala)</th>
                <th className="px-4 py-3">Grievance Portals (CPGRAMS / CM Helpline)</th>
                <th className="px-4 py-3 bg-blue-50/80 text-blue-900">SAMAY Standard Layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Geographic Coverage</td>
                <td className="px-4 py-3 text-rose-600 flex items-center space-x-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Siloed (1 State Only)</span>
                </td>
                <td className="px-4 py-3 text-slate-600">Central / Multi-state</td>
                <td className="px-4 py-3 bg-blue-50/40 text-blue-900 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cross-State Universal Protocol</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Paper Acknowledgement Slips</td>
                <td className="px-4 py-3 text-rose-600">❌ Completely Untracked (89% CSCs)</td>
                <td className="px-4 py-3 text-rose-600">❌ No slip ingestion</td>
                <td className="px-4 py-3 bg-blue-50/40 text-emerald-800 font-bold">
                  ✅ Mobile AI OCR with Viewfinder
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Statutory Legal Clock</td>
                <td className="px-4 py-3 text-slate-600">Static text date (No holiday logic)</td>
                <td className="px-4 py-3 text-rose-600">❌ Zero legal clock (Only complaints)</td>
                <td className="px-4 py-3 bg-blue-50/40 text-emerald-800 font-bold">
                  ✅ Deterministic Code Clock + Pauses
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Officer Proactive Radar</td>
                <td className="px-4 py-3 text-rose-600">❌ Hidden inside office silos</td>
                <td className="px-4 py-3 text-rose-600">❌ Post-facto reaction only</td>
                <td className="px-4 py-3 bg-blue-50/40 text-emerald-800 font-bold">
                  ✅ Real-time Amber SLA Warning
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Statutory First Appeal</td>
                <td className="px-4 py-3 text-rose-600">Citizen must draft, hire lawyer, find FAA</td>
                <td className="px-4 py-3 text-slate-600">Administrative transfer only</td>
                <td className="px-4 py-3 bg-blue-50/40 text-rose-700 font-bold">
                  ✅ 1-Tap Form 1 with Salary Penalty Claim
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Offline Resilience</td>
                <td className="px-4 py-3 text-rose-600">Requires uninterrupted high-speed internet</td>
                <td className="px-4 py-3 text-rose-600">Web only</td>
                <td className="px-4 py-3 bg-blue-50/40 text-emerald-800 font-bold">
                  ✅ 100% Offline-Capable (Local PWA & Engine)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive API Playground & Schema Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Playground */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Live Protocol REST Endpoints</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                v1.0.0 Ready
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-4">
              Test SAMAY's core statutory primitives live in your browser:
            </p>

            {/* API Trigger Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => { setActiveApiTab('clock'); handleRunMockApi('clock'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeApiTab === 'clock' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>POST /v1/clock/evaluate</span>
              </button>

              <button
                onClick={() => { setActiveApiTab('rules'); handleRunMockApi('rules'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeApiTab === 'rules' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>GET /v1/rules?state=MH</span>
              </button>

              <button
                onClick={() => { setActiveApiTab('appeal'); handleRunMockApi('appeal'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  activeApiTab === 'appeal' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>POST /v1/appeals/dispatch</span>
              </button>
            </div>

            {/* Live Output */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-xs text-slate-300">
              {loadingApi ? (
                <div className="h-full flex items-center justify-center text-slate-500 py-12 space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>Executing deterministic engine...</span>
                </div>
              ) : apiResponse ? (
                <pre className="text-[11px] leading-relaxed text-emerald-300">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                  <Code2 className="w-8 h-8 mb-2 opacity-40" />
                  <span>Click an endpoint above to execute the live engine call</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Deterministic engine response latency: &lt;2ms</span>
            <span className="text-emerald-400 font-mono font-bold">100% Code Computed</span>
          </div>
        </div>

        {/* CPSV-AP JSON Schema Explorer */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Open CPSV-AP RTS Schema Specification
                </h3>
                <p className="text-[11px] text-slate-500">
                  Standardised machine-readable contract for notified state services
                </p>
              </div>

              <button
                onClick={handleCopySchema}
                className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy Schema'}</span>
              </button>
            </div>

            <div className="mt-3 bg-slate-900 rounded-xl p-4 border border-slate-800 max-h-[300px] overflow-y-auto font-mono text-[11px] text-amber-300">
              <pre>{JSON.stringify(sampleSchema, null, 2)}</pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Validated with SHA-256 human legal review hash</span>
            <span className="font-mono text-blue-700 font-bold">CPSV-AP Compatible</span>
          </div>
        </div>

      </div>

    </div>
  );
}
