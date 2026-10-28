import React, { useState } from 'react';
import { FastForward, RotateCcw, Clock, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export default function TimeWarpDock({
  currentOffset,
  onSetOffset,
  onReset
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute simulated display date
  const simDate = new Date();
  simDate.setDate(simDate.getDate() + currentOffset);
  const formattedSimDate = simDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-slate-950/95 text-white backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Dock Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 bg-gradient-to-r from-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none space-x-3"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
              <FastForward className="w-3.5 h-3.5" />
              <span>Time-Warp Simulator</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30 font-mono">
              Demo Tool
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-300">
              {currentOffset === 0 ? "Today" : `+${currentOffset} Days`}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Dock Body */}
        {isExpanded && (
          <div className="p-4 space-y-3 text-xs w-80">
            <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800/80">
              <span className="text-[11px] text-slate-400">Simulated Legal Date:</span>
              <span className="font-mono font-bold text-amber-400">{formattedSimDate}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Fast-forward all state legal clocks synchronously to demo the SLA lifecycle:
            </p>

            {/* Quick Step Buttons */}
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => onSetOffset(0)}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all ${
                  currentOffset === 0
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title="Reset to Day 0 (Current Date)"
              >
                Day 0
              </button>

              <button
                onClick={() => onSetOffset(3)}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all ${
                  currentOffset === 3
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title="Advance +3 Working Days"
              >
                +3d
              </button>

              <button
                onClick={() => onSetOffset(7)}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all ${
                  currentOffset === 7
                    ? 'bg-amber-500 border-amber-300 text-slate-950 font-black'
                    : 'bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-800'
                }`}
                title="Advance +7 Days (Enters Amber Radar zone)"
              >
                +7d 🟡
              </button>

              <button
                onClick={() => onSetOffset(15)}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-all ${
                  currentOffset === 15
                    ? 'bg-rose-600 border-rose-400 text-white font-black'
                    : 'bg-slate-800/80 border-slate-700 text-rose-300 hover:bg-slate-800'
                }`}
                title="Advance +15 Days (Statutory SLA Breached)"
              >
                +15d 🔴
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Simulates holidays &amp; weekends</span>
              </span>
              <button
                onClick={onReset}
                className="text-slate-400 hover:text-white font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
