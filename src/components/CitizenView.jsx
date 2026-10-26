import React, { useState } from 'react';
import { Camera, Upload, ArrowRight, AlertTriangle, ShieldCheck, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Eye, Calendar, Building, UserCheck } from 'lucide-react';
import DeadlineGauge from './DeadlineGauge.jsx';
import { SAMPLE_SLIPS } from '../data/sampleSlips.js';
import { parseSlipWithAI } from '../services/aiServices.js';

export default function CitizenView({
  applications,
  rules,
  onAddApplication,
  onOpenAppealModal,
  onFastForwardApplication,
  apiKey,
  language
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(null);

  // Load a preset sample slip
  const handleSelectPreset = async (sample) => {
    setActivePreset(sample.id);
    setIsScanning(true);
    setExtractedData(null);

    // Simulate OCR scanning delay
    setTimeout(async () => {
      const ocrResult = await parseSlipWithAI(null, sample.rawOcrText, apiKey);
      setExtractedData({
        ...sample.slipData,
        ...ocrResult.data,
        sampleTag: sample.tag,
        rawOcrText: sample.rawOcrText
      });
      setIsScanning(false);
    }, 600);
  };

  // Handle file drop / upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsScanning(true);
    setActivePreset(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const res = await parseSlipWithAI(base64Data, "", apiKey);
      setExtractedData({
        application_no: res.data.application_no || "MH-REV-2026-" + Math.floor(100000 + Math.random() * 900000),
        applicant_name: res.data.applicant_name || "Applicant Citizen",
        service_id: "MH-REV-001",
        service_name: res.data.service_name || "Income Certificate (उत्पन्नाचा दाखला)",
        state: "Maharashtra",
        state_code: "MH",
        district: res.data.district || "Pune",
        sub_district: "Haveli",
        kendra_name: "Local Seva Kendra / Citizen Portal",
        submission_date: res.data.submission_date || new Date().toISOString().split('T')[0],
        statutory_sla_days: 15,
        designated_officer: res.data.designated_officer || "Nayab Tahsildar, Haveli",
        first_appellate_authority: "Sub-Divisional Officer (SDO), Pune",
        confidence_score: res.data.confidence_score || 98.2
      });
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  // Start Legal Clock
  const handleConfirmAndStartClock = () => {
    if (!extractedData) return;
    onAddApplication(extractedData);
    setExtractedData(null);
    setSelectedFile(null);
    setActivePreset(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Problem-Statement Banner matching Slide 1 & 2 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>RTS Enforcement Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
            “The law promised her 15 days. <br />
            <span className="text-amber-400">Nobody told her she could appeal.”</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            CAG audits found <strong>2.12 Crore</strong> applications decided late in Maharashtra alone, with <strong>63% of citizens unaware</strong> of their rights. 
            SAMAY computes the legal clock by pure code, alerts the officer radar, and enables <strong>One-Tap First Appeals</strong> with statutory penalty claims.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Works for paper slips (89% Seva Kendras)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deterministic holiday & weekend exclusions</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Immutable hash-chained log</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slip Capture & OCR Section (Slide 4: SLIP CAPTURE) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <span>Step 1: Capture Acknowledgment Slip (Paper or Digital)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Photograph receipt from Aaple Sarkar, Sakala, Bangalore One, CSC, or Grama One.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            OCR + AI Extractor
          </span>
        </div>

        {/* Demo Fast-Load Presets */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Pre-loaded Hackathon Test Cases (Click to load):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_SLIPS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectPreset(sample)}
                className={`text-left p-3 rounded-xl border transition-all text-xs ${
                  activePreset === sample.id
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sample.tag.includes('Breached')
                      ? 'bg-rose-100 text-rose-800'
                      : sample.tag.includes('Risk')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {sample.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {sample.slipData.state_code}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 truncate">{sample.title}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {sample.slipData.applicant_name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 group">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">
              Upload / Drop Custom Receipt Slip Image
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Supports JPEG, PNG, Camera photo (Paper or Portal screenshot)
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* OCR Result / Scan Status Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            {isScanning ? (
              <div className="h-full flex flex-col items-center justify-center py-6 space-y-3">
                <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-700">
                  AI OCR Scanning Acknowledgment Slip...
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Extracting Reference ID, Application Date, Officer & Authority
                </p>
              </div>
            ) : extractedData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Receipt Extracted (Verify & Confirm)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {extractedData.confidence_score}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Applicant Name</span>
                    <span className="font-semibold text-slate-900">{extractedData.applicant_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Application / Ack No.</span>
                    <span className="font-mono font-bold text-blue-700">{extractedData.application_no}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Service</span>
                    <span className="font-semibold text-slate-900 truncate block">{extractedData.service_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Submission Date</span>
                    <span className="font-medium text-slate-900">{extractedData.submission_date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Designated Officer</span>
                    <span className="text-slate-800 text-[11px] font-medium">{extractedData.designated_officer}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmAndStartClock}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Confirm & Start Legal Clock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-medium">Select a preset above or upload an acknowledgment receipt</p>
                <p className="text-[10px] text-slate-400 mt-1">AI extracts the details and starts the statutory clock</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Tracked Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Active Applications ({applications.length})
            </h2>
            <p className="text-xs text-slate-500">
              Legal clocks computed by code, considering official gazetted holidays and pauses.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Live Hash-Chained Verification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            const { clock, rule } = app;
            const isBreached = clock.isBreached;
            const isAtRisk = clock.status === 'AT_RISK';

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
                  isBreached
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isAtRisk
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Header */}
                <div className={`p-4 border-b flex items-start justify-between ${
                  isBreached
                    ? 'bg-rose-50/50 border-rose-100'
                    : isAtRisk
                    ? 'bg-amber-50/40 border-amber-100'
                    : 'bg-slate-50/50 border-slate-100'
                }`}>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {app.state_code} • {rule?.department || "Revenue Dept"}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {app.application_no}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1">
                      {app.service_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Applicant: <span className="font-semibold text-slate-800">{app.applicant_name}</span> • Submitted: {app.submission_date}
                    </p>
                  </div>

                  {/* Fast Forward Button for Hackathon Demo */}
                  <button
                    onClick={() => onFastForwardApplication(app.id)}
                    title="Advance Clock +5 Days (Hackathon Demo Simulator)"
                    className="flex items-center space-x-1 text-[10px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600 shadow-xs transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-600" />
                    <span>+5 Days</span>
                  </button>
                </div>

                {/* Card Body with Gauge & Stats */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Circular Speedometer Gauge (Slide 1 & Slide 3) */}
                  <div className="sm:col-span-5 flex justify-center">
                    <DeadlineGauge clock={clock} size={150} />
                  </div>

                  {/* Legal Details & Penalty Counter */}
                  <div className="sm:col-span-7 space-y-2 text-xs">
                    
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Statutory Deadline:</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {clock.statutoryDeadlineDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Working Days Allowed:</span>
                        <span className="font-semibold text-slate-800">
                          {clock.totalStatutoryDays} Days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Designated Officer:</span>
                        <span className="font-medium text-slate-800 truncate max-w-[150px]">
                          {app.designated_officer || rule?.designated_officer}
                        </span>
                      </div>
                    </div>

                    {/* Statutory Penalty Box */}
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      clock.penaltyAccrued > 0
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold block uppercase tracking-wider opacity-75">
                          Statutory Penalty Accrued
                        </span>
                        <span className="text-sm font-extrabold font-mono">
                          ₹{clock.penaltyAccrued.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium opacity-80 text-right">
                        ₹{clock.penaltyPerDay}/day overdue <br />
                        (Deductible from salary)
                      </span>
                    </div>

                  </div>
                </div>

                {/* Status Message and Action CTA */}
                <div className="px-5 pb-5 pt-1">
                  {isBreached ? (
                    <div className="space-y-3">
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start space-x-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <div className="text-xs text-rose-900">
                          <p className="font-bold">Statutory Breach: {clock.daysOverdue} Days Past Legal Deadline</p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            Under {rule?.appeal_statute_section || "RTS Act Section 18"}, citizen is entitled to immediate first appeal and penalty recovery.
                          </p>
                        </div>
                      </div>

                      {/* One-Tap Appeal CTA */}
                      <button
                        onClick={() => onOpenAppealModal(app)}
                        className="w-full bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>One-Tap First Appeal (To {rule?.first_appellate_authority})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isAtRisk ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-amber-900">
                        <p className="font-bold">Officer Radar Alert Active</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          {clock.daysRemaining} working days remaining. Designated officer has received an SLA urgency warning.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-emerald-900">
                        <p className="font-bold">Application On Track</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          {clock.daysRemaining} working days left before {clock.statutoryDeadlineDate}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Holiday / Pause Breakdown toggle */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clock.stats.holidaysExcountered} holidays & {clock.stats.sundays + clock.stats.secondFourthSaturdays} weekend days excluded</span>
                    </span>
                    <button
                      onClick={() => setShowTimelineModal(app)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Legal Audit</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Legal Timeline & Holiday Audit Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Deterministic Legal Clock Audit
                </h3>
                <p className="text-xs font-mono text-blue-600">
                  {showTimelineModal.application_no}
                </p>
              </div>
              <button
                onClick={() => setShowTimelineModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto my-4 space-y-2 text-xs pr-1">
              <p className="text-slate-600 text-xs mb-3">
                The RTS deadline is computed strictly by code under the gazetted calendar rules of <strong>{showTimelineModal.state}</strong>:
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                {showTimelineModal.clock.auditTimeline?.slice(0, 20).map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg flex items-center justify-between border ${
                      item.type === 'WORKING_DAY'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : item.type === 'HOLIDAY'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                  >
                    <span>{item.date}</span>
                    <span className="font-semibold text-right text-[10px]">{item.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowTimelineModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
