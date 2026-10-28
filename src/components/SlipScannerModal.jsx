import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, RefreshCw, X, ShieldCheck, Sparkles, AlertCircle, Edit2, ArrowRight } from 'lucide-react';

export default function SlipScannerModal({
  sampleSlip,
  rawOcrText,
  onConfirmSlip,
  onClose
}) {
  const [scanning, setScanning] = useState(true);
  const [activeBox, setActiveBox] = useState(null);
  const [formData, setFormData] = useState({
    application_no: sampleSlip?.application_no || "MH-REV-2026-981244",
    applicant_name: sampleSlip?.applicant_name || "Savita Maruti Shinde",
    service_name: sampleSlip?.service_name || "Income Certificate (उत्पन्नाचा दाखला)",
    service_id: sampleSlip?.service_id || "MH-REV-001",
    state: sampleSlip?.state || "Maharashtra",
    state_code: sampleSlip?.state_code || "MH",
    district: sampleSlip?.district || "Pune",
    sub_district: sampleSlip?.sub_district || "Haveli",
    submission_date: sampleSlip?.submission_date || new Date().toISOString().split('T')[0],
    statutory_sla_days: sampleSlip?.statutory_sla_days || 15,
    designated_officer: sampleSlip?.designated_officer || "Nayab Tahsildar, Haveli Tehsil, Pune",
    first_appellate_authority: sampleSlip?.first_appellate_authority || "Sub-Divisional Officer (SDO), Pune",
    confidence_score: sampleSlip?.confidence_score || 99.2
  });

  useEffect(() => {
    // Simulate optical scan pass
    const timer = setTimeout(() => {
      setScanning(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleConfirm = () => {
    onConfirmSlip(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">
                  AI Optical Slip Capture &amp; OCR Engine
                </h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {scanning ? "SCANNING RECEIPT..." : "99.2% CONFIDENCE"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Extracting statutory acknowledgement parameters from paper receipt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scanner Body: Viewfinder Left + Verified Fields Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
          
          {/* Left: Viewfinder with Bounding Boxes */}
          <div className="md:col-span-7 flex flex-col">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>Paper Slip Viewfinder</span>
              <span className="text-[11px] font-mono text-amber-400">
                {scanning ? "Calibrating OCR bounds..." : "Bounding boxes extracted"}
              </span>
            </div>

            {/* Smartphone Scanner Frame */}
            <div className="relative bg-slate-950 border-2 border-slate-700 rounded-2xl p-4 overflow-hidden flex-1 min-h-[360px] flex items-center justify-center shadow-inner">
              
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20"></div>

              {/* Animated Laser Scanning Line */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce z-30 pointer-events-none" style={{ animationDuration: '1.4s' }}></div>
              )}

              {/* Realistic Paper Receipt Rendering */}
              <div className="w-full bg-[#fcfaf2] text-slate-900 rounded-xl p-5 shadow-2xl border border-amber-200/50 font-serif text-[11px] leading-relaxed relative select-none">
                
                {/* Government Stamp / Emblem */}
                <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                  <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-[9px] mb-1">
                    सत्यमेव
                  </div>
                  <p className="font-bold text-[12px] uppercase tracking-wider text-slate-900 font-sans">
                    {formData.state === 'Karnataka' ? 'GOVERNMENT OF KARNATAKA - SAKALA MISSION' : 'GOVERNMENT OF MAHARASHTRA'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans">
                    {formData.state === 'Karnataka' ? 'Bhoomi / Nadakacheri Citizen Service Kendra' : 'Revenue & Forest Department • Aaple Sarkar Seva Kendra'}
                  </p>
                </div>

                {/* Bounding Box 1: Application No */}
                <div
                  onMouseEnter={() => setActiveBox('app_no')}
                  onMouseLeave={() => setActiveBox(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer relative my-1 ${
                    activeBox === 'app_no'
                      ? 'bg-emerald-200/80 ring-2 ring-emerald-600'
                      : 'bg-emerald-100/50 border border-emerald-400/60'
                  }`}
                >
                  <span className="text-[9px] font-sans font-bold uppercase text-emerald-800 block">
                    Ack / Application ID [AI BOX #1]
                  </span>
                  <span className="font-mono font-black text-slate-900 text-xs">
                    {formData.application_no}
                  </span>
                </div>

                {/* Bounding Box 2: Applicant */}
                <div
                  onMouseEnter={() => setActiveBox('applicant')}
                  onMouseLeave={() => setActiveBox(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer relative my-1 ${
                    activeBox === 'applicant'
                      ? 'bg-blue-200/80 ring-2 ring-blue-600'
                      : 'bg-blue-100/40 border border-blue-400/50'
                  }`}
                >
                  <span className="text-[9px] font-sans font-bold uppercase text-blue-800 block">
                    Citizen Applicant [AI BOX #2]
                  </span>
                  <span className="font-bold text-slate-900">
                    {formData.applicant_name}
                  </span>
                </div>

                {/* Bounding Box 3: Service */}
                <div
                  onMouseEnter={() => setActiveBox('service')}
                  onMouseLeave={() => setActiveBox(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer relative my-1 ${
                    activeBox === 'service'
                      ? 'bg-purple-200/80 ring-2 ring-purple-600'
                      : 'bg-purple-100/40 border border-purple-400/50'
                  }`}
                >
                  <span className="text-[9px] font-sans font-bold uppercase text-purple-800 block">
                    Notified RTS Service &amp; SLA [AI BOX #3]
                  </span>
                  <span className="font-semibold text-slate-900 block">
                    {formData.service_name}
                  </span>
                  <span className="font-sans text-[10px] text-purple-900 font-bold">
                    Statutory SLA: {formData.statutory_sla_days} Working Days
                  </span>
                </div>

                {/* Bounding Box 4: Officer */}
                <div
                  onMouseEnter={() => setActiveBox('officer')}
                  onMouseLeave={() => setActiveBox(null)}
                  className={`p-1.5 rounded transition-all cursor-pointer relative my-1 ${
                    activeBox === 'officer'
                      ? 'bg-amber-200/80 ring-2 ring-amber-600'
                      : 'bg-amber-100/40 border border-amber-400/50'
                  }`}
                >
                  <span className="text-[9px] font-sans font-bold uppercase text-amber-800 block">
                    Designated Public Officer [AI BOX #4]
                  </span>
                  <span className="font-medium text-slate-800 text-[10.5px]">
                    {formData.designated_officer}
                  </span>
                </div>

                {/* Bottom Receipt Footer & Stamp */}
                <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] font-sans text-slate-500">
                  <span>Date: {formData.submission_date}</span>
                  <span className="px-2 py-0.5 border border-slate-400 rounded text-slate-700 font-bold">
                    SEAL &amp; STAMP VERIFIED
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* Right: Verified Data Form */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Extracted Metadata (Human Review)
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Schema Matched</span>
                </span>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Application / Acknowledgment ID
                  </label>
                  <input
                    type="text"
                    value={formData.application_no}
                    onChange={(e) => handleChange('application_no', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono font-bold text-amber-400 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Applicant Citizen Name
                  </label>
                  <input
                    type="text"
                    value={formData.applicant_name}
                    onChange={(e) => handleChange('applicant_name', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-semibold text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Notified Public Service
                  </label>
                  <input
                    type="text"
                    value={formData.service_name}
                    onChange={(e) => handleChange('service_name', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Submission Date
                    </label>
                    <input
                      type="date"
                      value={formData.submission_date}
                      onChange={(e) => handleChange('submission_date', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Statutory SLA
                    </label>
                    <input
                      type="number"
                      value={formData.statutory_sla_days}
                      onChange={(e) => handleChange('statutory_sla_days', parseInt(e.target.value, 10))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Designated Public Officer
                  </label>
                  <input
                    type="text"
                    value={formData.designated_officer}
                    onChange={(e) => handleChange('designated_officer', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-300 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Confirming this receipt will start SAMAY's pure-code deterministic legal clock, excluding gazetted holidays and weekends.
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="w-2/3 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-all"
                >
                  <span>Verify &amp; Start Legal Clock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
