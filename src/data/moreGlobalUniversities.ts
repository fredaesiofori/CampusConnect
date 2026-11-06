import type { OpportunityItem } from "./opportunities";

export const moreGlobalUniversities: OpportunityItem[] = [
  // ================= INDIA (Institutes of National Importance) =================
  {
    id: "iisc-bangalore-india",
    officialName: "Indian Institute of Science",
    institution: "Indian Institute of Science (IISc Bangalore)",
    shortName: "IISc",
    country: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    city: "Bengaluru, Karnataka",
    officialWebsite: "https://iisc.ac.in",
    sourceUrl: "https://admissions.iisc.ac.in",
    officialUrl: "https://admissions.iisc.ac.in",
    category: "university",
    institutionType: "International",
    title: "IISc Bachelor of Science (Research) & Global Graduate Fellowships",
    isVerified: true,
    verificationSource: "Institute of National Importance (INI) & Ministry of Education, India",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#102A43",
      text: "#F49342",
      monogram: "IISc",
      crestColor: "#102A43",
      logoDescription: "IISc Bengaluru Heritage Research Seal"
    },
    eligibilityCountries: ["India", "Ghana", "Nigeria", "Kenya", "United States", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["South Asia", "Asia", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Fully Funded",
      amount: "Government of India ICCR Scholarships & Institute Research Fellowships",
      details: "Indian Council for Cultural Relations (ICCR) provides 100% tuition waiver, monthly living allowance, and return airfare for international scholars.",
      tuitionCoverage: "100% tuition waiver via ICCR",
      livingStipend: "Monthly stipend provided under ICCR scheme"
    },
    funding: {
      type: "Fully Funded",
      amount: "100% Free Tuition + Monthly Stipend (ICCR Scholarships)",
      details: "ICCR scholarships for international students."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "US $100 for international applicants / INR 800 for domestic applicants.",
      amount: "US $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "US $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "International applicants can qualify via SAT Subject Tests / APs / Cambridge A-Levels or JEE Advanced.",
      satPolicy: "SAT/ACT accepted for international applicants."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "SAT / A-Levels / JEE accepted."
    },
    deadlines: {
      term: "2026/2027 Academic Session",
      deadlineText: "Application Deadline: May 15, 2026",
      deadlineDate: "2026-05-15",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "May 15, 2026",
    deadlineDate: "2026-05-15",
    admissionsRequirements: {
      academic: "Physics, Chemistry, and Mathematics in secondary school with min 85%+ or top percentile in JEE/SAT.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Standardized Exam Scores", "Passport"]
    },
    studyFields: ["Quantum Technology", "Materials Science", "Computer Science & AI", "Computational Biology", "Earth Science"],
    intakeTerm: "August 2026",
    verifiedBadge: "Verified Official Data",
    summary: "India's highest-ranked institution for scientific and technological research, consistently ranked #1 in the NIRF rankings.",
    officialRuleSummary: "Institute of National Importance; regulated by Ministry of Education, Government of India."
  },
  {
    id: "iit-bombay-india",
    officialName: "Indian Institute of Technology Bombay",
    institution: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    country: "India",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    city: "Mumbai, Maharashtra",
    officialWebsite: "https://www.iitb.ac.in",
    sourceUrl: "https://www.iitb.ac.in/en/education/admissions",
    officialUrl: "https://www.iitb.ac.in/en/education/admissions",
    category: "university",
    institutionType: "International",
    title: "IIT Bombay Computer Science, Electrical Engineering & International Grants",
    isVerified: true,
    verificationSource: "Institute of National Importance (INI) & Ministry of Education, India",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#E5A823",
      monogram: "IITB",
      crestColor: "#003366",
      logoDescription: "IIT Bombay Gear, Cog & Sanskrit Motto Seal"
    },
    eligibilityCountries: ["India", "Ghana", "Nigeria", "Kenya", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "International students can apply directly through the International Relations Office or via the Study in India (SII) portal.",
      eligibleRegions: ["South Asia", "Asia", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Study in India (SII) Fee Waivers (up to 100% Tuition Waiver)",
      details: "Government of India Study in India program provides up to 100% tuition fee waiver for top international scholars.",
      tuitionCoverage: "Up to 100% tuition waiver via SII"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 100% Tuition Waiver (Study in India)",
      details: "Study in India fee waivers."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "US $100 international registration charge.",
      amount: "US $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "US $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "International applicants apply via JEE Advanced, SAT, or direct academic qualification review.",
      satPolicy: "SAT / JEE accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "SAT / JEE accepted."
    },
    deadlines: {
      term: "2026/2027 Session",
      deadlineText: "Application Deadline: June 15, 2026",
      deadlineDate: "2026-06-15",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "June 15, 2026",
    deadlineDate: "2026-06-15",
    admissionsRequirements: {
      academic: "High school completion with mathematics, physics, and chemistry.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Entrance scores", "Passport"]
    },
    studyFields: ["Computer Science & Engineering", "Electrical Engineering", "Aerospace Engineering", "Mechanical Engineering"],
    intakeTerm: "July 2026",
    verifiedBadge: "Verified Official Data",
    summary: "India's most selective and acclaimed engineering institution, renowned as the top choice for India's rank-one JEE toppers and Silicon Valley founders.",
    officialRuleSummary: "Institute of National Importance; accredited by Ministry of Education, Government of India."
  }
];
