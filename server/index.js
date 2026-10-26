import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { INITIAL_RULES, STATES_CONFIG } from '../src/data/rules.js';
import { OFFICIAL_HOLIDAYS, isNonWorkingDay } from '../src/data/holidays.js';
import { computeLegalClock } from '../src/engine/clockEngine.js';
import { AuditLogChain } from '../src/engine/auditLog.js';
import { COMMISSION_METRICS, DISTRICT_PERFORMANCE } from '../src/data/commissionData.js';
import { compileNotifiedListWithAI, parseSlipWithAI, draftStatutoryAppeal } from '../src/services/aiServices.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory runtime database
let rulesRegistry = [...INITIAL_RULES];
const auditChain = new AuditLogChain();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'SAMAY',
    description: 'UPI for Service Promises — Right to Public Services Enforcement Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rules endpoints
app.get('/api/rules', (req, res) => {
  const { state } = req.query;
  if (state) {
    return res.json(rulesRegistry.filter(r => r.state_code === state || r.state.toLowerCase() === state.toLowerCase()));
  }
  res.json(rulesRegistry);
});

// Rights Compiler endpoint
app.post('/api/rules/compile', async (req, res) => {
  try {
    const { rawText, stateCode = 'MH', apiKey } = req.body;
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    const result = await compileNotifiedListWithAI(rawText, stateCode, effectiveKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add verified rule to registry
app.post('/api/rules/commit', async (req, res) => {
  try {
    const newRule = req.body;
    rulesRegistry.unshift(newRule);
    await auditChain.addBlock('RULE_COMMITTED_TO_REGISTRY', newRule.service_id, {
      service: newRule.service_name,
      slaDays: newRule.deadline_days,
      state: newRule.state
    });
    res.json({ success: true, count: rulesRegistry.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Slip OCR / AI Parser endpoint
app.post('/api/slips/ocr', async (req, res) => {
  try {
    const { imageBase64, rawText, apiKey } = req.body;
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    const result = await parseSlipWithAI(imageBase64, rawText, effectiveKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deterministic Legal Clock Calculation (Pure Code, Never an LLM)
app.post('/api/clock/calculate', (req, res) => {
  try {
    const {
      submissionDate,
      deadlineDays,
      deadlineType,
      stateCode,
      pauses,
      penaltyPerDay,
      maxPenalty,
      referenceDate
    } = req.body;

    const clock = computeLegalClock({
      submissionDate,
      deadlineDays,
      deadlineType,
      stateCode,
      pauses,
      penaltyPerDay,
      maxPenalty,
      referenceDate
    });

    res.json({ success: true, clock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statutory Appeal Drafting
app.post('/api/appeals/draft', async (req, res) => {
  try {
    const { application, rule, clock, language, apiKey } = req.body;
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    const draft = await draftStatutoryAppeal({
      application,
      rule,
      clock,
      language,
      apiKey: effectiveKey
    });
    res.json({ success: true, draft });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Commission Map & Telemetry stats
app.get('/api/commission/stats', (req, res) => {
  const { state = 'MH' } = req.query;
  const metrics = state === 'KA' ? COMMISSION_METRICS.karnataka : COMMISSION_METRICS.maharashtra;
  const districts = state === 'KA' ? DISTRICT_PERFORMANCE.KA : DISTRICT_PERFORMANCE.MH;
  res.json({
    state,
    metrics,
    districts,
    statesConfig: STATES_CONFIG
  });
});

// Hash-chained Audit Log
app.get('/api/audit/chain', (req, res) => {
  res.json({
    chain: auditChain.chain,
    blockCount: auditChain.chain.length
  });
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[SAMAY Engine] Server running on http://localhost:${PORT}`);
});
