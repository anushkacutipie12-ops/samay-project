import React, { useState } from 'react';
import { FileCode, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Copy, Check, Eye } from 'lucide-react';
import { compileNotifiedListWithAI } from '../services/aiServices.js';
import { sha256 } from '../engine/auditLog.js';

const SAMPLE_GAZETTES = [
  {
    id: "gazette-delhi",
    title: "Delhi e-SLA Gazette (Demo: Live Adding 3rd State)",
    stateCode: "DL",
    text: `GOVERNMENT OF NCT OF DELHI
DEPARTMENT OF ADMINISTRATIVE REFORMS
NOTIFICATION No. F.14(11)/2010/AR/323-45
Dated: 15th September, 2011

In exercise of the powers conferred by Section 3 of the Delhi (Right of Citizen to Time Bound Delivery of Services) Act, 2011, the Lieutenant Governor hereby notifies the following service:

Department: Food, Civil Supplies & Consumer Affairs
Name of Service: Issuance of New National Food Security Ration Card
Stipulated Time Limit: 30 Working Days
Designated Officer: Food & Supply Officer (FSO)
First Appellate Authority: Assistant Commissioner (Food & Supplies)
Second Appellate Authority: Additional Commissioner (Food & Supplies)
Statutory Penalty: Rs. 10 per day of delay up to a maximum of Rs. 200 recoverable from salary.`
  },
  {
    id: "gazette-maha",
    title: "Maharashtra RTS Notification (Revenue)",
    stateCode: "MH",
    text: `GOVERNMENT OF MAHARASHTRA
REVENUE & FOREST DEPARTMENT
Notification No. RTS-2015/C.R.396/18(Part-1)
Dated: 21st August, 2015

Subject: Notification of Public Services under Section 3 of Maharashtra Right to Public Services Act, 2015.

Service Name: Domicile and Age Certificate (अधिवास व वय प्रमाणपत्र)
Department: Revenue & Forest Department
Stipulated Time Limit: 15 Working Days
Designated Officer: Nayab Tahsildar
First Appellate Authority: Sub-Divisional Officer (SDO)
Second Appellate Authority: Additional Collector
Penalty Clause: Rs. 250 per day of unjustified delay, maximum Rs. 5,000 under Section 18 of the Act.`
  },
  {
    id: "gazette-sakala",
    title: "Karnataka Sakala Gazette (Transport)",
    stateCode: "KA",
    text: `GOVERNMENT OF KARNATAKA
DEPARTMENT OF PERSONNEL AND ADMINISTRATIVE REFORMS
Notification No. DPAR 57 GSC 2011 (Sakala Schedule)

Service: Driving Licence Renewal / Endorsement
Department: Transport Department
Stipulated Time Period: 7 Working Days
Designated Officer: Regional Transport Officer (RTO)
First Appellate Authority: Deputy Transport Commissioner
Second Appellate Authority: Joint Transport Commissioner
Statutory Compensatory Delay Fine: Rs. 20 per day up to Rs. 500 under Section 8 of Sakala Act.`
  }
];

