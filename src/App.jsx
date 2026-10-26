import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import CitizenView from './components/CitizenView.jsx';
import OfficerRadar from './components/OfficerRadar.jsx';
import CommissionMap from './components/CommissionMap.jsx';
import RightsCompiler from './components/RightsCompiler.jsx';
import AppealModal from './components/AppealModal.jsx';
import AuditChainModal from './components/AuditChainModal.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';

import { INITIAL_RULES } from './data/rules.js';
import { SAMPLE_SLIPS } from './data/sampleSlips.js';
import { computeLegalClock } from './engine/clockEngine.js';
import { AuditLogChain } from './engine/auditLog.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'officer' | 'commission' | 'compiler'
  const [selectedState, setSelectedState] = useState('MH');
  const [language, setLanguage] = useState('en');
  
  // API Key (stored in localStorage)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('samay_gemini_key') || '');
  
  // Rules Registry (starts with preloaded ~10 services from MH & KA)
  const [rules, setRules] = useState(INITIAL_RULES);

  // Cryptographic Audit Chain
  const [auditChain] = useState(() => new AuditLogChain());
  const [auditCount, setAuditCount] = useState(1);

  // Active tracked applications
  const [applications, setApplications] = useState(() => {
    // Initialize with 4 realistic preset applications
    return SAMPLE_SLIPS.map((sample) => {
      const rule = INITIAL_RULES.find(r => r.service_id === sample.slipData.service_id) || INITIAL_RULES[0];
      const clock = computeLegalClock({
        submissionDate: sample.slipData.submission_date,
        deadlineDays: sample.slipData.statutory_sla_days,
        deadlineType: rule.deadline_type,
        stateCode: sample.slipData.state_code,
        penaltyPerDay: rule.penalty_per_day,
        maxPenalty: rule.max_penalty
      });

      return {
        id: sample.slipData.application_no,
        ...sample.slipData,
        rule,
        clock,
        pauses: [],
        daysOffset: 0
      };
    });
  });

  // Modals state
  const [appealModalApp, setAppealModalApp] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Re-sync audit chain count on change
  const refreshAuditCount = () => {
    setAuditCount(auditChain.chain.length);
  };

  // Add newly scanned slip
  const handleAddApplication = async (slipData) => {
    const rule = rules.find(r => r.service_id === slipData.service_id || r.service_name === slipData.service_name) || rules[0];
    const clock = computeLegalClock({
      submissionDate: slipData.submission_date,
      deadlineDays: rule.deadline_days,
      deadlineType: rule.deadline_type,
      stateCode: slipData.state_code || selectedState,
      penaltyPerDay: rule.penalty_per_day,
      maxPenalty: rule.max_penalty
    });

    const newApp = {
      id: slipData.application_no,
      ...slipData,
      rule,
      clock,
      pauses: [],
      daysOffset: 0
    };

    setApplications(prev => [newApp, ...prev]);

    // Record in cryptographic audit chain
    await auditChain.addBlock('SLIP_CAPTURED', newApp.id, {
      applicant: newApp.applicant_name,
      service: newApp.service_name,
      submissionDate: newApp.submission_date,
      statutoryDeadlineDate: clock.statutoryDeadlineDate,
      designatedOfficer: newApp.designated_officer
    });
    refreshAuditCount();
  };

  // Officer approves and marks certificate issued
  const handleApproveApplication = async (appId) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    await auditChain.addBlock('SERVICE_DISPOSED_ON_TIME', appId, {
      status: 'APPROVED',
      actionBy: 'Nayab Tahsildar / Designated Officer',
      timestamp: new Date().toISOString()
    });
    refreshAuditCount();
  };

  // Toggle legal pause (officer query / deficiency notice)
  const handleTogglePauseApplication = async (appId, reason = "Deficiency Query") => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const currentlyPaused = app.clock.currentlyPaused;
      let updatedPauses = [...app.pauses];

      if (currentlyPaused) {
        // Resume clock by closing the active pause
        updatedPauses = updatedPauses.map(p => {
          if (!p.end) return { ...p, end: new Date().toISOString().split('T')[0] };
          return p;
        });
      } else {
        // Start a pause
        updatedPauses.push({
          start: new Date().toISOString().split('T')[0],
          end: null,
          reason
        });
      }

      // Recompute clock with updated pauses
      const updatedClock = computeLegalClock({
        submissionDate: app.submission_date,
        deadlineDays: app.statutory_sla_days,
        deadlineType: app.rule?.deadline_type || 'working_days',
        stateCode: app.state_code,
        pauses: updatedPauses,
        penaltyPerDay: app.rule?.penalty_per_day,
        maxPenalty: app.rule?.max_penalty
      });

      return {
        ...app,
        pauses: updatedPauses,
        clock: updatedClock
      };
    }));

    await auditChain.addBlock('CLOCK_PAUSE_TOGGLED', appId, {
      reason,
      timestamp: new Date().toISOString()
    });
    refreshAuditCount();
  };

  // Fast forward simulator (+5 days) for hackathon live demo
  const handleFastForwardApplication = async (appId) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const newOffset = (app.daysOffset || 0) + 5;
      const refDate = new Date();
      refDate.setDate(refDate.getDate() + newOffset);

      const updatedClock = computeLegalClock({
        submissionDate: app.submission_date,
        deadlineDays: app.statutory_sla_days,
        deadlineType: app.rule?.deadline_type || 'working_days',
        stateCode: app.state_code,
        pauses: app.pauses,
        referenceDate: refDate,
        penaltyPerDay: app.rule?.penalty_per_day,
        maxPenalty: app.rule?.max_penalty
      });

      return {
        ...app,
        daysOffset: newOffset,
        clock: updatedClock
      };
    }));

    await auditChain.addBlock('TIME_WARP_SIMULATION', appId, {
      offsetDays: 5,
      timestamp: new Date().toISOString()
    });
    refreshAuditCount();
  };

  // Submit First Appeal
  const handleSubmitAppeal = async (appId, appealDoc) => {
    await auditChain.addBlock('APPEAL_FILED_TO_FAA', appId, {
      appealNumber: appealDoc.appealNumber,
      firstAppellateAuthority: appealDoc.addressedTo.title,
      statutoryPenaltyClaimed: appealDoc.statutoryFacts.accumulatedPenalty,
      appellant: appealDoc.appellant.name
    });
    refreshAuditCount();
  };

  // Add newly compiled rule to registry
  const handleAddRule = async (newRule) => {
    setRules(prev => [newRule, ...prev]);
    await auditChain.addBlock('RULE_ADDED_TO_REGISTRY', newRule.service_id, {
      service: newRule.service_name,
      slaDays: newRule.deadline_days,
      state: newRule.state,
      verifiedBy: newRule.verified_by,
      hash: newRule.hash
    });
    refreshAuditCount();
  };

  // Save API Key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('samay_gemini_key', key);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        language={language}
        setLanguage={setLanguage}
        auditCount={auditCount}
        onOpenAuditModal={() => setShowAuditModal(true)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'citizen' && (
          <CitizenView
            applications={applications}
            rules={rules}
            onAddApplication={handleAddApplication}
            onOpenAppealModal={(app) => setAppealModalApp(app)}
            onFastForwardApplication={handleFastForwardApplication}
            apiKey={apiKey}
            language={language}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerRadar
            applications={applications}
            onApproveApplication={handleApproveApplication}
            onTogglePauseApplication={handleTogglePauseApplication}
            selectedState={selectedState}
          />
        )}

        {activeTab === 'commission' && (
          <CommissionMap
            selectedState={selectedState}
          />
        )}

        {activeTab === 'compiler' && (
          <RightsCompiler
            onAddRule={handleAddRule}
            existingRules={rules}
            apiKey={apiKey}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800">SAMAY</span>
            <span>•</span>
            <span>Build for Bharat 2026 | Track 1 Software | PS 3 Open Innovation</span>
          </div>
          <p className="text-[11px] text-slate-400">
            UPI for Service Promises • Maharashtra RTS Act 2015 &amp; Karnataka Sakala Act 2011 standard layer.
          </p>
        </div>
      </footer>

      {/* First Appeal Modal */}
      {appealModalApp && (
        <AppealModal
          application={appealModalApp}
          rule={appealModalApp.rule}
          clock={appealModalApp.clock}
          onClose={() => setAppealModalApp(null)}
          onSubmitAppeal={handleSubmitAppeal}
          apiKey={apiKey}
          language={language}
        />
      )}

      {/* Hash-Chained Audit Log Modal */}
      {showAuditModal && (
        <AuditChainModal
          auditChain={auditChain}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}

    </div>
  );
}
