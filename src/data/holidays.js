// Gazetted Government Holidays for Maharashtra, Karnataka, and Central list (2026/2025/2024 calendar)
// Note: Indian state offices also observe all Sundays and 2nd & 4th Saturdays as official public holidays.

export const OFFICIAL_HOLIDAYS = {
  // Format: "YYYY-MM-DD": { title: "...", states: ["MH", "KA", "ALL"] }
  "2026-01-26": { title: "Republic Day", states: ["ALL"] },
  "2026-02-19": { title: "Chhatrapati Shivaji Maharaj Jayanti", states: ["MH"] },
  "2026-02-23": { title: "Mahashivratri", states: ["ALL"] },
  "2026-03-03": { title: "Holi / Dhulivandan", states: ["MH", "ALL"] },
  "2026-03-20": { title: "Gudhi Padwa (MH) / Ugadi (KA)", states: ["MH", "KA"] },
  "2026-03-21": { title: "Ramzan-Id (Id-ul-Fitr)", states: ["ALL"] },
  "2026-04-03": { title: "Good Friday", states: ["ALL"] },
  "2026-04-14": { title: "Dr. Babasaheb Ambedkar Jayanti", states: ["ALL"] },
  "2026-04-20": { title: "Basava Jayanti", states: ["KA"] },
  "2026-05-01": { title: "Maharashtra Day / Labour Day", states: ["MH", "ALL"] },
  "2026-05-28": { title: "Bakrid (Id-ul-Zuha)", states: ["ALL"] },
  "2026-06-26": { title: "Muharram", states: ["ALL"] },
  "2026-08-15": { title: "Independence Day", states: ["ALL"] },
  "2026-09-14": { title: "Ganesh Chaturthi", states: ["MH", "KA"] },
  "2026-09-24": { title: "Eid-e-Milad", states: ["ALL"] },
  "2026-10-02": { title: "Mahatma Gandhi Jayanti", states: ["ALL"] },
  "2026-10-19": { title: "Dussehra (Vijayadashami)", states: ["ALL"] },
  "2026-11-01": { title: "Karnataka Rajyotsava", states: ["KA"] },
  "2026-11-08": { title: "Diwali (Lakshmi Pujan)", states: ["ALL"] },
  "2026-11-10": { title: "Diwali (Balipratipada / Govardhan Puja)", states: ["MH", "ALL"] },
  "2026-11-24": { title: "Guru Nanak Jayanti", states: ["ALL"] },
  "2026-12-25": { title: "Christmas", states: ["ALL"] },

  // Preceding months of 2026/late 2025 for realistic testing of historical dates:
  "2026-01-01": { title: "New Year's Day", states: ["KA"] },
  "2026-01-14": { title: "Makar Sankranti / Pongal", states: ["MH", "KA"] }
};

/**
 * Checks if a given Date is a non-working day under State RTS rules:
 * - Sundays
 * - 2nd and 4th Saturdays
 * - Gazetted holidays for the state
 */
export function isNonWorkingDay(dateObj, stateCode = "MH") {
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

  // 1. All Sundays are non-working days
  if (dayOfWeek === 0) {
    return { isHoliday: true, reason: "Sunday (Non-working day)" };
  }

  // 2. 2nd and 4th Saturdays are non-working days in Indian state secretariats/offices
  if (dayOfWeek === 6) {
    const dayOfMonth = dateObj.getDate();
    // 2nd Saturday is days 8..14; 4th Saturday is days 22..28
    if ((dayOfMonth >= 8 && dayOfMonth <= 14) || (dayOfMonth >= 22 && dayOfMonth <= 28)) {
      return { isHoliday: true, reason: "Second / Fourth Saturday (Official State Off)" };
    }
  }

  // 3. Gazetted holidays
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const dateKey = `${yyyy}-${mm}-${dd}`;

  const holiday = OFFICIAL_HOLIDAYS[dateKey];
  if (holiday) {
    if (holiday.states.includes("ALL") || holiday.states.includes(stateCode)) {
      return { isHoliday: true, reason: `Gazetted Holiday: ${holiday.title}` };
    }
  }

  return { isHoliday: false, reason: null };
}
