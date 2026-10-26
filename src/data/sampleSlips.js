// Realistic sample acknowledgment slips for instant one-click testing in hackathon demos

// Helper to compute a date N working days ago (excluding weekends)
function getDateWorkingDaysAgo(workingDays) {
  const d = new Date();
  let count = 0;
  while (count < workingDays) {
    d.setDate(d.getDate() - 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) { // Skip Sat and Sun for simple relative approximation
      count++;
    }
  }
  return d.toISOString().split('T')[0];
}

export const SAMPLE_SLIPS = [
  {
    id: "sample-1",
    tag: "Late / Breached (Slide 2 Case)",
    title: "MahaOnline Income Certificate (Farmer's Daughter)",
    slipData: {
      application_no: "MH-REV-2026-981244",
      applicant_name: "Savita Maruti Shinde",
      phone: "+91 98231 44021",
      service_id: "MH-REV-001",
      service_name: "Income Certificate (उत्पन्नाचा दाखला)",
      state: "Maharashtra",
      state_code: "MH",
      district: "Pune",
      sub_district: "Haveli",
      kendra_name: "Aaple Sarkar Seva Kendra #4120, Hadapsar, Pune",
      submission_date: getDateWorkingDaysAgo(19), // 19 working days ago (15-day SLA -> Breached by 4 days)
      statutory_sla_days: 15,
      designated_officer: "Nayab Tahsildar, Haveli Tehsil, Pune",
      first_appellate_authority: "Sub-Divisional Officer (SDO), Pune Eastern Division",
      fee_paid: "₹33.60",
      delivery_mode: "Digital Certificate (DigiLocker / SMS)",
      receipt_type: "Physical Paper Slip with Stamp & CSC Barcode",
      confidence_score: 99.2
    },
    rawOcrText: `GOVERNMENT OF MAHARASHTRA
REVENUE & FOREST DEPARTMENT
AAPLE SARKAR SEVA KENDRA ACKNOWLEDGEMENT RECEIPT
------------------------------------------------------------
Application ID: MH-REV-2026-981244
Applicant Name: Savita Maruti Shinde
Father's Name: Maruti Tukaram Shinde
Service Name: Income Certificate (उत्पन्नाचा दाखला)
Tehsil: Haveli    District: Pune
Kendra ID: ASSK-4120 (Hadapsar)
Payment Status: ₹33.60 PAID via UPI (Ref: 298410294)
Statutory Delivery Period under RTS Act 2015: 15 Working Days
Designated Officer: Nayab Tahsildar, Haveli Tehsil, Pune
First Appellate Authority: Sub-Divisional Officer (SDO), Pune
------------------------------------------------------------
* Keep this receipt for tracking under Maharashtra Right to Public Services Act 2015.
Seal & Stamp of Kendra Operator: [VERIFIED SEVA KENDRA STAMP]`
  },
  {
    id: "sample-2",
    tag: "At Risk (Amber Radar)",
    title: "MahaOnline Non-Creamy Layer (Nashik)",
    slipData: {
      application_no: "MH-NCL-2026-551982",
      applicant_name: "Kunal Ramesh Patil",
      phone: "+91 94220 78310",
      service_id: "MH-REV-005",
      service_name: "Non-Creamy Layer Certificate (नॉन-क्रिमी लेयर)",
      state: "Maharashtra",
      state_code: "MH",
      district: "Nashik",
      sub_district: "Nashik City",
      kendra_name: "Maha E-Seva Kendra, MG Road, Nashik",
      submission_date: getDateWorkingDaysAgo(16), // 16 working days ago (21-day SLA -> Amber at risk, 76% elapsed)
      statutory_sla_days: 21,
      designated_officer: "Nayab Tahsildar, Nashik Tehsil",
      first_appellate_authority: "Sub-Divisional Officer (SDO), Nashik Sub-Division",
      fee_paid: "₹57.00",
      delivery_mode: "Printed Certificate",
      receipt_type: "CSC Web Slip",
      confidence_score: 98.4
    },
    rawOcrText: `MAHARASHTRA RIGHT TO SERVICES NOTIFIED PORTAL
ACKNOWLEDGEMENT SLIP
App Ref: MH-NCL-2026-551982
Citizen: Kunal Ramesh Patil
Service: Non-Creamy Layer Certificate (नॉन-क्रिमी लेयर)
Office: Tahsil Office Nashik
SLA Target: 21 Working Days
Designated Authority: Nayab Tahsildar
First Appeal: Sub-Divisional Officer, Nashik`
  },
  {
    id: "sample-3",
    tag: "On Track (Green)",
    title: "Karnataka Sakala Land RTC / Pahani (Bhoomi)",
    slipData: {
      application_no: "KA-SAK-2026-784110",
      applicant_name: "Basavaraj Bommayya Patil",
      phone: "+91 99001 88421",
      service_id: "KA-SAK-001",
      service_name: "RTC / Land Pahani (ಹಕ್ಕು ದಾಖಲೆ - ಪಹಣಿ)",
      state: "Karnataka",
      state_code: "KA",
      district: "Bengaluru Urban",
      sub_district: "Bengaluru South",
      kendra_name: "Bangalore One Centre #12, Jayanagar",
      submission_date: getDateWorkingDaysAgo(1), // 1 working day ago (3-day SLA -> Day 1 of 3, Green)
      statutory_sla_days: 3,
      designated_officer: "Village Accountant / Shirastedar, Kengeri Hobli",
      first_appellate_authority: "Tahsildar, Bengaluru South",
      fee_paid: "₹15.00",
      delivery_mode: "Online Bhoomi Download",
      receipt_type: "Bangalore One Printed Receipt",
      confidence_score: 99.8
    },
    rawOcrText: `GOVERNMENT OF KARNATAKA - SAKALA MISSION
BANGALORE ONE SERVICE ACKNOWLEDGEMENT
----------------------------------------------------
GSC Number: KA-SAK-2026-784110
Citizen Name: Basavaraj Bommayya Patil
Service: RTC / Land Pahani (ಹಕ್ಕು ದಾಖಲೆ - ಪಹಣಿ)
Department: Revenue (Bhoomi)
GSC Promised Date under Sakala Act 2011: 3 Working Days
Designated Officer: Village Accountant, Kengeri Hobli
Appellate Authority: Tahsildar, Bengaluru South
Sakala Call Centre: 080 4455 4455`
  },
  {
    id: "sample-4",
    tag: "Late / Breached (Sakala)",
    title: "Karnataka Sakala Caste & Income (RD Number)",
    slipData: {
      application_no: "RD0038472910892",
      applicant_name: "Deepa Narayanaswamy",
      phone: "+91 88612 30914",
      service_id: "KA-SAK-002",
      service_name: "Caste & Income Certificate (RD Number - ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ)",
      state: "Karnataka",
      state_code: "KA",
      district: "Tumakuru",
      sub_district: "Gubbi",
      kendra_name: "Grama One Kendra, Gubbi Taluk",
      submission_date: getDateWorkingDaysAgo(18), // 18 working days ago (14-day SLA -> Breached by 4 days)
      statutory_sla_days: 14,
      designated_officer: "Deputy Tahsildar, Nadakacheri Gubbi",
      first_appellate_authority: "Tahsildar, Gubbi Taluk",
      fee_paid: "₹25.00",
      delivery_mode: "Nadakacheri Barcoded Certificate",
      receipt_type: "Grama One Slip",
      confidence_score: 97.9
    },
    rawOcrText: `GOVERNMENT OF KARNATAKA - ATALJI JANASNEHI KENDRA
NADAKACHERI ACKNOWLEDGEMENT SLIP
RD Number: RD0038472910892
Applicant: Deepa Narayanaswamy
Service: Caste & Income Certificate (RD Number)
Sakala Promised Time: 14 Working Days
Designated Officer: Deputy Tahsildar Gubbi
Appellate Officer: Tahsildar Gubbi`
  }
];
