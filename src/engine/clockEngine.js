// SAMAY Deterministic Legal Clock Engine (Pure Code, Never an LLM)
// Computes working days, excludes 2nd/4th Saturdays, Sundays, and gazetted state holidays,
// handles legal statutory pauses (e.g. officer queries), and computes breach and penalty liabilities.

import { isNonWorkingDay } from '../data/holidays.js';

export function computeLegalClock({
  submissionDate,
  deadlineDays = 15,
  deadlineType = "working_days",
  stateCode = "MH",
  pauses = [], // Array of { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' | null, reason: string }
  penaltyPerDay = 250,
  maxPenalty = 5000,
  referenceDate = null // Defaults to current date if null
}) {
  const startDate = new Date(submissionDate);
  const asOfDate = referenceDate ? new Date(referenceDate) : new Date();

  // Strip time component for pure calendar date calculations
  startDate.setHours(0, 0, 0, 0);
  asOfDate.setHours(23, 59, 59, 999);

  // Helper to check if a date falls inside any active or past pause
  const isDateInPause = (dateObj) => {
    const timestamp = dateObj.getTime();
    for (const p of pauses) {
      const pStart = new Date(p.start).setHours(0, 0, 0, 0);
      const pEnd = p.end ? new Date(p.end).setHours(23, 59, 59, 999) : Infinity;
      if (timestamp >= pStart && timestamp <= pEnd) {
        return { isPaused: true, reason: p.reason || "Citizen Query / Verification Pause" };
      }
    }
    return { isPaused: false, reason: null };
  };

  // Step 1: Calculate the exact Statutory Deadline Date by stepping forward from submission date
  let curr = new Date(startDate);
  // RTS Day 1 begins on the next calendar day
  curr.setDate(curr.getDate() + 1);

  let workingDaysCounted = 0;
  const auditTimeline = [];
  let deadlineDate = null;

  // Maximum loop safety guard (365 days)
  let loopCount = 0;
  while (workingDaysCounted < deadlineDays && loopCount < 365) {
    loopCount++;
    const checkDate = new Date(curr);
    const dateIso = checkDate.toISOString().split('T')[0];

    const pauseCheck = isDateInPause(checkDate);
    const holidayCheck = isNonWorkingDay(checkDate, stateCode);

    if (pauseCheck.isPaused) {
      auditTimeline.push({
        date: dateIso,
        type: 'PAUSE',
        reason: pauseCheck.reason,
        workingDayIndex: workingDaysCounted
      });
    } else if (holidayCheck.isHoliday) {
      auditTimeline.push({
        date: dateIso,
        type: 'HOLIDAY',
        reason: holidayCheck.reason,
        workingDayIndex: workingDaysCounted
      });
    } else {
      workingDaysCounted++;
      auditTimeline.push({
        date: dateIso,
        type: 'WORKING_DAY',
        reason: `Working Day ${workingDaysCounted} of ${deadlineDays}`,
        workingDayIndex: workingDaysCounted
      });
      if (workingDaysCounted === deadlineDays) {
        deadlineDate = new Date(checkDate);
      }
    }
    curr.setDate(curr.getDate() + 1);
  }

  if (!deadlineDate) {
    deadlineDate = new Date(curr);
  }

  // Step 2: Calculate how many working days have actually elapsed from submission up to asOfDate
  let progressCurr = new Date(startDate);
  progressCurr.setDate(progressCurr.getDate() + 1);

  let workingDaysElapsed = 0;
  let totalHolidaysEncountered = 0;
  let totalPausedDays = 0;
  let totalSundaysEncountered = 0;
  let totalSecondFourthSaturdays = 0;

  while (progressCurr <= asOfDate && progressCurr <= new Date(asOfDate.getTime() + 86400000 * 180)) {
    const checkDate = new Date(progressCurr);
    const pauseCheck = isDateInPause(checkDate);
    const holidayCheck = isNonWorkingDay(checkDate, stateCode);

    if (pauseCheck.isPaused) {
      totalPausedDays++;
    } else if (holidayCheck.isHoliday) {
      totalHolidaysEncountered++;
      if (checkDate.getDay() === 0) totalSundaysEncountered++;
      if (checkDate.getDay() === 6) totalSecondFourthSaturdays++;
    } else {
      workingDaysElapsed++;
    }
    progressCurr.setDate(progressCurr.getDate() + 1);
  }

  // Step 3: Compute Status, Overdue, and Penalty
  const isBreached = workingDaysElapsed > deadlineDays;
  const daysOverdue = isBreached ? workingDaysElapsed - deadlineDays : 0;
  const daysRemaining = isBreached ? 0 : Math.max(0, deadlineDays - workingDaysElapsed);

  let status = "ON_TIME"; // Green
  let statusColor = "green";
  const ratio = workingDaysElapsed / deadlineDays;

  if (isBreached) {
    status = "BREACHED"; // Red
    statusColor = "red";
  } else if (ratio >= 0.70) {
    status = "AT_RISK"; // Amber
    statusColor = "amber";
  }

  // Statutory penalty computation (accumulates strictly per overdue working day)
  const penaltyAccrued = Math.min(maxPenalty, daysOverdue * penaltyPerDay);

  // Check if clock is currently paused right now
  const currentlyPaused = isDateInPause(asOfDate).isPaused;

  return {
    submissionDate: startDate.toISOString().split('T')[0],
    statutoryDeadlineDate: deadlineDate.toISOString().split('T')[0],
    totalStatutoryDays: deadlineDays,
    workingDaysElapsed,
    daysRemaining,
    daysOverdue,
    isBreached,
    status,
    statusColor,
    ratio: Math.min(1.5, Number(ratio.toFixed(2))),
    percentConsumed: Math.min(100, Math.round(ratio * 100)),
    penaltyAccrued,
    penaltyPerDay,
    maxPenalty,
    currentlyPaused,
    stats: {
      holidaysExcountered: totalHolidaysEncountered,
      sundays: totalSundaysEncountered,
      secondFourthSaturdays: totalSecondFourthSaturdays,
      pausedDays: totalPausedDays
    },
    auditTimeline
  };
}
