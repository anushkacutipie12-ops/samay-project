import React, { useState } from 'react';
import { Sparkles, Key, CheckCircle2, Shield } from 'lucide-react';

export default function ApiKeyModal({ apiKey, onSaveApiKey, onClose }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              Gemini AI Engine Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 space-y-1">
            <p className="font-bold">Offline-First Resilient Architecture:</p>
            <p className="text-[11px] leading-relaxed">
              SAMAY works <strong>100% offline</strong> with built-in pattern OCR, statutory rule compiler, and pure-code deterministic clock engine. 
              Supplying a Gemini API key is optional and enables real-time LLM-assisted gazette parsing and vision OCR.
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Google Gemini API Key (Optional):
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Stored only locally in your browser session.
            </span>
          </div>

          {saved && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key saved! AI features enabled.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setKeyInput('');
              onSaveApiKey('');
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Clear Key (Use Offline Engine)
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
