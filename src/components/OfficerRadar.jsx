import React, { useState } from 'react';
import { Building2, AlertTriangle, AlertCircle, CheckCircle2, Clock, PauseCircle, PlayCircle, ShieldAlert, Filter, Check, Send } from 'lucide-react';

export default function OfficerRadar({
  applications,
  onApproveApplication,
  onTogglePauseApplication,
  selectedState
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, BREACHED, AT_RISK, ON_TIME
  const [pauseModalApp, setPauseModalApp] = useState(null);
  const [pauseReason, setPauseReason] = useState("Aadhaar address mismatch with land revenue record. Citizen requested to submit electricity bill copy.");

  const filteredApps = applications.filter(app => {
    if (filter === 'BREACHED') return app.clock.isBreached;
    if (filter === 'AT_RISK') return app.clock.status === 'AT_RISK';
    if (filter === 'ON_TIME') return app.clock.status === 'ON_TIME';
    return true;
  });

  const breachedCount = applications.filter(a => a.clock.isBreached).length;
  const atRiskCount = applications.filter(a => a.clock.status === 'AT_RISK').length;
  const onTimeCount = applications.filter(a => a.clock.status === 'ON_TIME').length;

  const totalPenaltiesAtRisk = applications.reduce((sum, a) => sum + (a.clock.penaltyAccrued || 0), 0);

  const handleConfirmPause = () => {
    if (!pauseModalApp) return;
    onTogglePauseApplication(pauseModalApp.id, pauseReason);
    setPauseModalApp(null);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Officer Radar Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Live Department Queue
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Designated Officer Radar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurisdiction: <strong>
              {selectedState === 'KA' 
                ? 'Nadakacheri & Taluk Office (Bengaluru South / Mysore) • Karnataka Sakala Act 2011' 
                : selectedState === 'DL'
                ? 'Sub-Divisional Office & Food Civil Supplies (New Delhi) • Delhi e-SLA 2011'
                : 'Tahsil Revenue Office (Haveli / Pune Division) • Maharashtra RTS Act 2015'}
            </strong>
          </p>
        </div>

        {/* Quick Triage Badges */}
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Breached Cases
            </span>
            <span className="text-xl font-extrabold text-rose-700 font-mono">
              {breachedCount}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              At Risk (Amber)
            </span>
            <span className="text-xl font-extrabold text-amber-700 font-mono">
              {atRiskCount}
            </span>
          </div>

          <div className="bg-slate-900 rounded-xl px-4 py-2.5 text-white text-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Salary Penalty Risk
            </span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              ₹{totalPenaltiesAtRisk.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setFilter('BREACHED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            filter === 'BREACHED' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Breached ({breachedCount})</span>
        </button>
        <button
          onClick={() => setFilter('AT_RISK')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            filter === 'AT_RISK' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>At Risk ({atRiskCount})</span>
        </button>
        <button
          onClick={() => setFilter('ON_TIME')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'ON_TIME' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          On Track ({onTimeCount})
        </button>
      </div>

      {/* Officer Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Application Ref & Service</th>
                <th className="px-4 py-3.5">Citizen Name</th>
                <th className="px-4 py-3.5">SLA Timeline</th>
                <th className="px-4 py-3.5">Current Status</th>
                <th className="px-4 py-3.5">Statutory Penalty</th>
                <th className="px-5 py-3.5 text-right">Officer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => {
                const { clock } = app;
                const isBreached = clock.isBreached;
                const isAtRisk = clock.status === 'AT_RISK';
                const isPaused = clock.currentlyPaused;

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isBreached ? 'bg-rose-50/20' : isAtRisk ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Ref & Service */}
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-blue-700 block">
                        {app.application_no}
                      </span>
                      <span className="font-semibold text-slate-900 block mt-0.5">
                        {app.service_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Submitted: {app.submission_date}
                      </span>
                    </td>

                    {/* Citizen Name */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-800 block">
                        {app.applicant_name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {app.district || 'Pune'} • {app.phone || '+91 98XXX XXXXX'}
                      </span>
                    </td>

                    {/* SLA Progress Bar */}
                    <td className="px-4 py-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                          <span>Day {clock.workingDaysElapsed}</span>
                          <span>Max {clock.totalStatutoryDays}D</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isBreached
                                ? 'bg-rose-600 w-full'
                                : isAtRisk
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: isBreached ? '100%' : `${clock.percentConsumed}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Deadline: {clock.statutoryDeadlineDate}
                        </span>
                      </div>
                    </td>

                    {/* Current Status Badge */}
                    <td className="px-4 py-4">
                      {isPaused ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <PauseCircle className="w-3 h-3" />
                          <span>CLOCK PAUSED</span>
                        </span>
                      ) : isBreached ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          <span>BREACHED (+{clock.daysOverdue}D)</span>
                        </span>
                      ) : isAtRisk ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>AT RISK ({clock.daysRemaining}D left)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ON TRACK</span>
                        </span>
                      )}
                    </td>

                    {/* Penalty */}
                    <td className="px-4 py-4">
                      {clock.penaltyAccrued > 0 ? (
                        <div>
                          <span className="font-mono font-bold text-rose-600 text-sm block">
                            ₹{clock.penaltyAccrued}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Statutory Liability
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">₹0</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {isPaused ? (
                        <button
                          onClick={() => onTogglePauseApplication(app.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] inline-flex items-center space-x-1 shadow-sm"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Resume Clock</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setPauseModalApp(app)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] inline-flex items-center space-x-1"
                          title="Raise deficiency notice to stop the legal clock"
                        >
                          <PauseCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>Raise Query (Pause)</span>
                        </button>
                      )}

                      <button
                        onClick={() => onApproveApplication(app.id)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] inline-flex items-center space-x-1 shadow-sm shadow-blue-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Issue Certificate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pause / Query Reason Modal */}
      {pauseModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <PauseCircle className="w-4 h-4 text-blue-600" />
                <span>Statutory Clock Pause (Officer Query)</span>
              </h3>
              <button
                onClick={() => setPauseModalApp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Under RTS provisions, raising a formal document defect query halts the legal clock. Enter the statutory query notice:
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deficiency Notice / Query Reason
                </label>
                <textarea
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ This query will be recorded in the cryptographic audit log and sent to the applicant via SMS/WhatsApp.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setPauseModalApp(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPause}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-md"
              >
                Issue Query & Pause Clock
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
