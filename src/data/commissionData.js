// Commission Telemetry & District Performance Data (Maharashtra & Karnataka)
// Benchmarked against CAG Audit Report No. 1 of 2023

export const COMMISSION_METRICS = {
  maharashtra: {
    totalApplications: 28410290,
    lateDisposalsCag: 21245000,
    lateDisposalsRate: 28.14,
    pendingBeyondSla: 3285100,
    awarenessRate: 37, // 63% unaware
    totalPenaltiesImposedINR: 42100000,
    sevaKendraShare: 89.2,
    activeOfficesMonitored: 4120,
    radarAlertsToday: 1482
  },
  karnataka: {
    totalApplications: 18950000,
    lateDisposalsCag: 3676000,
    lateDisposalsRate: 19.40,
    pendingBeyondSla: 1120000,
    awarenessRate: 42,
    totalPenaltiesImposedINR: 18450000,
    sevaKendraShare: 86.4,
    activeOfficesMonitored: 3290,
    radarAlertsToday: 894
  }
};

export const DISTRICT_PERFORMANCE = {
  MH: [
    { id: "MH-PUN", name: "Pune", total: 421000, onTime: 79.4, breached: 86720, avgDays: 17.8, slaDays: 15, penaltyINR: 21680000, status: "amber", topDelayed: "Income Certificate" },
    { id: "MH-MUM", name: "Mumbai Suburban", total: 389000, onTime: 84.2, breached: 61460, avgDays: 16.1, slaDays: 15, penaltyINR: 15365000, status: "amber", topDelayed: "Domicile Certificate" },
    { id: "MH-THA", name: "Thane", total: 312000, onTime: 74.8, breached: 78620, avgDays: 18.9, slaDays: 15, penaltyINR: 19655000, status: "red", topDelayed: "Non-Creamy Layer" },
    { id: "MH-NSK", name: "Nashik", total: 278000, onTime: 71.3, breached: 79780, avgDays: 19.4, slaDays: 15, penaltyINR: 19945000, status: "red", topDelayed: "Income Certificate" },
    { id: "MH-NGP", name: "Nagpur", total: 245000, onTime: 81.0, breached: 46550, avgDays: 16.2, slaDays: 15, penaltyINR: 11637500, status: "amber", topDelayed: "Caste Certificate" },
    { id: "MH-AUR", name: "Chhatrapati Sambhajinagar", total: 198000, onTime: 68.2, breached: 62960, avgDays: 20.4, slaDays: 15, penaltyINR: 15740000, status: "red", topDelayed: "7/12 Extract" },
    { id: "MH-SOL", name: "Solapur", total: 182000, onTime: 88.4, breached: 21110, avgDays: 14.1, slaDays: 15, penaltyINR: 5277500, status: "green", topDelayed: "Income Certificate" },
    { id: "MH-KOL", name: "Kolhapur", total: 174000, onTime: 92.1, breached: 13740, avgDays: 13.2, slaDays: 15, penaltyINR: 3435000, status: "green", topDelayed: "Domicile Certificate" },
    { id: "MH-AMR", name: "Amravati", total: 145000, onTime: 76.5, breached: 34070, avgDays: 17.5, slaDays: 15, penaltyINR: 8517500, status: "amber", topDelayed: "Caste Certificate" },
    { id: "MH-NAN", name: "Nanded", total: 138000, onTime: 65.8, breached: 47200, avgDays: 21.8, slaDays: 15, penaltyINR: 11800000, status: "red", topDelayed: "Income Certificate" },
    { id: "MH-SAT", name: "Satara", total: 129000, onTime: 91.0, breached: 11610, avgDays: 13.5, slaDays: 15, penaltyINR: 2902500, status: "green", topDelayed: "Non-Creamy Layer" },
    { id: "MH-JAL", name: "Jalgaon", total: 152000, onTime: 73.1, breached: 40890, avgDays: 18.6, slaDays: 15, penaltyINR: 10222500, status: "red", topDelayed: "7/12 Extract" }
  ],
  KA: [
    { id: "KA-BLR", name: "Bengaluru Urban", total: 512000, onTime: 86.5, breached: 69120, avgDays: 4.1, slaDays: 3, penaltyINR: 1382400, status: "amber", topDelayed: "RTC / Land Pahani" },
    { id: "KA-MYS", name: "Mysuru", total: 210000, onTime: 92.8, breached: 15120, avgDays: 3.2, slaDays: 3, penaltyINR: 302400, status: "green", topDelayed: "Caste & Income RD" },
    { id: "KA-BLG", name: "Belagavi", total: 245000, onTime: 78.4, breached: 52920, avgDays: 4.8, slaDays: 3, penaltyINR: 1058400, status: "amber", topDelayed: "RTC / Land Pahani" },
    { id: "KA-KLB", name: "Kalaburagi", total: 182000, onTime: 69.1, breached: 56240, avgDays: 5.6, slaDays: 3, penaltyINR: 1124800, status: "red", topDelayed: "Water Connection" },
    { id: "KA-DKN", name: "Dakshina Kannada (Mangaluru)", total: 195000, onTime: 94.6, breached: 10530, avgDays: 2.9, slaDays: 3, penaltyINR: 210600, status: "green", topDelayed: "Driving Licence" },
    { id: "KA-TUM", name: "Tumakuru", total: 168000, onTime: 72.3, breached: 46530, avgDays: 5.1, slaDays: 3, penaltyINR: 930600, status: "red", topDelayed: "Caste & Income RD" },
    { id: "KA-SHI", name: "Shivamogga", total: 142000, onTime: 87.2, breached: 18170, avgDays: 3.6, slaDays: 3, penaltyINR: 363400, status: "green", topDelayed: "RTC / Land Pahani" },
    { id: "KA-HUB", name: "Dharwad (Hubballi)", total: 161000, onTime: 81.5, breached: 29780, avgDays: 4.3, slaDays: 3, penaltyINR: 595600, status: "amber", topDelayed: "Driving Licence" }
  ]
};
