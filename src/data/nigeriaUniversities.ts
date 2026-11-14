import type { OpportunityItem } from "./opportunities";

export const nigeriaUniversities: OpportunityItem[] = [
  {
    id: "unilag-nigeria",
    officialName: "University of Lagos",
    institution: "University of Lagos",
    shortName: "UNILAG",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Akoka, Lagos",
    officialWebsite: "https://unilag.edu.ng",
    sourceUrl: 'https://unilag.edu.ng/category/admissions/',
    officialUrl: 'https://unilag.edu.ng/category/admissions/',
    category: "university",
    institutionType: 'Public University',
    title: "University of Lagos Undergraduate Admissions & Scholarships",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#800020",
      text: "#FFFFFF",
      monogram: "UNILAG",
      crestColor: "#800020",
      logoDescription: "University of Lagos Official Seal & Gold Sunburst",
      logoUrl: '/logos/unilag-nigeria.jpg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:UniLagos.jpg'
    },
    eligibilityCountries: [
      "Nigeria",
      "Ghana",
      "Kenya",
      "South Africa",
      "All 54 African Countries",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian UTME/Direct Entry candidates as well as international applicants holding qualifying secondary school certificates (WAEC, NECO, GCE, Cambridge A-Levels).",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Tuition Subsidy & NELFUND Student Loans",
      details: "Federal tertiary education in Nigeria is highly subsidized. Federal students are eligible for interest-free tuition and upkeep loans via the Nigerian Education Loan Fund (NELFUND). International scholarships available through bilateral agreements.",
      tuitionCoverage: "Subsidized federal tuition",
      livingStipend: "NELFUND living upkeep allowances eligible for Nigerian students; low-cost campus housing"
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Government Tuition Subsidy & NELFUND Student Loans",
      details: "Tuition is subsidized by the Federal Government; eligible Nigerian students access NELFUND interest-free loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "Post-UTME screening fee is capped at ₦2,000 (~$1.50) per NUC regulatory guidelines.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Post-UTME screening fee capped at ₦2,000."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Five credit passes including English Language and Mathematics in WAEC, WASSCE, or NECO satisfy language and basic entry qualifications.",
      satPolicy: "SAT/ACT accepted in lieu of UTME for international foreign applicants.",
      englishProficiencyPolicy: "Credit in WAEC/NECO English exempts candidates from TOEFL/IELTS."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "Five credit passes in WAEC/NECO including English satisfy requirements."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Post-UTME & International Registration: August 31, 2026",
      deadlineDate: "2026-08-31",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 31, 2026",
    deadlineDate: "2026-08-31",
    admissionsRequirements: {
      academic: "Minimum of 5 credit passes at SSCE/WAEC/NECO in relevant subjects including English Language and Mathematics at not more than two sittings; minimum JAMB score of 200.",
      language: "WAEC/NECO/GCE Credit in English Language.",
      documents: [
        "JAMB Result Slip",
        "WAEC/NECO/NABTEB O-Level Statement of Results",
        "Birth Certificate or Statutory Declaration of Age",
        "Post-UTME Online Registration Form"
      ],
      standardizedTests: "JAMB UTME (Nigerian candidates) or international qualifications (A-Levels/SAT)."
    },
    studyFields: [
      "Medicine & Surgery",
      "Law",
      "Computer Engineering",
      "Finance & Accounting",
      "Architecture",
      "Chemical Engineering"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's premier first-generation federal universities, renowned for excellence in engineering, law, business, and medical sciences.",
    officialRuleSummary: "Regulated and accredited by the National Universities Commission (NUC)."
  },
  {
    id: "oau-nigeria",
    officialName: "Obafemi Awolowo University",
    institution: "Obafemi Awolowo University",
    shortName: "OAU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ile-Ife, Osun",
    officialWebsite: "https://oauife.edu.ng",
    sourceUrl: "https://admissions.oauife.edu.ng",
    officialUrl: "https://admissions.oauife.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Obafemi Awolowo University Undergraduate & Postgraduate Admissions",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002B49",
      text: "#FDB913",
      monogram: "OAU",
      crestColor: "#002B49",
      logoDescription: "OAU Seal with Great Ife Book and Torch",
      logoUrl: '/logos/oau-nigeria.png',
      logoSourceUrl: 'https://oauife.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian students through JAMB and international students via direct application.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Tuition Subsidy & NELFUND Loans",
      details: "Federal tertiary tuition subsidy and NELFUND support for all eligible students.",
      tuitionCoverage: "Subsidized federal tuition"
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Tuition Subsidy & NELFUND Loans",
      details: "Federal tertiary tuition subsidy and NELFUND support."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "Standard screening fee of ₦2,000 for UTME candidates.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 screening fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/NECO/GCE O-Level credit in English satisfies the English requirement.",
      satPolicy: "SAT scores evaluated for international candidates."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English satisfies requirement."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Screening Deadline: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-Level credit passes in WAEC/NECO at maximum two sittings; JAMB UTME score 200+.",
      language: "Credit in English Language in WAEC/NECO.",
      documents: ["JAMB Slip", "O-Level Certificate", "Birth Certificate"]
    },
    studyFields: ["Pharmacy", "Medicine", "Civil Engineering", "Computer Science", "Law", "International Relations"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Known as 'Great Ife', famous for its sprawling architectural campus and outstanding contributions to law, medicine, and pharmacy in West Africa.",
    officialRuleSummary: "Accredited by the NUC."
  },
  {
    id: "abu-zaria-nigeria",
    officialName: "Ahmadu Bello University",
    institution: "Ahmadu Bello University",
    shortName: "ABU Zaria",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Zaria, Kaduna",
    officialWebsite: "https://abu.edu.ng",
    sourceUrl: 'https://abu.edu.ng/admission-guidelines/',
    officialUrl: 'https://abu.edu.ng/admission-guidelines/',
    category: "university",
    institutionType: 'Public University',
    title: "Ahmadu Bello University Degree Programs & Research",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFFFFF",
      monogram: "ABU",
      crestColor: "#006400",
      logoDescription: "ABU Zaria Green and White Official Emblem",
      "logoUrl": "/logos/abu-zaria-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to candidates from Nigeria and across Africa.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Subsidized Federal Tuition & NELFUND",
      details: "Federal funding provides affordable education; NELFUND access for undergraduate students.",
      tuitionCoverage: "Subsidized tuition"
    },
    funding: {
      type: "Government Aid",
      amount: "Subsidized Federal Tuition & NELFUND",
      details: "Federal tuition subsidy applies."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 statutory Post-UTME registration fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 statutory registration fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Credit in WAEC/NECO/NABTEB English Language meets proficiency criteria."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 30, 2026",
      deadlineDate: "2026-09-30",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 30, 2026",
    deadlineDate: "2026-09-30",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects including English and Math; JAMB score 180+.",
      language: "Credit in O-level English.",
      documents: ["O-Level result", "JAMB slip", "Local government identification"]
    },
    studyFields: ["Agriculture", "Veterinary Medicine", "Engineering", "Law", "Medicine", "Social Sciences"],
    intakeTerm: "October 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The largest university in Sub-Saharan Africa by land area and student enrollment, leading agricultural and engineering research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "unn-nigeria",
    officialName: "University of Nigeria, Nsukka",
    institution: "University of Nigeria, Nsukka",
    shortName: "UNN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Nsukka, Enugu",
    officialWebsite: "https://unn.edu.ng",
    sourceUrl: "https://portal.unn.edu.ng",
    officialUrl: "https://portal.unn.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "University of Nigeria Undergraduate & Postgraduate Admissions",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004225",
      text: "#FFD700",
      monogram: "UNN",
      crestColor: "#004225",
      logoDescription: "UNN Black Lion and Green Shield Crest",
      logoUrl: '/logos/unn-nigeria.png',
      logoSourceUrl: 'https://www.unn.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Welcomes Nigerian and international candidates.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND Loans",
      details: "Federal university subsidy ensures low tuition fees."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND Loans",
      details: "Federal tuition subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Credit in WAEC/NECO English satisfies language requirement."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 25, 2026",
      deadlineDate: "2026-08-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 25, 2026",
    deadlineDate: "2026-08-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Mathematics; minimum JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level certificate", "JAMB notification of result", "State of origin certificate"]
    },
    studyFields: ["Medicine", "Law", "Nursing", "Engineering", "Arts", "Pure Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Nigeria's first indigenous and first autonomous federal university, founded by Dr. Nnamdi Azikiwe in 1955.",
    officialRuleSummary: "Accredited by the NUC."
  },
  {
    id: "uniben-nigeria",
    officialName: "University of Benin",
    institution: "University of Benin",
    shortName: "UNIBEN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Benin City, Edo",
    officialWebsite: "https://uniben.edu",
    sourceUrl: "https://waeup.uniben.edu",
    officialUrl: "https://waeup.uniben.edu",
    category: "university",
    institutionType: 'Public University',
    title: "University of Benin Admissions & Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#4A0E4E",
      text: "#FFFFFF",
      monogram: "UNIBEN",
      crestColor: "#4A0E4E",
      logoDescription: "UNIBEN Official Shield & Crest"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to all qualified applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Subsidy & Student Loan Scheme",
      details: "Federal tertiary subsidy; NELFUND access."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & Student Loan Scheme",
      details: "Subsidized federal tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening charge.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening charge."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit satisfies proficiency."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Registration Deadline: August 20, 2026",
      deadlineDate: "2026-08-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 20, 2026",
    deadlineDate: "2026-08-20",
    admissionsRequirements: {
      academic: "5 O-level credits at not more than 2 sittings; JAMB score 200+.",
      language: "Credit in English Language.",
      documents: ["O-level result", "JAMB registration slip"]
    },
    studyFields: ["Pharmacy", "Medicine", "Engineering", "Law", "Management Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned first-generation federal university in southern Nigeria with celebrated faculties of medicine, pharmacy, and engineering.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "unilorin-nigeria",
    officialName: "University of Ilorin",
    institution: "University of Ilorin",
    shortName: "UNILORIN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ilorin, Kwara",
    officialWebsite: "https://unilorin.edu.ng",
    sourceUrl: 'https://www.unilorin.edu.ng/admissions/',
    officialUrl: 'https://www.unilorin.edu.ng/admissions/',
    category: "university",
    institutionType: 'Public University',
    title: "University of Ilorin Degree Programs & Continuous Academic Calendar",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#FFFFFF",
      monogram: "UNILORIN",
      crestColor: "#003366",
      logoDescription: "UNILORIN Blue and Gold Seal",
      logoUrl: '/logos/unilorin-nigeria.png',
      logoSourceUrl: 'https://www.unilorin.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian and international applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tuition subsidy applies to all undergraduate faculties."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tuition subsidy applies."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME registration fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 10, 2026",
      deadlineDate: "2026-09-10",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 10, 2026",
    deadlineDate: "2026-09-10",
    admissionsRequirements: {
      academic: "5 O-level credit passes including English and Math; JAMB score 180+.",
      language: "Credit in English Language in WAEC/NECO.",
      documents: ["JAMB result", "O-Level slip", "Birth certificate"]
    },
    studyFields: ["Medicine", "Law", "Veterinary Medicine", "Computer Science", "Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Known as the 'Better by Far' university, famously admired for having Nigeria's most consistent and uninterrupted academic calendar.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "futa-nigeria",
    officialName: "Federal University of Technology, Akure",
    institution: "Federal University of Technology, Akure",
    shortName: "FUTA",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Akure, Ondo",
    officialWebsite: "https://futa.edu.ng",
    sourceUrl: "https://www.futa.edu.ng/admissions",
    officialUrl: "https://www.futa.edu.ng/admissions",
    category: "university",
    institutionType: 'Technical University',
    title: "FUTA Engineering, Computing & Technological Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFFFFF",
      monogram: "FUTA",
      crestColor: "#006400",
      logoDescription: "FUTA Shield with Gear & Technology Emblems"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to science and technology candidates.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND Loans",
      details: "Heavily subsidized federal engineering and STEM education."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND Loans",
      details: "Subsidized STEM education."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/NECO/NABTEB credit in English and STEM subjects."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Screening Deadline: August 30, 2026",
      deadlineDate: "2026-08-30",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 30, 2026",
    deadlineDate: "2026-08-30",
    admissionsRequirements: {
      academic: "5 O-level credit passes in Physics, Chemistry, Mathematics, English Language and one other science subject; JAMB score 180+.",
      language: "Credit in English Language in WAEC/NECO.",
      documents: ["JAMB slip", "O-Level results", "Birth certificate"]
    },
    studyFields: ["Software Engineering", "Mechanical Engineering", "Electrical Engineering", "Cybersecurity", "Meteorology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Nigeria's foremost specialized technical university, renowned for pioneering research in engineering, space science, and computing.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "covenant-university-nigeria",
    officialName: "Covenant University",
    institution: "Covenant University",
    shortName: "Covenant",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ota, Ogun",
    officialWebsite: "https://covenantuniversity.edu.ng",
    sourceUrl: "https://admissions.covenantuniversity.edu.ng",
    officialUrl: "https://admissions.covenantuniversity.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Covenant University Undergraduate Degree Programs & Global Accreditations",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#3B0A45",
      text: "#FFD700",
      monogram: "CU",
      crestColor: "#3B0A45",
      logoDescription: "Covenant University Royal Purple & Gold Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Welcomes applicants from Nigeria, Ghana, across Africa, and globally.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Merit Scholarships & Chancellor's Excellence Awards",
      details: "Merit-based scholarships available for outstanding academic achievers and international scholars.",
      tuitionCoverage: "Merit-based partial tuition waivers"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Merit Scholarships & Chancellor's Excellence Awards",
      details: "Merit scholarships awarded to top entrants."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "Application processing and screening fee of ₦10,000.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Credit in WAEC/NECO English satisfies language requirement; SAT/ACT accepted for international applicants.",
      satPolicy: "SAT optional for international candidates."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: July 31, 2026",
      deadlineDate: "2026-07-31",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "July 31, 2026",
    deadlineDate: "2026-07-31",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects in WAEC/NECO/NABTEB at one sitting; JAMB score minimum 200.",
      language: "Credit in WAEC/NECO English Language.",
      documents: ["O-Level result", "JAMB slip", "Sponsor letter", "Letter of reference"]
    },
    studyFields: ["Computer Engineering", "Electrical Engineering", "Economics", "Mass Communication", "Accounting", "Architecture"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Consistently ranked as Nigeria's top private university and among the leading universities in Sub-Saharan Africa in Times Higher Education rankings.",
    officialRuleSummary: "Chartered and accredited by the NUC."
  },
  {
    id: "futo-nigeria",
    officialName: "Federal University of Technology, Owerri",
    institution: "Federal University of Technology, Owerri",
    shortName: "FUTO",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Owerri, Imo",
    officialWebsite: "https://futo.edu.ng",
    sourceUrl: "https://portal.futo.edu.ng",
    officialUrl: "https://portal.futo.edu.ng",
    category: "university",
    institutionType: 'Technical University',
    title: "FUTO Engineering, Petroleum & Technology Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004D40",
      text: "#FFFFFF",
      monogram: "FUTO",
      crestColor: "#004D40",
      logoDescription: "FUTO Official Technology Crest",
      logoUrl: '/logos/futo-nigeria.png',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:FUTO_logo.png'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian and international applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary education subsidy."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loan access."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Credit in WAEC/NECO English satisfies requirement."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits in Physics, Chemistry, Math, English and one other; JAMB score 180+.",
      language: "Credit in English Language in WAEC/NECO.",
      documents: ["O-Level result", "JAMB slip", "Birth certificate"]
    },
    studyFields: ["Petroleum Engineering", "Chemical Engineering", "Information Technology", "Biomedical Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The premier federal university of technology in south-eastern Nigeria, renowned for oil and gas engineering programs.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "funaab-nigeria",
    officialName: "Federal University of Agriculture, Abeokuta",
    institution: "Federal University of Agriculture, Abeokuta",
    shortName: "FUNAAB",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Abeokuta, Ogun",
    officialWebsite: "https://funaab.edu.ng",
    sourceUrl: "https://admission.funaab.edu.ng",
    officialUrl: "https://admission.funaab.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "FUNAAB Agricultural Sciences, Engineering & Environmental Management",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#1B5E20",
      text: "#FFFFFF",
      monogram: "FUNAAB",
      crestColor: "#1B5E20",
      logoDescription: "FUNAAB Green Agronomy Crest",
      logoUrl: '/logos/funaab-nigeria.jpg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:FUNAAB_Logo.jpg'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to candidates worldwide.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal agricultural research subsidy."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Subsidized federal agriculture and engineering education."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Credit in WAEC/NECO English satisfies requirement."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 31, 2026",
      deadlineDate: "2026-08-31",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 31, 2026",
    deadlineDate: "2026-08-31",
    admissionsRequirements: {
      academic: "5 O-level credits in sciences including English and Math; JAMB score 180+.",
      language: "Credit in English Language in WAEC/NECO.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Veterinary Medicine", "Agricultural Economics", "Food Science", "Civil Engineering", "Biochemistry"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's premier specialized agricultural universities, recognized globally for food security and biotechnology research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "lasu-nigeria",
    officialName: "Lagos State University",
    institution: "Lagos State University",
    shortName: "LASU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ojo, Lagos",
    officialWebsite: "https://lasu.edu.ng",
    sourceUrl: 'https://lasu.edu.ng/home/',
    officialUrl: 'https://lasu.edu.ng/home/',
    category: "university",
    institutionType: 'Public University',
    title: "Lagos State University Degree Programs & Digital Campus",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002060",
      text: "#FFFFFF",
      monogram: "LASU",
      crestColor: "#002060",
      logoDescription: "LASU Blue and White Shield",
      "logoUrl": "/logos/lasu-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Lagos indigenes, non-indigenes, and international applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Lagos State Government Subsidies & Bursaries",
      details: "State subsidized tuition with bursaries for state indigenes; open to all nationalities."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies & Bursaries",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 195+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip", "Local government identification"]
    },
    studyFields: ["Law", "Medicine", "Communications", "Computer Science", "Management"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Lagos State's flagship university, ranked among Nigeria's top state-owned universities with distinguished faculties of law and medicine.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "pan-atlantic-university-nigeria",
    officialName: "Pan-Atlantic University",
    institution: "Pan-Atlantic University",
    shortName: "PAU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ibeju-Lekki, Lagos",
    officialWebsite: "https://pau.edu.ng",
    sourceUrl: 'https://pau.edu.ng/admission-aid/',
    officialUrl: 'https://pau.edu.ng/admission-aid/',
    category: "university",
    institutionType: 'Private University',
    title: "Pan-Atlantic University Business, Media & Technology Degrees",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#183059",
      text: "#D4AF37",
      monogram: "PAU",
      crestColor: "#183059",
      logoDescription: "Pan-Atlantic University Blue & Gold Coat of Arms",
      logoUrl: '/logos/pan-atlantic-university-nigeria.png',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Logo_of_Pan-Atlantic_University.png'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and Nigerian applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Full & Partial Tuition Scholarships",
      details: "Merit and need-based scholarships covering up to 100% of tuition for qualifying scholars.",
      tuitionCoverage: "Up to 100% tuition for scholarship recipients"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Full & Partial Tuition Scholarships",
      details: "Need and merit scholarships available."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO/IGCSE credit in English; SAT accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: July 31, 2026",
      deadlineDate: "2026-07-31",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "July 31, 2026",
    deadlineDate: "2026-07-31",
    admissionsRequirements: {
      academic: "5 O-level credits at one sitting; JAMB score 220+ or international equivalent.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip", "Recommendation letter"]
    },
    studyFields: ["Business Administration", "Media & Communication", "Computer Science", "Information Technology", "Economics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Home to the renowned Lagos Business School (LBS), PAU is renowned for ethics, executive leadership, and media studies in Africa.",
    officialRuleSummary: "Chartered and accredited by NUC."
  },
  {
    id: "abuad-nigeria",
    officialName: "Afe Babalola University",
    institution: "Afe Babalola University",
    shortName: "ABUAD",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ado-Ekiti, Ekiti",
    officialWebsite: "https://abuad.edu.ng",
    sourceUrl: "https://admissions.abuad.edu.ng",
    officialUrl: "https://admissions.abuad.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "ABUAD Law, Medicine, Engineering & Sciences Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7B1113",
      text: "#FFFFFF",
      monogram: "ABUAD",
      crestColor: "#7B1113",
      logoDescription: "ABUAD Maroon & Gold Seal",
      logoUrl: '/logos/abuad-nigeria.png',
      logoSourceUrl: 'https://www.abuad.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian and international students.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Founder's Merit Scholarships & Fee Concessions",
      details: "Merit scholarships awarded to top performing students each academic session."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Founder's Merit Scholarships",
      details: "Merit scholarships available."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,500 application voucher.",
      amount: "₦10,500"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,500 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted; SAT scores accepted for international applicants."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 15, 2026",
      deadlineDate: "2026-08-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 15, 2026",
    deadlineDate: "2026-08-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Medicine & Surgery", "Mechanical Engineering", "Biomedical Engineering", "Nursing"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Recognized by UNESCO as a model university in Africa, featuring state-of-the-art teaching hospital and law faculty.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "babcock-university-nigeria",
    officialName: "Babcock University",
    institution: "Babcock University",
    shortName: "Babcock",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ilishan-Remo, Ogun",
    officialWebsite: "https://babcock.edu.ng",
    sourceUrl: "https://admissions.babcock.edu.ng",
    officialUrl: "https://admissions.babcock.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Babcock University Medical, Computer Science & Business Degrees",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0B2F64",
      text: "#E5A823",
      monogram: "BU",
      crestColor: "#0B2F64",
      logoDescription: "Babcock University Blue and Gold Crest",
      "logoUrl": "/logos/babcock-university-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Needy Student Fund & Academic Work-Study",
      details: "Work-study financial aid and academic merit awards."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Needy Student Fund & Work-Study",
      details: "Financial aid and work-study."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO/Cambridge O-Levels accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 20, 2026",
      deadlineDate: "2026-08-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 20, 2026",
    deadlineDate: "2026-08-20",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; minimum JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip", "Reference letter"]
    },
    studyFields: ["Medicine & Surgery", "Software Engineering", "Accounting", "Public Health", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's pioneer private universities, known for pioneering heart surgeries and excellent healthcare training.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "nile-university-nigeria",
    officialName: "Nile University of Nigeria",
    institution: "Nile University of Nigeria",
    shortName: "Nile",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Abuja, FCT",
    officialWebsite: 'https://nileuniversity.edu.ng',
    sourceUrl: "https://application.nile.edu.ng",
    officialUrl: "https://application.nile.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Nile University Honoris United Universities Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#102A43",
      text: "#00B4D8",
      monogram: "NILE",
      crestColor: "#102A43",
      logoDescription: "Nile University Modern Academic Seal",
      "logoUrl": "/logos/nile-university-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to students across Africa and worldwide.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "JAMB & WAEC Score Scholarships (up to 100%)",
      details: "Official automatic scholarships of 10% to 100% based on WAEC/JAMB results and sports achievements.",
      tuitionCoverage: "10% to 100% based on entry scores"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Score-Based Scholarships (10% to 100%)",
      details: "Automatic tuition scholarships based on academic grades."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free online application for undergraduate admissions.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero application fee online."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO/IGCSE English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 1, 2026",
      deadlineDate: "2026-09-01",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 1, 2026",
    deadlineDate: "2026-09-01",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Software Engineering", "Civil Engineering", "Medicine", "International Relations", "Cybersecurity"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading private university in Abuja and member of Honoris United Universities, offering world-class facilities and score-based scholarships.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Updated domain to nileuniversity.edu.ng (old nile.edu.ng dead); automated fetch blocked by Cloudflare 520, verify in browser.'
  },
  {
    id: "aun-nigeria",
    officialName: "American University of Nigeria",
    institution: "American University of Nigeria",
    shortName: "AUN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Yola, Adamawa",
    officialWebsite: "https://aun.edu.ng",
    sourceUrl: 'https://aun.edu.ng/index.php/admissions',
    officialUrl: 'https://aun.edu.ng/index.php/admissions',
    category: "university",
    institutionType: 'Private University',
    title: "American University of Nigeria US-Style Curriculum & Degrees",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002855",
      text: "#C41230",
      monogram: "AUN",
      crestColor: "#002855",
      logoDescription: "AUN American Eagle & Torch Seal",
      logoUrl: '/logos/aun-nigeria.png',
      logoSourceUrl: 'https://aun.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Welcomes candidates worldwide seeking US-accredited curriculum in Africa.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Merit Scholarships & Shehu Musa Yar'Adua Fellowships",
      details: "Substantial merit scholarships based on high school grades and SAT/JAMB scores."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Merit Scholarships",
      details: "Merit aid based on high school transcripts."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "No application fee for direct online registration.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English accepted; SAT/ACT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/WASSCE English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 15, 2026",
      deadlineDate: "2026-08-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 15, 2026",
    deadlineDate: "2026-08-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+ or SAT 1150+.",
      language: "Credit in WAEC English or TOEFL/IELTS.",
      documents: ["O-Level result or high school transcript", "Personal statement"]
    },
    studyFields: ["Computer Science", "Information Systems", "Law", "Communications & Multimedia", "Petroleum Chemistry"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Africa's first American-style development university, partnering with American University in Washington D.C.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "buk-kano-nigeria",
    officialName: "Bayero University Kano",
    institution: "Bayero University Kano",
    shortName: "BUK",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Kano, Kano",
    officialWebsite: "https://buk.edu.ng",
    sourceUrl: "https://mybuk2.buk.edu.ng",
    officialUrl: "https://mybuk2.buk.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Bayero University Kano Academic & Research Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0B6623",
      text: "#FFFFFF",
      monogram: "BUK",
      crestColor: "#0B6623",
      logoDescription: "BUK Green & Gold Islamic & Academic Crest",
      "logoUrl": "/logos/buk-kano-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to Nigerian and international applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary education subsidy."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Subsidized federal tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening charge.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine", "Allied Health Sciences", "Engineering", "Dryland Agriculture", "Law"],
    intakeTerm: "October 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Major federal research university in northern Nigeria and home to World Bank Africa Centre of Excellence in Dryland Agriculture.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "unijos-nigeria",
    officialName: "University of Jos",
    institution: "University of Jos",
    shortName: "UNIJOS",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Jos, Plateau",
    officialWebsite: "https://unijos.edu.ng",
    sourceUrl: "https://portal.unijos.edu.ng",
    officialUrl: "https://portal.unijos.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "University of Jos Degree Programs & Medical Research",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#1C3F60",
      text: "#FFFFFF",
      monogram: "UNIJOS",
      crestColor: "#1C3F60",
      logoDescription: "UNIJOS Classical Blue Seal",
      "logoUrl": "/logos/unijos-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to all qualified applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME registration fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Pharmacy", "Law", "Natural Sciences", "Environmental Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned federal university situated in the temperate climate of the Jos Plateau, prominent for medical research and biodiversity studies.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "uniport-nigeria",
    officialName: "University of Port Harcourt",
    institution: "University of Port Harcourt",
    shortName: "UNIPORT",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Port Harcourt, Rivers",
    officialWebsite: "https://uniport.edu.ng",
    sourceUrl: 'https://www.uniport.edu.ng/admissions/',
    officialUrl: 'https://www.uniport.edu.ng/admissions/',
    category: "university",
    institutionType: 'Public University',
    title: "University of Port Harcourt Petroleum & Marine Studies",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#FFCC00",
      monogram: "UNIPORT",
      crestColor: "#003366",
      logoDescription: "UNIPORT Marine Crest",
      logoUrl: '/logos/uniport-nigeria.png',
      logoSourceUrl: 'http://www.uniport.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and Nigerian applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 31, 2026",
      deadlineDate: "2026-08-31",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 31, 2026",
    deadlineDate: "2026-08-31",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Gas & Petroleum Engineering", "Medicine", "Management Sciences", "Offshore Technology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading university in the Niger Delta region, famed for its Institute of Petroleum Studies and energy research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "unical-nigeria",
    officialName: "University of Calabar",
    institution: "University of Calabar",
    shortName: "UNICAL",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Calabar, Cross River",
    officialWebsite: "https://unical.edu.ng",
    sourceUrl: "https://myunical.edu.ng",
    officialUrl: "https://myunical.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "University of Calabar Degree Programs & Marine Biology",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#104E8B",
      text: "#FFFFFF",
      monogram: "UNICAL",
      crestColor: "#104E8B",
      logoDescription: "UNICAL Blue & Gold Seal",
      logoUrl: '/logos/unical-nigeria.png',
      logoSourceUrl: 'https://unical.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and Nigerian applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal university subsidy."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 10, 2026",
      deadlineDate: "2026-09-10",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 10, 2026",
    deadlineDate: "2026-09-10",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Marine Biology", "Medicine", "Law", "Education", "Oceanography"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Second-generation federal university in southeastern Nigeria, renowned for coastal studies, medicine, and ocean sciences.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "uniabuja-nigeria",
    officialName: "University of Abuja",
    institution: "University of Abuja",
    shortName: "UNIABUJA",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Abuja, FCT",
    officialWebsite: "https://uniabuja.edu.ng",
    sourceUrl: "https://portal.uniabuja.edu.ng",
    officialUrl: "https://portal.uniabuja.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "University of Abuja Law, Public Policy & Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004080",
      text: "#FFFFFF",
      monogram: "UofA",
      crestColor: "#004080",
      logoDescription: "UNIABUJA Capital City Seal",
      "logoUrl": "/logos/uniabuja-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants in Nigeria's federal capital.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 30, 2026",
      deadlineDate: "2026-09-30",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 30, 2026",
    deadlineDate: "2026-09-30",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Public Administration", "Medicine", "Veterinary Medicine", "Economics"],
    intakeTerm: "October 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The federal university in Nigeria's federal capital territory, renowned for governance, law, and diplomacy studies.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "unizik-nigeria",
    officialName: "Nnamdi Azikiwe University",
    institution: "Nnamdi Azikiwe University",
    shortName: "UNIZIK",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Awka, Anambra",
    officialWebsite: "https://unizik.edu.ng",
    sourceUrl: 'https://unizik.edu.ng/admissions',
    officialUrl: 'https://unizik.edu.ng/admissions',
    category: "university",
    institutionType: 'Public University',
    title: "UNIZIK Degree Programs & Chinese Language Institute",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#8B0000",
      text: "#FFFFFF",
      monogram: "UNIZIK",
      crestColor: "#8B0000",
      logoDescription: "UNIZIK Crimson Eagle Seal",
      logoUrl: '/logos/unizik-nigeria.png',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Badge_of_Nnamdi_Azikiwe_University.png'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Pharmacy", "Medicine", "Engineering", "Chinese Language (Confucius Institute)", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Named after Nigeria's first president Dr. Nnamdi Azikiwe, home to Nigeria's largest Confucius Institute and distinguished faculties of medicine and pharmacy.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "uniuyo-nigeria",
    officialName: "University of Uyo",
    institution: "University of Uyo",
    shortName: "UNIUYO",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Uyo, Akwa Ibom",
    officialWebsite: "https://uniuyo.edu.ng",
    sourceUrl: "https://uniuyo.edu.ng/eportals",
    officialUrl: "https://uniuyo.edu.ng/eportals",
    category: "university",
    institutionType: 'Public University',
    title: "University of Uyo Degree Programs & Oil-Bearing Ecology",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#005A36",
      text: "#FFFFFF",
      monogram: "UNIUYO",
      crestColor: "#005A36",
      logoDescription: "UNIUYO Forest Green Academic Shield",
      logoUrl: '/logos/uniuyo-nigeria.png',
      logoSourceUrl: 'https://uniuyo.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Petroleum Engineering", "Environmental Toxicology", "Pharmacy", "Law", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Premier federal institution located in the clean capital of Akwa Ibom State, leading oil-field environmental research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "futminna-nigeria",
    officialName: "Federal University of Technology, Minna",
    institution: "Federal University of Technology, Minna",
    shortName: "FUTMINNA",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Minna, Niger",
    officialWebsite: "https://futminna.edu.ng",
    sourceUrl: "https://eportal.futminna.edu.ng",
    officialUrl: "https://eportal.futminna.edu.ng",
    category: "university",
    institutionType: 'Technical University',
    title: "FUTMINNA Engineering & Information Technology",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004B23",
      text: "#E5A823",
      monogram: "FUTM",
      crestColor: "#004B23",
      logoDescription: "FUTMINNA Technical Seal",
      logoUrl: '/logos/futminna-nigeria.jpg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:FUT.Minna_Logo_IMG_0600.jpg'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level science credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Telecommunication Engineering", "Cybersecurity", "Chemical Engineering", "Architecture"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading federal university of technology specializing in ICT, artificial intelligence, and telecommunications engineering.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "landmark-university-nigeria",
    officialName: "Landmark University",
    institution: "Landmark University",
    shortName: "Landmark",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Omu-Aran, Kwara",
    officialWebsite: "https://lmu.edu.ng",
    sourceUrl: "https://admission.lmu.edu.ng",
    officialUrl: "https://admission.lmu.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Landmark University Agrarian Revolution & Engineering Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0B4F26",
      text: "#E5A823",
      monogram: "LMU",
      crestColor: "#0B4F26",
      logoDescription: "Landmark University Green Agrarian Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants committed to agrarian and technological development.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Tuition Waiver",
      amount: "Full Tuition Scholarships for Agricultural Programs",
      details: "Landmark University offers full tuition-free scholarships for all students admitted into core Agricultural Sciences programs.",
      tuitionCoverage: "100% tuition waiver for Agricultural Sciences"
    },
    funding: {
      type: "Tuition Waiver",
      amount: "100% Tuition Waiver for Agricultural Sciences",
      details: "Free tuition in agricultural disciplines."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 online application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO/Cambridge English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 20, 2026",
      deadlineDate: "2026-08-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 20, 2026",
    deadlineDate: "2026-08-20",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Agricultural Engineering", "Agronomy & Soil Science", "Mechanical Engineering", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned private university spearheading an agrarian revolution in Africa with 100% tuition-free scholarships for agricultural programs.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Server TLS certificate chain incomplete during automated check; verify HTTPS configuration.'
  },
  {
    id: "lautech-nigeria",
    officialName: "Ladoke Akintola University of Technology",
    institution: "Ladoke Akintola University of Technology",
    shortName: "LAUTECH",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ogbomoso, Oyo",
    officialWebsite: "https://lautech.edu.ng",
    sourceUrl: 'https://apply.lautech.edu.ng/en/logon',
    officialUrl: 'https://apply.lautech.edu.ng/en/logon',
    category: "university",
    institutionType: 'Public University',
    title: "LAUTECH Engineering, Nanotechnology & Medical Sciences",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7B0000",
      text: "#FFFFFF",
      monogram: "LAUTECH",
      crestColor: "#7B0000",
      logoDescription: "LAUTECH Technology Gear & Shield",
      logoUrl: '/logos/lautech-nigeria.png',
      logoSourceUrl: 'https://lautech.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Oyo State Tertiary Education Subsidies",
      details: "Subsidized state university tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Nanotechnology", "Computer Engineering", "Medicine", "Biochemistry", "Agricultural Economics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Repeatedly ranked as the best state university in Nigeria by the NUC, home to pioneering research in nanotechnology.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "bowen-university-nigeria",
    officialName: "Bowen University",
    institution: "Bowen University",
    shortName: "Bowen",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Iwo, Osun",
    officialWebsite: "https://bowen.edu.ng",
    sourceUrl: "https://admissions.bowen.edu.ng",
    officialUrl: "https://admissions.bowen.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Bowen University Medical, Legal & Agricultural Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#103050",
      text: "#E5A823",
      monogram: "BOWEN",
      crestColor: "#103050",
      logoDescription: "Bowen University Navy & Gold Shield",
      logoUrl: '/logos/bowen-university-nigeria.webp',
      logoSourceUrl: 'https://bowen.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Baptist Convention Merit Scholarships & Work-Study",
      details: "Merit and need-based tuition reductions."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Merit Scholarships & Work-Study",
      details: "Merit awards and work-study."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 25, 2026",
      deadlineDate: "2026-08-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 25, 2026",
    deadlineDate: "2026-08-25",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Law", "Nursing Science", "Biochemistry", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Pioneer Baptist university in Nigeria renowned for character, medicine, law, and academic discipline.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "baze-university-nigeria",
    officialName: "Baze University",
    institution: "Baze University",
    shortName: "Baze",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Abuja, FCT",
    officialWebsite: "https://bazeuniversity.edu.ng",
    sourceUrl: "https://admissions.bazeuniversity.edu.ng",
    officialUrl: "https://admissions.bazeuniversity.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Baze University British-Standard Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#FFFFFF",
      monogram: "BAZE",
      crestColor: "#003366",
      logoDescription: "Baze University Blue Shield",
      logoUrl: '/logos/baze-university-nigeria.png',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Logo_of_Baze_University_Abuja,_Nigeri.png'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Merit Discounts for Top JAMB & A-Level Performers",
      details: "Academic discounts for top academic achievers."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Merit Discounts",
      details: "Academic merit discounts."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO/Cambridge English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 1, 2026",
      deadlineDate: "2026-09-01",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 1, 2026",
    deadlineDate: "2026-09-01",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+ or A-levels.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Medicine", "Civil Engineering", "International Relations", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "A distinctive private university in Abuja modelled on British university curricula with an ultra-modern medical hospital campus.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Admissions subdomain (admissions.bazeuniversity.edu.ng) failed DNS resolution; verify admissions portal URL.'
  },
  {
    id: "rsu-nigeria",
    officialName: "Rivers State University",
    institution: "Rivers State University",
    shortName: "RSU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Port Harcourt, Rivers",
    officialWebsite: "https://rsu.edu.ng",
    sourceUrl: "https://ecampus.rsu.edu.ng",
    officialUrl: "https://ecampus.rsu.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Rivers State University Engineering & Maritime Technology",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0047AB",
      text: "#FFFFFF",
      monogram: "RSU",
      crestColor: "#0047AB",
      logoDescription: "RSU Cobalt Blue Maritime Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Rivers State Subsidized Education",
      details: "Subsidized state university tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Marine Engineering", "Law", "Medical Laboratory Science", "Architecture", "Mass Communication"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Nigeria's first state technological university, recognized for naval architecture, marine engineering, and environmental law.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Server SSL certificate expired on automated check; verify current HTTPS portal.'
  },
  {
    id: "oou-nigeria",
    officialName: "Olabisi Onabanjo University",
    institution: "Olabisi Onabanjo University",
    shortName: "OOU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ago-Iwoye, Ogun",
    officialWebsite: "https://oouagoiwoye.edu.ng",
    sourceUrl: "https://portal.oouagoiwoye.edu.ng",
    officialUrl: "https://portal.oouagoiwoye.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "OOU Degree Programs & College of Health Sciences",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#1E3F20",
      text: "#FFFFFF",
      monogram: "OOU",
      crestColor: "#1E3F20",
      logoDescription: "OOU Dark Green Academic Shield"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Ogun State University Subsidies",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine", "Law", "Pharmacy", "Biochemistry", "Accounting"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's pioneer state universities, with distinguished multi-campus faculties in Ago-Iwoye, Sagamu, and Ibogun.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "eksu-nigeria",
    officialName: "Ekiti State University",
    institution: "Ekiti State University",
    shortName: "EKSU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ado-Ekiti, Ekiti",
    officialWebsite: "https://eksu.edu.ng",
    sourceUrl: "https://eksuportal.eksu.edu.ng",
    officialUrl: "https://eksuportal.eksu.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Ekiti State University Degree Programs & Research",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#330066",
      text: "#FFFFFF",
      monogram: "EKSU",
      crestColor: "#330066",
      logoDescription: "EKSU Purple and Gold Academic Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Ekiti State Higher Education Subsidies",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Medicine", "Civil Engineering", "Agricultural Science", "Economics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading state university in the academic hub of Ekiti State, producing top legal scholars and medical doctors.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "delsu-nigeria",
    officialName: "Delta State University",
    institution: "Delta State University",
    shortName: "DELSU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Abraka, Delta",
    officialWebsite: "https://delsu.edu.ng",
    sourceUrl: 'https://delsu.edu.ng/',
    officialUrl: 'https://delsu.edu.ng/',
    category: "university",
    institutionType: 'Public University',
    title: "Delta State University Abraka Programs & Health Sciences",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002366",
      text: "#FFFFFF",
      monogram: "DELSU",
      crestColor: "#002366",
      logoDescription: "DELSU Royal Blue Emblem",
      logoUrl: '/logos/delsu-nigeria.png',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:DeltaStateUniversity.png'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Delta State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Law", "Pharmacy", "Theatre Arts", "Mass Communication"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "State university in Abraka, Delta State, celebrated for performing arts, medicine, and human physiology.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "aau-ekpoma-nigeria",
    officialName: "Ambrose Alli University",
    institution: "Ambrose Alli University",
    shortName: "AAU Ekpoma",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ekpoma, Edo",
    officialWebsite: "https://aauekpoma.edu.ng",
    sourceUrl: "https://aaue.waeup.org",
    officialUrl: "https://aaue.waeup.org",
    category: "university",
    institutionType: 'Public University',
    title: "Ambrose Alli University Ekpoma Academic Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#551A8B",
      text: "#FFFFFF",
      monogram: "AAU",
      crestColor: "#551A8B",
      logoDescription: "AAU Ekpoma Academic Seal",
      logoUrl: '/logos/aau-ekpoma-nigeria.png',
      logoSourceUrl: 'https://aauekpoma.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Edo State University Subsidies",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Medicine & Surgery", "Architecture", "Electrical Engineering", "Accounting"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's historic state universities, established by Prof. Ambrose Alli in 1981, renowned for its law and medical faculties.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "aaua-nigeria",
    officialName: "Adekunle Ajasin University",
    institution: "Adekunle Ajasin University",
    shortName: "AAUA",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Akungba-Akoko, Ondo",
    officialWebsite: "https://aaua.edu.ng",
    sourceUrl: 'https://aaua.edu.ng',
    officialUrl: 'https://aaua.edu.ng',
    category: "university",
    institutionType: 'Public University',
    title: "Adekunle Ajasin University Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0047AB",
      text: "#FFFFFF",
      monogram: "AAUA",
      crestColor: "#0047AB",
      logoDescription: "AAUA Blue & Gold Crest",
      logoUrl: '/logos/aaua-nigeria.png',
      logoSourceUrl: 'https://aaua.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Ondo State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Computer Science", "Microbiology", "Mass Communication", "Economics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Recognized as the best state university in Nigeria in multiple national rankings, noted for ICT innovation and peaceful academic calendar.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "uniosun-nigeria",
    officialName: "Osun State University",
    institution: "Osun State University",
    shortName: "UNIOSUN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Osogbo, Osun",
    officialWebsite: "https://uniosun.edu.ng",
    sourceUrl: "https://admissions.uniosun.edu.ng",
    officialUrl: "https://admissions.uniosun.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Osun State University Multi-Campus Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#800000",
      text: "#FFFFFF",
      monogram: "UNIOSUN",
      crestColor: "#800000",
      logoDescription: "UNIOSUN Maroon Crest",
      logoUrl: '/logos/uniosun-nigeria.png',
      logoSourceUrl: 'https://uniosun.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Osun State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine", "Law", "Nursing", "Mechanical Engineering", "Agronomy"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Multi-campus collegiate university across six towns in Osun State, renowned for public health and nursing.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "kwasu-nigeria",
    officialName: "Kwara State University",
    institution: "Kwara State University",
    shortName: "KWASU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Malete, Kwara",
    officialWebsite: "https://kwasu.edu.ng",
    sourceUrl: "https://portal.kwasu.edu.ng",
    officialUrl: "https://portal.kwasu.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Kwara State University Aeronautics, Engineering & Entrepreneurship",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFD700",
      monogram: "KWASU",
      crestColor: "#006400",
      logoDescription: "KWASU Green and Gold Aeronautical Crest",
      logoUrl: '/logos/kwasu-nigeria.png',
      logoSourceUrl: 'https://kwasu.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Kwara State Subsidized Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Aeronautical & Astronautical Engineering", "Civil Engineering", "Computer Science", "Mass Communication"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "First university in Nigeria to offer Aeronautical and Astronautical Engineering, pioneering aviation education in West Africa.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "kasu-nigeria",
    officialName: "Kaduna State University",
    institution: "Kaduna State University",
    shortName: "KASU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Kaduna, Kaduna",
    officialWebsite: "https://kasu.edu.ng",
    sourceUrl: "https://forms.kasu.edu.ng",
    officialUrl: "https://forms.kasu.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Kaduna State University Degree Programs & Medicine",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#191970",
      text: "#FFFFFF",
      monogram: "KASU",
      crestColor: "#191970",
      logoDescription: "KASU Midnight Blue Seal",
      logoUrl: '/logos/kasu-nigeria.png',
      logoSourceUrl: 'https://kasu.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Kaduna State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Pharmacy", "Computer Science", "Mass Communication", "Accounting"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading northern Nigerian state university located in the historic metropolis of Kaduna, offering modern medical and pharmaceutical education.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "bsu-makurdi-nigeria",
    officialName: "Benue State University",
    institution: "Benue State University",
    shortName: "BSU Makurdi",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Makurdi, Benue",
    officialWebsite: "https://bsum.edu.ng",
    sourceUrl: "https://portal.bsum.edu.ng",
    officialUrl: "https://portal.bsum.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Benue State University Degree Programs & Food Basket Research",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#2E8B57",
      text: "#FFFFFF",
      monogram: "BSUM",
      crestColor: "#2E8B57",
      logoDescription: "BSU Sea Green Agrarian Seal",
      logoUrl: '/logos/bsu-makurdi-nigeria.png',
      logoSourceUrl: 'https://bsum.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Benue State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine", "Law", "Agronomy", "Microbiology", "Economics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Flagship tertiary institution in the 'Food Basket of the Nation', prominent for agrarian research, public health, and law.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "redeemers-university-nigeria",
    officialName: "Redeemer's University",
    institution: "Redeemer's University",
    shortName: "RUN",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ede, Osun",
    officialWebsite: "https://run.edu.ng",
    sourceUrl: "https://admissions.run.edu.ng",
    officialUrl: "https://admissions.run.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Redeemer's University Genomics & Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000080",
      text: "#FFFFFF",
      monogram: "RUN",
      crestColor: "#000080",
      logoDescription: "RUN Navy Academic Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "ACEGID Genomics Fellowships & Merit Aid",
      details: "Home to the African Centre of Excellence for Genomics of Infectious Diseases (ACEGID), offering world-class biomedical research fellowships."
    },
    funding: {
      type: "Partial / Merit",
      amount: "ACEGID Genomics Fellowships & Merit Aid",
      details: "Merit aid and research fellowships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 25, 2026",
      deadlineDate: "2026-08-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 25, 2026",
    deadlineDate: "2026-08-25",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Genomics & Molecular Biology", "Computer Science", "Law", "Nursing", "Accounting"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "World-renowned for housing the African Centre of Excellence for Genomics of Infectious Diseases (ACEGID), which sequenced the first Ebola and Monkeypox genomes in Africa.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Server TLS certificate chain incomplete during automated check; verify HTTPS configuration.'
  },
  {
    id: "fuoye-nigeria",
    officialName: "Federal University, Oye-Ekiti",
    institution: "Federal University, Oye-Ekiti",
    shortName: "FUOYE",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Oye-Ekiti, Ekiti",
    officialWebsite: "https://fuoye.edu.ng",
    sourceUrl: "https://ecampus.fuoye.edu.ng",
    officialUrl: "https://ecampus.fuoye.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Federal University Oye-Ekiti Degree Programs & Engineering",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFFFFF",
      monogram: "FUOYE",
      crestColor: "#006400",
      logoDescription: "FUOYE Green & Gold Federal Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Mechatronics Engineering", "Civil Engineering", "Agriculture", "Law", "Pharmacy"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's fastest-growing federal universities, established in 2011, noted for mechatronics and agricultural sciences.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "fupre-nigeria",
    officialName: "Federal University of Petroleum Resources, Effurun",
    institution: "Federal University of Petroleum Resources, Effurun",
    shortName: "FUPRE",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Effurun, Delta",
    officialWebsite: "https://fupre.edu.ng",
    sourceUrl: "https://utme.fupre.edu.ng",
    officialUrl: "https://utme.fupre.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "FUPRE Petroleum, Gas & Energy Engineering",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#1C1C1C",
      text: "#FFD700",
      monogram: "FUPRE",
      crestColor: "#1C1C1C",
      logoDescription: "FUPRE Oil Drop & Rig Emblem",
      logoUrl: '/logos/fupre-nigeria.png',
      logoSourceUrl: 'https://fupre.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & PTDF Scholarships",
      details: "Federal tertiary subsidy; Petroleum Technology Development Fund (PTDF) scholarship partnerships."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & PTDF Scholarships",
      details: "Federal subsidy and PTDF support."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 15, 2026",
      deadlineDate: "2026-09-15",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 15, 2026",
    deadlineDate: "2026-09-15",
    admissionsRequirements: {
      academic: "5 O-level science credits including English, Math, Physics, and Chemistry; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Petroleum Engineering", "Gas Engineering", "Geophysics", "Chemical Engineering", "Petrochemicals"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The first specialized petroleum university in Africa and sixth in the world, dedicated exclusively to the oil, gas, and renewable energy sectors.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "udus-sokoto-nigeria",
    officialName: "Usmanu Danfodiyo University",
    institution: "Usmanu Danfodiyo University",
    shortName: "UDUS",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Sokoto, Sokoto",
    officialWebsite: "https://udusok.edu.ng",
    sourceUrl: "https://admissions.udusok.edu.ng",
    officialUrl: "https://admissions.udusok.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Usmanu Danfodiyo University Medical & Agricultural Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFFFFF",
      monogram: "UDUS",
      crestColor: "#006400",
      logoDescription: "UDUS Green Crescent & Book Seal",
      logoUrl: '/logos/udus-sokoto-nigeria.png',
      logoSourceUrl: 'https://www.udusok.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Veterinary Medicine", "Islamic Law", "Solar Energy Studies", "Pharmacy"],
    intakeTerm: "October 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned first-generation federal institution in northwestern Nigeria, pioneering national solar energy and desert agriculture research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "atbu-bauchi-nigeria",
    officialName: "Abubakar Tafawa Balewa University",
    institution: "Abubakar Tafawa Balewa University",
    shortName: "ATBU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Bauchi, Bauchi",
    officialWebsite: "https://atbu.edu.ng",
    sourceUrl: 'https://atbu.edu.ng/admission/',
    officialUrl: 'https://atbu.edu.ng/admission/',
    category: "university",
    institutionType: 'Technical University',
    title: "ATBU Science & Technological Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#8B4513",
      text: "#FFFFFF",
      monogram: "ATBU",
      crestColor: "#8B4513",
      logoDescription: "ATBU Bronze & Gold Tech Crest",
      "logoUrl": "/logos/atbu-bauchi-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Mechatronics & Systems Engineering", "Petroleum Engineering", "Medicine", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Named after Nigeria's first Prime Minister Sir Abubakar Tafawa Balewa, a dedicated technological university in northeastern Nigeria.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "lead-city-university-nigeria",
    officialName: "Lead City University",
    institution: "Lead City University",
    shortName: "LCU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Ibadan, Oyo",
    officialWebsite: "https://lcu.edu.ng",
    sourceUrl: "https://admissions.lcu.edu.ng",
    officialUrl: "https://admissions.lcu.edu.ng",
    category: "university",
    institutionType: 'Private University',
    title: "Lead City University Professional Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002366",
      text: "#E5A823",
      monogram: "LCU",
      crestColor: "#002366",
      logoDescription: "Lead City University Blue and Gold Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Merit Discounts & Flexible Instalments",
      details: "Tuition discount schemes and academic scholarships."
    },
    funding: {
      type: "Partial / Merit",
      amount: "Merit Discounts",
      details: "Merit awards and instalment options."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦10,000 application fee.",
      amount: "₦10,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦10,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: August 30, 2026",
      deadlineDate: "2026-08-30",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "August 30, 2026",
    deadlineDate: "2026-08-30",
    admissionsRequirements: {
      academic: "5 O-level credits in relevant subjects; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Law", "Nursing", "Software Engineering", "Business Administration"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Premier private university in Ibadan, Oyo State, offering accredited professional degrees in medicine, nursing, law, and computing.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "fuam-makurdi-nigeria",
    officialName: "Joseph Sarwuan Tarka University (Federal University of Agriculture, Makurdi)",
    institution: "Joseph Sarwuan Tarka University (FUAM)",
    shortName: "FUAM / JOSTUM",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Makurdi, Benue",
    officialWebsite: "https://uam.edu.ng",
    sourceUrl: "https://portal.uam.edu.ng",
    officialUrl: "https://portal.uam.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "FUAM Agricultural Engineering, Veterinary Medicine & Agronomy",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0B5345",
      text: "#FFFFFF",
      monogram: "FUAM",
      crestColor: "#0B5345",
      logoDescription: "FUAM Green Agricultural Seal"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to domestic and international applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Agricultural Subsidy & NELFUND",
      details: "Subsidized federal tuition and NELFUND interest-free loans."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Agricultural Subsidy & NELFUND",
      details: "Subsidized federal tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME screening fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Veterinary Medicine", "Agricultural & Environmental Engineering", "Food Science", "Agronomy"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's premier specialized federal universities of agriculture, driving innovations in crops, livestock, and food security.",
    officialRuleSummary: "Accredited by NUC.",
    linkStatus: 'needs-review',
    reviewNote: 'Institutional website (uam.edu.ng) timed out during automated verification; verify current Joseph Sarwuan Tarka University portal.'
  },
  {
    id: "unimaid-nigeria",
    officialName: "University of Maiduguri",
    institution: "University of Maiduguri",
    shortName: "UNIMAID",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Maiduguri, Borno",
    officialWebsite: "https://unimaid.edu.ng",
    sourceUrl: 'https://unimaid.edu.ng/register.php?track=standard',
    officialUrl: 'https://unimaid.edu.ng/register.php?track=standard',
    category: "university",
    institutionType: 'Public University',
    title: "University of Maiduguri Degree Programs & Arid Zone Ecology",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#154360",
      text: "#FFFFFF",
      monogram: "UNIMAID",
      crestColor: "#154360",
      logoDescription: "UNIMAID Blue and White Seal",
      logoUrl: '/logos/unimaid-nigeria.png',
      logoSourceUrl: 'https://unimaid.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Medicine & Surgery", "Veterinary Medicine", "Arid Zone Studies", "Law", "Civil Engineering"],
    intakeTerm: "October 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Major second-generation federal university in north-eastern Nigeria, renowned for arid zone agriculture and infectious disease research.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "mau-yola-nigeria",
    officialName: "Modibbo Adama University",
    institution: "Modibbo Adama University",
    shortName: "MAU Yola",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Yola, Adamawa",
    officialWebsite: "https://mau.edu.ng",
    sourceUrl: 'https://mau.edu.ng/',
    officialUrl: 'https://mau.edu.ng/',
    category: "university",
    institutionType: 'Public University',
    title: "Modibbo Adama University Engineering & Science Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#145A32",
      text: "#FFFFFF",
      monogram: "MAU",
      crestColor: "#145A32",
      logoDescription: "MAU Green and Gold Academic Crest",
      logoUrl: '/logos/mau-yola-nigeria.png',
      logoSourceUrl: 'https://mau.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Federal Government Subsidy & NELFUND",
      details: "Federal tertiary subsidy applies."
    },
    funding: {
      type: "Government Aid",
      amount: "Federal Subsidy & NELFUND",
      details: "Federal subsidy and loans."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Chemical Engineering", "Biotechnology", "Computer Science", "Information Technology", "Agriculture"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading technological and comprehensive federal university in northeastern Nigeria, celebrated for biotechnology and applied sciences.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "absu-nigeria",
    officialName: "Abia State University",
    institution: "Abia State University",
    shortName: "ABSU",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Uturu, Abia",
    officialWebsite: "https://abiastateuniversity.edu.ng",
    sourceUrl: "https://portal.abiastateuniversity.edu.ng",
    officialUrl: "https://portal.abiastateuniversity.edu.ng",
    category: "university",
    institutionType: 'Public University',
    title: "Abia State University Law, Medicine & Optometry Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#1B4F72",
      text: "#FFFFFF",
      monogram: "ABSU",
      crestColor: "#1B4F72",
      logoDescription: "ABSU Uturu Blue and Gold Shield",
      "logoUrl": "/logos/absu-nigeria.png"
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Abia State Higher Education Subsidies",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Optometry (Doctor of Optometry)", "Medicine & Surgery", "Law", "Microbiology", "Estate Management"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Nigeria's pioneer state universities, celebrated across West Africa for its Doctor of Optometry and Law programs.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "esut-nigeria",
    officialName: "Enugu State University of Science and Technology",
    institution: "Enugu State University of Science and Technology",
    shortName: "ESUT",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Agbani, Enugu",
    officialWebsite: "https://esut.edu.ng",
    sourceUrl: 'https://www.esut.edu.ng/',
    officialUrl: 'https://www.esut.edu.ng/',
    category: "university",
    institutionType: 'Public University',
    title: "ESUT Technology, Medicine & Engineering Degree Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7D3C98",
      text: "#FFFFFF",
      monogram: "ESUT",
      crestColor: "#7D3C98",
      logoDescription: "ESUT Purple and Gold Technology Shield",
      logoUrl: '/logos/esut-nigeria.webp',
      logoSourceUrl: 'https://www.esut.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Enugu State University Subsidies",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 25, 2026",
      deadlineDate: "2026-09-25",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 25, 2026",
    deadlineDate: "2026-09-25",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Mechanical Engineering", "Medicine", "Computer Engineering", "Applied Biochemistry", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Nigeria's first state university of technology, founded in 1980, known for engineering, applied sciences, and industrial training.",
    officialRuleSummary: "Accredited by NUC."
  },
  {
    id: "nsuk-nigeria",
    officialName: "Nasarawa State University, Keffi",
    institution: "Nasarawa State University, Keffi",
    shortName: "NSUK",
    country: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    city: "Keffi, Nasarawa",
    officialWebsite: "https://nsuk.edu.ng",
    sourceUrl: 'https://nsuk.edu.ng/',
    officialUrl: 'https://nsuk.edu.ng/',
    category: "university",
    institutionType: 'Public University',
    title: "NSUK Law, Agriculture & Environmental Science Programs",
    isVerified: true,
    verificationSource: "National Universities Commission (NUC), Nigeria",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#196F3D",
      text: "#FFFFFF",
      monogram: "NSUK",
      crestColor: "#196F3D",
      logoDescription: "NSUK Green Mineral State Emblem",
      logoUrl: '/logos/nsuk-nigeria.png',
      logoSourceUrl: 'https://nsuk.edu.ng/'
    },
    eligibilityCountries: ["Nigeria", "Ghana", "All 54 African Countries", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international and domestic applicants.",
      eligibleRegions: ["West Africa", "Africa", "Global"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Nasarawa State Subsidized Higher Education",
      details: "State subsidized tuition."
    },
    funding: {
      type: "Government Aid",
      amount: "State Subsidies",
      details: "State subsidized tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "₦2,000 Post-UTME fee.",
      amount: "₦2,000"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "₦2,000 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English credit accepted."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/NECO English accepted."
    },
    deadlines: {
      term: '2026/2027 Academic Session (Cycle Concluded)',
      deadlineText: "Admissions Closing: September 20, 2026",
      deadlineDate: "2026-09-20",
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 Post-UTME and direct entry application window closed on August 31, 2026. Check the official admissions portal for 2027/2028 announcements.',
      isRolling: false
    },
    deadline: "September 20, 2026",
    deadlineDate: "2026-09-20",
    admissionsRequirements: {
      academic: "5 O-level credits including English and Math; JAMB score 180+.",
      language: "Credit in WAEC/NECO English.",
      documents: ["O-Level result", "JAMB slip"]
    },
    studyFields: ["Law", "Agronomy & Soil Science", "Geology & Mining", "Accounting", "Public Administration"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Dynamic state university located in the mineral-rich middle belt near Abuja, celebrated for law, geological sciences, and agricultural studies.",
    officialRuleSummary: "Accredited by NUC."
  }
];