export default function RightsCompiler({
  onAddRule,
  existingRules,
  apiKey
}) {
  const [inputText, setInputText] = useState(SAMPLE_GAZETTES[0].text);
  const [selectedStateCode, setSelectedStateCode] = useState("DL");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState(null);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [viewJson, setViewJson] = useState(false);

  const handleSelectSample = (sample) => {
    setInputText(sample.text);
    setSelectedStateCode(sample.stateCode);
    setCompiledResult(null);
    setApprovedSuccess(false);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompiledResult(null);
    setApprovedSuccess(false);

    try {
      const result = await compileNotifiedListWithAI(inputText, selectedStateCode, apiKey);
      if (result.success && result.records?.length > 0) {
        setCompiledResult(result.records[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleHumanApprove = async () => {
    if (!compiledResult) return;

    // Cryptographic hash signing of the verified rule
    const ruleString = JSON.stringify(compiledResult);
    const ruleHash = await sha256(ruleString);

    const verifiedRule = {
      ...compiledResult,
      human_verified: true,
      verified_by: "Chief Legal Drafter (Verified Registry)",
      verified_at: new Date().toISOString(),
      hash: ruleHash
    };

    onAddRule(verifiedRule);
    setApprovedSuccess(true);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Compiler Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>LLM-Assisted Rights Compiler (Slide 4)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Transform Raw Public Notices into Machine-Readable Promises
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Converting unstructured multilingual government gazettes into open CPSV-AP-compliant schemas. 
            <strong> The LLM parses the legal gazette, but a human approves every rule</strong>, and the clock is computed by deterministic code.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
              Open Standard Schema
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
              Human-in-the-Loop Signoff
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
              SHA-256 Hash Chain Stamped
            </span>
          </div>
        </div>
      </div>

      {/* Main Compiler Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gazette Input */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>Step 1: Paste Official Gazette / Notification Text</span>
            </h2>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Raw Input
            </span>
          </div>

          {/* Sample gazette picker */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Load Presets (Test live state onboarding):
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_GAZETTES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectSample(g)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    inputText === g.text
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={11}
              className="w-full font-mono text-xs p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 leading-relaxed text-slate-800"
              placeholder="Paste raw gazette notification text here..."
            />
          </div>

          {/* Compile CTA */}
          <button
            onClick={handleCompile}
            disabled={isCompiling || !inputText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling Legal Gazette into CPSV-AP Schema...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Compile to Schema with AI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Extraction & Human Approval */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Step 2: Human Verification & Schema Review</span>
              </h2>
              {compiledResult && (
                <button
                  onClick={() => setViewJson(!viewJson)}
                  className="text-[11px] font-mono text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  {viewJson ? "Show UI Cards" : "Show JSON Schema"}
                </button>
              )}
            </div>

            {compiledResult ? (
              <div className="mt-4 space-y-3">
                {viewJson ? (
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[380px]">
                    {JSON.stringify(compiledResult, null, 2)}
                  </pre>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                          Service ID & State
                        </span>
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {compiledResult.service_id} • {compiledResult.state}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        CPSV-AP Validated
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">Service Name</span>
                        <span className="font-bold text-slate-900 truncate block">{compiledResult.service_name}</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">Statutory SLA</span>
                        <span className="font-extrabold text-blue-700 block font-mono">
                          {compiledResult.deadline_days} Working Days
                        </span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">Designated Officer</span>
                        <span className="font-medium text-slate-800 truncate block">{compiledResult.designated_officer}</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">First Appellate Authority</span>
                        <span className="font-medium text-slate-800 truncate block">{compiledResult.first_appellate_authority}</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">Daily Penalty</span>
                        <span className="font-bold text-rose-600 font-mono">
                          ₹{compiledResult.penalty_per_day}/day (Max ₹{compiledResult.max_penalty})
                        </span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 block font-semibold">Legal Citation</span>
                        <span className="font-medium text-slate-800 truncate block">{compiledResult.appeal_statute_section}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900">
                      <strong>Human Sign-off Guard:</strong> Under the SAMAY protocol, no AI rule enters the registry without legal officer signoff to eliminate legal hallucination.
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <FileCode className="w-10 h-10 mb-2 opacity-40 text-indigo-500" />
                <p className="text-xs font-medium">Click "Compile to Schema with AI" to generate the open rule record</p>
                <p className="text-[10px] text-slate-400 mt-1">Converts public notified-service lists into open, machine-readable records</p>
              </div>
            )}
          </div>

          {/* Action CTA */}
          {compiledResult && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              {approvedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Rule Approved & Signed to Hash-Chained Registry! Available in active tracking.</span>
                </div>
              ) : (
                <button
                  onClick={handleHumanApprove}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Sign Rule to Registry (Hash Stamped)</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Active Rules Registry Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <span>Active Notified Service Rules Registry ({existingRules.length})</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {existingRules.map((rule) => (
            <div key={rule.service_id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-700 text-[10px]">{rule.service_id}</span>
                <span className="text-[10px] font-bold text-slate-500">{rule.state_code}</span>
              </div>
              <p className="font-bold text-slate-900 truncate">{rule.service_name}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>SLA: <strong>{rule.deadline_days} days</strong></span>
                <span className="text-emerald-700 font-semibold font-mono">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
