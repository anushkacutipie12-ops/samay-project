import React from 'react';

/**
 * Circular Deadline Speedometer Gauge matching Slide 1 & Slide 3:
 * - Day 0-10: On Time (Green: #10B981)
 * - Day 10-15: At Risk (Amber: #F59E0B)
 * - Day 15+: Breached (Red: #EF4444)
 */
export default function DeadlineGauge({ clock, size = 180 }) {
  const { totalStatutoryDays, workingDaysElapsed, isBreached, daysRemaining, daysOverdue, statusColor } = clock;

  // Gauge geometry
  const radius = 64;
  const strokeWidth = 12;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  // Fraction of deadline consumed
  const fraction = Math.min(1.0, workingDaysElapsed / totalStatutoryDays);
  const strokeDashoffset = circumference - (fraction * circumference);

  // Status-based color styling
  let arcColor = "#10B981"; // green
  let glowColor = "rgba(16, 185, 129, 0.2)";
  let badgeText = "ON TIME";
  let badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (isBreached) {
    arcColor = "#EF4444"; // red
    glowColor = "rgba(239, 68, 68, 0.25)";
    badgeText = `BREACHED (+${daysOverdue}D)`;
    badgeBg = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
  } else if (fraction >= 0.7) {
    arcColor = "#F59E0B"; // amber
    glowColor = "rgba(245, 158, 11, 0.2)";
    badgeText = "AT RISK";
    badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          {/* Base Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Color Segments Indicator Reference Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={arcColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${glowColor})`
            }}
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Working Day
          </span>
          <div className="flex items-baseline justify-center">
            <span className={`text-3xl font-extrabold tracking-tight ${isBreached ? 'text-rose-600' : 'text-slate-900'}`}>
              {workingDaysElapsed}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1">
              /{totalStatutoryDays}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {isBreached ? (
              <span className="text-rose-600 font-semibold">{daysOverdue} days late</span>
            ) : (
              <span>{daysRemaining} days left</span>
            )}
          </span>
        </div>
      </div>

      {/* Status Pill */}
      <span className={`mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
        {badgeText}
      </span>
    </div>
  );
}
