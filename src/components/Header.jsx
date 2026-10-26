import React from 'react';
import { Clock, ShieldCheck, Sparkles, Key, Globe, Building2, Map, FileCode, User } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  selectedState,
  setSelectedState,
  language,
  setLanguage,
  auditCount,
  onOpenAuditModal,
  onOpenApiKeyModal,
  hasApiKey
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top micro-bar: Indian Tricolor ribbon + CAG Audit alert */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('citizen')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  SAMAY<span className="text-amber-500 font-extrabold">.</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  UPI for Promises
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Every deadline a state promised, enforced by default.
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'citizen'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen & Helper</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'officer'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Officer Radar</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>

            <button
              onClick={() => setActiveTab('commission')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'commission'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Commission Map</span>
            </button>

            <button
              onClick={() => setActiveTab('compiler')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'compiler'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Rights Compiler</span>
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 rounded font-bold">AI</span>
            </button>
          </nav>

          {/* Right Controls: State, Lang, Hash Proof, API Key */}
          <div className="flex items-center space-x-2">
            
            {/* State Switcher */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              <option value="MH">Maharashtra (Aaple Sarkar)</option>
              <option value="KA">Karnataka (Sakala)</option>
              <option value="DL">Delhi (e-SLA)</option>
            </select>

            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden lg:block text-xs font-medium bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="en">English (EN)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>

            {/* Cryptographic Hash Chain Badge */}
            <button
              onClick={onOpenAuditModal}
              title="Verified Hash-Chained Audit Log"
              className="flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] font-bold">{auditCount} Blks</span>
            </button>

            {/* AI Engine / API Key */}
            <button
              onClick={onOpenApiKeyModal}
              title="Gemini AI Settings"
              className={`p-2 rounded-lg border transition-colors ${
                hasApiKey
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
