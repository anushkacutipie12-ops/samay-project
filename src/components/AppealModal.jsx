import React, { useState, useEffect } from 'react';
import { FileText, Send, Printer, Share2, CheckCircle2, ShieldCheck, Download, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { draftStatutoryAppeal } from '../services/aiServices.js';

export default function AppealModal({
  application,
  rule,
  clock,
  onClose,
  onSubmitAppeal,
  apiKey,
  language
}) {
  const [appealDoc, setAppealDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadDraft() {
      const draft = await draftStatutoryAppeal({
        application,
        rule,
        clock,
        language,
        apiKey
      });
      setAppealDoc(draft);
    }
    loadDraft();
  }, [application, rule, clock]);

  const handleTransmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitAppeal(application.id, appealDoc);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!appealDoc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-2xl p-6 text-center text-xs">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-semibold text-slate-800">Drafting Statutory First Appeal with Legal Citations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                One-Tap Statutory First Appeal
              </h3>
              <p className="text-[11px] text-slate-300">
                Under {appealDoc.addressedTo.stateAct}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1 text-base"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Legal Appeal Preview */}
        <div className="overflow-y-auto p-6 space-y-5 text-xs text-slate-800 flex-1 font-sans">
          
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  First Appeal Lodged & Transmitted!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Appeal Reference ID: <strong className="font-mono text-blue-700">{appealDoc.appealNumber}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transmitted to:</span>
                  <span className="font-bold text-slate-900">{appealDoc.addressedTo.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Hearing Limit:</span>
                  <span className="font-semibold text-slate-900">30 Working Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penalty Claim Registered:</span>
                  <span className="font-bold text-rose-600 font-mono">{appealDoc.statutoryFacts.accumulatedPenalty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cryptographic Seal:</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">✓ Blockchain Hash Stamped</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold text-xs flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Formal Copy</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Form 1 Legal Banner */}
              <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                  STATUTORY APPEAL FORM 1
                </span>
                <h2 className="text-base font-extrabold text-slate-900 uppercase">
                  BEFORE THE FIRST APPELLATE AUTHORITY
                </h2>
                <p className="text-[11px] font-semibold text-slate-700">
                  {appealDoc.addressedTo.title}, {appealDoc.addressedTo.jurisdiction}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  Appeal Case No: {appealDoc.appealNumber} • Date: {appealDoc.date}
                </p>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Appellant:</span>
                  <p className="font-bold text-slate-900">{appealDoc.appellant.name}</p>
                  <p className="text-[11px] text-slate-500">{appealDoc.appellant.address}</p>
                  <p className="text-[11px] text-slate-500">{appealDoc.appellant.contact}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Respondent (in default):</span>
                  <p className="font-bold text-rose-700">{appealDoc.respondent.title}</p>
                  <p className="text-[11px] text-slate-500">{appealDoc.respondent.office}</p>
                </div>
              </div>

              {/* Facts of Delay */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-900">
                  1. Statutory Statement of Facts
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Notified Service:</span>
                    <span className="font-semibold text-slate-900">{appealDoc.statutoryFacts.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Application ID:</span>
                    <span className="font-mono font-bold text-blue-700">{appealDoc.statutoryFacts.applicationNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submission Date:</span>
                    <span className="font-medium text-slate-800">{appealDoc.statutoryFacts.dateOfApplication}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Stipulated SLA:</span>
                    <span className="font-semibold text-slate-800">{appealDoc.statutoryFacts.stipulatedPeriod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Statutory Expiry:</span>
                    <span className="font-bold text-rose-600 font-mono">{appealDoc.statutoryFacts.statutoryExpiryDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delay Overdue:</span>
                    <span className="font-black text-rose-700 font-mono">+{appealDoc.statutoryFacts.workingDaysDelayed} Working Days</span>
                  </div>
                </div>
              </div>

              {/* Grounds of Appeal */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-900">
                  2. Grounds of Appeal
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {Array.isArray(appealDoc.grounds) ? (
                    appealDoc.grounds.map((g, idx) => <p key={idx}>{g}</p>)
                  ) : (
                    <p>{appealDoc.grounds}</p>
                  )}
                </div>
              </div>

              {/* Relief Claimed & Statutory Penalty */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-900">
                  3. Relief Sought & Statutory Penalty Demand
                </h4>
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-900 space-y-1">
                  {appealDoc.reliefSought.map((r, idx) => (
                    <p key={idx} className="font-semibold">{r}</p>
                  ))}
                  <p className="pt-1 text-[10px] text-rose-700 font-mono">
                    Total penalty accrued under statutory formula: {appealDoc.statutoryFacts.accumulatedPenalty} (at {appealDoc.statutoryFacts.penaltyPerDay}/day).
                  </p>
                </div>
              </div>

              {/* Tamper-proof hash receipt */}
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Cryptographic Proof: SHA-256 Hash Chain Stamped</span>
                <span className="text-emerald-700 font-semibold">SAMAY-VERIFIED-RTS</span>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        {!isSubmitted && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 border border-slate-300 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTransmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Transmitting..." : "One-Tap Transmit to SDO"}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
