import type { OpportunityItem } from "./opportunities";

export const australiaUniversities: OpportunityItem[] = [
  {
    id: "usyd-australia",
    officialName: "The University of Sydney",
    institution: "The University of Sydney",
    shortName: "Sydney",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, New South Wales",
    officialWebsite: "https://www.sydney.edu.au",
    sourceUrl: "https://www.sydney.edu.au/study/how-to-apply/international-students.html",
    officialUrl: "https://www.sydney.edu.au/study/how-to-apply/international-students.html",
    category: "university",
    institutionType: 'Public University',
    title: "University of Sydney International Strategic Scholarship (up to AUD $40,000)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#E64626",
      text: "#000000",
      monogram: "USYD",
      crestColor: "#E64626",
      logoDescription: "University of Sydney Ochre & Lion Open Book Shield",
      "logoUrl": "/logos/usyd-australia.png"
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students worldwide holding recognized secondary qualifications.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Sydney International Student Award (20% fee reduction) & Vice-Chancellor Scholarships",
      details: "Automatic 20% tuition contribution for citizens of selected countries (including African and Asian nations) for the full duration of the degree.",
      tuitionCoverage: "20% fee contribution across degree"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Fee Reduction & VC Scholarships",
      details: "Sydney International Student Award provides 20% tuition waiver."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $150 international application processing fee.",
      amount: "AUD $150"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $150 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English with C6 or better qualifies for English proficiency across undergraduate programs.",
      satPolicy: "SAT/ACT accepted in lieu of Australian ATAR."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 or better accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027 Intake)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Applications open for upcoming Semester 1 intake.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Recognized high school qualification (WASSCE, KCSE, GCE A-Levels, IB, SAT/ACT) meeting degree-specific cutoffs.",
      language: "WASSCE English C6 or IELTS 6.5 minimum.",
      documents: ["Official Academic Transcripts", "Passport Bio Page", "English Language Certificate"]
    },
    studyFields: ["Medicine & Health", "Software Engineering & Computer Science", "Law", "Commerce", "Architecture"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's first university, founded in 1850 and consistently ranked among the world's top 20 universities (QS World University Rankings).",
    officialRuleSummary: "Accredited by TEQSA and founding member of the Group of Eight (Go8)."
  },
  {
    id: "unsw-australia",
    officialName: "University of New South Wales",
    institution: "University of New South Wales",
    shortName: "UNSW Sydney",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, New South Wales",
    officialWebsite: "https://www.unsw.edu.au",
    sourceUrl: "https://www.unsw.edu.au/study/international-students",
    officialUrl: "https://www.unsw.edu.au/study/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "UNSW Engineering, Quantum Computing & International Scientia Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#FFD100",
      text: "#000000",
      monogram: "UNSW",
      crestColor: "#FFD100",
      logoDescription: "UNSW Yellow and Black Lion & Rising Sun Crest",
      "logoUrl": "/logos/unsw-australia.png"
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Scientia Coursework Scholarship (Full Tuition or AUD $20,000/yr)",
      details: "Competitive merit awards covering up to 100% of tuition fees for high-achieving international undergraduates.",
      tuitionCoverage: "Up to 100% tuition for Scientia Scholars"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 100% Tuition (Scientia Scholarship)",
      details: "International Scientia Coursework Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $125 application fee.",
      amount: "AUD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies English requirement.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English accepted."
    },
    deadlines: {
      term: "Term 1 (February 2027 Intake)",
      deadlineText: "International Application Deadline: November 30, 2026",
      deadlineDate: "2026-11-30",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: false
    },
    deadline: "November 30, 2026",
    deadlineDate: "2026-11-30",
    admissionsRequirements: {
      academic: "Secondary qualification equivalent to Australian ATAR requirements.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport copy", "Scholarship Essay"]
    },
    studyFields: ["Quantum Engineering", "Computer Science", "Photovoltaic & Renewable Energy", "Commerce", "Law"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's leading powerhouse for engineering, technology, and quantum computing, pioneering silicon quantum chips.",
    officialRuleSummary: "Accredited by TEQSA; member of the Group of Eight."
  },
  {
    id: "uq-australia",
    officialName: "The University of Queensland",
    institution: "The University of Queensland",
    shortName: "UQ",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Brisbane, Queensland",
    officialWebsite: "https://www.uq.edu.au",
    sourceUrl: "https://study.uq.edu.au",
    officialUrl: "https://study.uq.edu.au",
    category: "university",
    institutionType: 'Public University',
    title: "University of Queensland Biomedical, Environmental & Mining Admissions",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#51247A",
      text: "#FFFFFF",
      monogram: "UQ",
      crestColor: "#51247A",
      logoDescription: "UQ Royal Purple & Gold Open Book Crest",
      "logoUrl": "/logos/uq-australia.png"
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "UQ International Excellence Scholarship (25% fee reduction / up to AUD $40,000)",
      details: "25% tuition fee reduction per year for the standard duration of the degree.",
      tuitionCoverage: "25% annual tuition waiver"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Reduction",
      details: "UQ International Excellence Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 or prior English-medium secondary schooling.",
      satPolicy: "SAT scores accepted for entry."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: November 30, 2026",
      deadlineDate: "2026-11-30",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "November 30, 2026",
    deadlineDate: "2026-11-30",
    admissionsRequirements: {
      academic: "Secondary school credentials matching degree entry threshold.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport", "CV (if applicable)"]
    },
    studyFields: ["Biotechnology", "Mineral & Mining Engineering", "Environmental Management", "Pharmacy", "Veterinary Science"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "World top-50 university famed for inventing the Gardasil cervical cancer vaccine and leading global biodiversity and mining research.",
    officialRuleSummary: "Member of Group of Eight; accredited by TEQSA."
  },
  {
    id: "monash-australia",
    officialName: "Monash University",
    institution: "Monash University",
    shortName: "Monash",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Melbourne, Victoria",
    officialWebsite: "https://www.monash.edu",
    sourceUrl: "https://www.monash.edu/admissions",
    officialUrl: "https://www.monash.edu/admissions",
    category: "university",
    institutionType: 'Public University',
    title: "Monash University Pharmacy, Medicine & Global Leadership Grants",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000000",
      text: "#006DAE",
      monogram: "MONASH",
      crestColor: "#006DAE",
      logoDescription: "Monash Blue & White Sword and Open Book Shield",
      "logoUrl": "/logos/monash-australia.png"
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Monash International Leadership Scholarship (100% Tuition Fees Paid)",
      details: "Full tuition scholarship for international students based on outstanding academic achievement.",
      tuitionCoverage: "100% tuition for selected leadership scholars"
    },
    funding: {
      type: "Partial / Merit",
      amount: "100% Tuition Fees Paid (Leadership Scholarship)",
      details: "Monash International Leadership Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language proficiency requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: December 15, 2026",
      deadlineDate: "2026-12-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "December 15, 2026",
    deadlineDate: "2026-12-15",
    admissionsRequirements: {
      academic: "Secondary completion meeting ATAR equivalent cutoff.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Leadership Statement"]
    },
    studyFields: ["Pharmacy & Pharmacology (Ranked #2 Globally)", "Medicine", "Civil Engineering", "Data Science", "Banking & Finance"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's largest university and member of the Group of Eight, ranked #2 globally for Pharmacy and Pharmacology (QS).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "uwa-australia",
    officialName: "The University of Western Australia",
    institution: "The University of Western Australia",
    shortName: "UWA",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Perth, Western Australia",
    officialWebsite: "https://www.uwa.edu.au",
    sourceUrl: "https://www.uwa.edu.au/study",
    officialUrl: "https://www.uwa.edu.au/study",
    category: "university",
    institutionType: 'Public University',
    title: "UWA Global Excellence Scholarship (up to AUD $48,000 over 4 years)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#273872",
      text: "#DAA520",
      monogram: "UWA",
      crestColor: "#273872",
      logoDescription: "UWA Navy Blue & Gold Black Swan Crest",
      "logoUrl": "/logos/uwa-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Global Excellence Scholarship (up to AUD $12,000/year for 4 years)",
      details: "Automatic merit-based scholarship awarded to high-achieving international undergraduate applicants.",
      tuitionCoverage: "Up to AUD $48,000 fee contribution"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to AUD $48,000 over 4 years",
      details: "Global Excellence Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Marine Biology", "Mining & Petroleum Engineering", "Agriculture", "Medicine", "Data Science"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Western Australia's premier research university and Group of Eight member, globally celebrated for oceanic, mineral, and agricultural sciences.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "adelaide-australia",
    officialName: "The University of Adelaide",
    institution: "The University of Adelaide",
    shortName: "Adelaide",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Adelaide, South Australia",
    officialWebsite: "https://www.adelaide.edu.au",
    sourceUrl: "https://international.adelaide.edu.au",
    officialUrl: "https://international.adelaide.edu.au",
    category: "university",
    institutionType: 'Public University',
    title: "University of Adelaide Global Citizens Scholarship (up to 30% Fee Reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#10253F",
      text: "#FFFFFF",
      monogram: "UofA",
      crestColor: "#10253F",
      logoDescription: "Adelaide Navy Blue & Open Book Southern Cross Crest",
      "logoUrl": "/logos/adelaide-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Global Citizens Scholarship (15% to 30% tuition fee reduction)",
      details: "Tiered scholarship awarded automatically for the standard duration of the degree based on academic merit.",
      tuitionCoverage: "15% to 30% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "15% to 30% Fee Reduction",
      details: "Global Citizens Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $110 application fee.",
      amount: "AUD $110"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $110 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language proficiency.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Secondary qualification equivalent to Australian ATAR benchmark.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Viticulture & Wine Science", "Dental Surgery", "Artificial Intelligence & Machine Learning", "Aerospace Engineering"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "One of Australia's oldest Group of Eight research institutions, associated with five Nobel Laureates and world #2 for wine science.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "uts-australia",
    officialName: "University of Technology Sydney",
    institution: "University of Technology Sydney",
    shortName: "UTS",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, New South Wales",
    officialWebsite: "https://www.uts.edu.au",
    sourceUrl: "https://www.uts.edu.au/future-students/international",
    officialUrl: "https://www.uts.edu.au/future-students/international",
    category: "university",
    institutionType: 'Technical University',
    title: "UTS Tech, Artificial Intelligence, Nursing & Academic Excellence Grants",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000000",
      text: "#005696",
      monogram: "UTS",
      crestColor: "#005696",
      logoDescription: "UTS Modern Architectural Seal",
      "logoUrl": "/logos/uts-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "UTS Undergraduate Academic Excellence Scholarship (25% fee waiver)",
      details: "Automatic 25% tuition fee reduction for the entire duration of the undergraduate program.",
      tuitionCoverage: "25% tuition waiver across degree"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Waiver",
      details: "UTS Undergraduate Academic Excellence Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Autumn Session 2027",
      deadlineText: "International Application Deadline: December 15, 2026",
      deadlineDate: "2026-12-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "December 15, 2026",
    deadlineDate: "2026-12-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Artificial Intelligence", "Nursing (Ranked #1 in Australia)", "Software Development", "Design & Architecture"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's top-ranked young university, located in Sydney's tech precinct, celebrated for industry-linked artificial intelligence and nursing.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "macquarie-australia",
    officialName: "Macquarie University",
    institution: "Macquarie University",
    shortName: "Macquarie",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, New South Wales",
    officialWebsite: "https://www.mq.edu.au",
    sourceUrl: "https://www.mq.edu.au/study/international-students",
    officialUrl: "https://www.mq.edu.au/study/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "Macquarie University Vice-Chancellor's International Scholarship (AUD $10,000/yr)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#A6192E",
      text: "#FFFFFF",
      monogram: "MQ",
      crestColor: "#A6192E",
      logoDescription: "Macquarie Crimson & Lighthouse Emblem",
      "logoUrl": "/logos/macquarie-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Vice-Chancellor's International Scholarship (AUD $10,000 annually)",
      details: "Awarded to high-achieving international students to support their degree studies.",
      tuitionCoverage: "AUD $10,000/year annual tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "AUD $10,000/yr Annual Reduction",
      details: "Vice-Chancellor's International Scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "No application fee for direct online applications.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies English criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Session 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Cyber Security", "Actuarial Studies", "Linguistics & Hearing Sciences", "Macquarie Business School (MBA)"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned institution located in the Macquarie Park Innovation District, inventor of foundational Wi-Fi microchips and leader in actuarial studies.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "rmit-australia",
    officialName: "RMIT University",
    institution: "RMIT University",
    shortName: "RMIT",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Melbourne, Victoria",
    officialWebsite: "https://www.rmit.edu.au",
    sourceUrl: "https://www.rmit.edu.au/study-with-us/international-students",
    officialUrl: "https://www.rmit.edu.au/study-with-us/international-students",
    category: "university",
    institutionType: 'Technical University',
    title: "RMIT University Art & Design, Blockchain & Technology Degrees",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#E60000",
      text: "#000000",
      monogram: "RMIT",
      crestColor: "#E60000",
      logoDescription: "RMIT Red Pixel and Bold Typography Seal",
      "logoUrl": "/logos/rmit-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Future Leaders Scholarship (20% tuition fee reduction)",
      details: "Awarded to international students undertaking bachelor or master degrees.",
      tuitionCoverage: "20% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Tuition Fee Reduction",
      details: "Future Leaders Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Portfolio (for Design programs)", "Passport"]
    },
    studyFields: ["Art & Design (Ranked #1 in Australia / Top 20 Global)", "Architecture", "Blockchain Innovation", "Aerospace Engineering"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Global university of technology, design and enterprise in central Melbourne, ranked #1 in Australia for Art and Design (QS).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "qut-australia",
    officialName: "Queensland University of Technology",
    institution: "Queensland University of Technology",
    shortName: "QUT",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Brisbane, Queensland",
    officialWebsite: "https://www.qut.edu.au",
    sourceUrl: "https://www.qut.edu.au/study/international",
    officialUrl: "https://www.qut.edu.au/study/international",
    category: "university",
    institutionType: 'Technical University',
    title: "QUT International Merit Scholarship (25% tuition fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#FFFFFF",
      monogram: "QUT",
      crestColor: "#003366",
      logoDescription: "QUT Deep Navy Real World Architecture Seal",
      "logoUrl": "/logos/qut-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Merit Scholarship (25% fee waiver for all years)",
      details: "Continuous 25% tuition discount across the standard degree duration for academic achievers.",
      tuitionCoverage: "25% tuition fee waiver"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Waiver",
      details: "International Merit Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Communication & Media Studies (Ranked #1 in Australia)", "Robotics & Computer Vision", "Biomedical Engineering"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Known as 'the university for the real world', home to the Australian Centre for Robotic Vision and ranked #1 in Australia for Media Studies.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "curtin-australia",
    officialName: "Curtin University",
    institution: "Curtin University",
    shortName: "Curtin",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Perth, Western Australia",
    officialWebsite: "https://www.curtin.edu.au",
    sourceUrl: "https://study.curtin.edu.au/international",
    officialUrl: "https://study.curtin.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Curtin University Mineral & Mining Engineering (World #2), Merit Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#B78727",
      text: "#000000",
      monogram: "CURTIN",
      crestColor: "#B78727",
      logoDescription: "Curtin Gold & Black WA Mining Shield",
      logoUrl: '/logos/curtin-australia.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:CurtinUni_Logo.svg'
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Curtin International Merit Scholarship (25% first year tuition waiver)",
      details: "Awarded automatically to high-achieving international undergraduates.",
      tuitionCoverage: "25% tuition waiver in year one"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Waiver (Year 1)",
      details: "Curtin International Merit Scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free direct online application for international students.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Mineral & Mining Engineering (Ranked #2 Globally)", "Petroleum Engineering", "Radio Astronomy", "Health Sciences"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Consistently ranked #2 in the world for Mineral and Mining Engineering (QS), Western Australia's largest and most culturally diverse university.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "deakin-australia",
    officialName: "Deakin University",
    institution: "Deakin University",
    shortName: "Deakin",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Geelong & Melbourne, Victoria",
    officialWebsite: "https://www.deakin.edu.au",
    sourceUrl: "https://www.deakin.edu.au/international-students",
    officialUrl: "https://www.deakin.edu.au/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "Deakin University Sports Science (World #1) & Vice-Chancellor Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00A389",
      text: "#000000",
      monogram: "DEAKIN",
      crestColor: "#00A389",
      logoDescription: "Deakin Teal & Black Innovation Seal",
      "logoUrl": "/logos/deakin-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Deakin Vice-Chancellor's International Scholarship (50% or 100% Tuition Waiver)",
      details: "Competitive merit scholarship covering 50% or 100% of tuition fees for high-achieving international undergraduates.",
      tuitionCoverage: "Up to 100% tuition waiver"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 100% Tuition Waiver",
      details: "Vice-Chancellor's International Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $55 application fee.",
      amount: "AUD $55"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $55 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Trimester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Exercise & Sports Science (Ranked #1 Globally)", "Nursing", "Artificial Intelligence", "Cybersecurity"],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in the world for Sports Science (ShanghaiRanking Global Ranking of Sport Science Schools), renowned for digital learning and student satisfaction.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "uow-australia",
    officialName: "University of Wollongong",
    institution: "University of Wollongong",
    shortName: "UOW",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Wollongong, New South Wales",
    officialWebsite: "https://www.uow.edu.au",
    sourceUrl: "https://www.uow.edu.au/study/international",
    officialUrl: "https://www.uow.edu.au/study/international",
    category: "university",
    institutionType: 'Public University',
    title: "University of Wollongong Materials, Mining & Global Excellence Grants",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00205B",
      text: "#C41230",
      monogram: "UOW",
      crestColor: "#00205B",
      logoDescription: "UOW Navy & Red Open Book Wave Shield",
      "logoUrl": "/logos/uow-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "University Excellence Scholarship (up to 20% tuition fee reduction)",
      details: "Automatic tuition reduction for top-performing international undergraduates.",
      tuitionCoverage: "20% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Tuition Fee Reduction",
      details: "University Excellence Scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero fee for direct international online applications.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Autumn Session 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Intelligent Materials & Bionics", "Mining Engineering", "Computer Science", "Sustainable Marine Ecosystems"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Leading coastal research university located south of Sydney, home to the Australian Institute for Innovative Materials.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "newcastle-australia",
    officialName: "The University of Newcastle",
    institution: "The University of Newcastle",
    shortName: "Newcastle",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Newcastle, New South Wales",
    officialWebsite: "https://www.newcastle.edu.au",
    sourceUrl: "https://www.newcastle.edu.au/international",
    officialUrl: "https://www.newcastle.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "University of Newcastle Energy, Medical Science & Global Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#10253F",
      text: "#0093B2",
      monogram: "UoN",
      crestColor: "#10253F",
      logoDescription: "Newcastle Blue & Gold Seahorse Crest",
      logoUrl: '/logos/newcastle-australia.svg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:The_University_of_Newcastle_Coat_of_Arms.svg'
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Excellence Scholarship (up to AUD $60,000 / $15,000/yr)",
      details: "Tuition fee reduction awarded automatically for high-achieving undergraduate students.",
      tuitionCoverage: "AUD $15,000/year renewable support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to AUD $60,000 over 4 years",
      details: "International Excellence Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $100 application fee.",
      amount: "AUD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Mineral Processing & Energy Transition", "Medicine (Joint Medical Program)", "Architecture", "Nursing"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's leading university for industry collaboration and clean energy transition, ranked among the top 175 universities globally.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "latrobe-australia",
    officialName: "La Trobe University",
    institution: "La Trobe University",
    shortName: "La Trobe",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Melbourne, Victoria",
    officialWebsite: "https://www.latrobe.edu.au",
    sourceUrl: "https://www.latrobe.edu.au/international",
    officialUrl: "https://www.latrobe.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "La Trobe University Agricultural Bioscience & High Achiever Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C41230",
      text: "#FFFFFF",
      monogram: "LTU",
      crestColor: "#C41230",
      logoDescription: "La Trobe Red & White Eagle Crest",
      "logoUrl": "/logos/latrobe-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "La Trobe High Achiever Scholarship (up to 25% annual tuition reduction)",
      details: "Continuous fee reduction for students achieving strong academic results in their prior studies.",
      tuitionCoverage: "25% annual tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Annual Tuition Reduction",
      details: "High Achiever Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $110 application fee.",
      amount: "AUD $110"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $110 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Agricultural Biosciences (AgriBio)", "Biomedical Science", "Physiotherapy", "Archaeology"],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Home to the world-class AgriBio Centre for AgriBioscience and recognized globally for archaeology and sports medicine.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "griffith-australia",
    officialName: "Griffith University",
    institution: "Griffith University",
    shortName: "Griffith",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Gold Coast & Brisbane, Queensland",
    officialWebsite: "https://www.griffith.edu.au",
    sourceUrl: "https://www.griffith.edu.au/international",
    officialUrl: "https://www.griffith.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Griffith University Nursing, Hospitality & International Academic Excellence",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#BA0C2F",
      text: "#000000",
      monogram: "GU",
      crestColor: "#BA0C2F",
      logoDescription: "Griffith Red & Gold Open Book Crest",
      "logoUrl": "/logos/griffith-australia.png"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Student Academic Excellence Scholarship (25% fee waiver)",
      details: "Covers 25% of undergraduate tuition fees for students with top academic entrance grades.",
      tuitionCoverage: "25% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Reduction",
      details: "Academic Excellence Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $50 application fee.",
      amount: "AUD $50"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $50 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Trimester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Hospitality & Tourism Management (Ranked #1 in Australia / Top 5 Global)", "Nursing", "Dentistry", "Marine Science"],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in Australia and top 5 globally for Hospitality and Tourism Management, situated across Brisbane and the Gold Coast.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "utas-australia",
    officialName: "University of Tasmania",
    institution: "University of Tasmania",
    shortName: "UTAS",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Hobart, Tasmania",
    officialWebsite: "https://www.utas.edu.au",
    sourceUrl: "https://www.utas.edu.au/international",
    officialUrl: "https://www.utas.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "University of Tasmania Antarctic, Marine & Tasmanian International Scholarships",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004731",
      text: "#C41230",
      monogram: "UTAS",
      crestColor: "#004731",
      logoDescription: "UTAS Green & Red Tasmanian Tiger Shield",
      logoUrl: '/logos/utas-australia.png',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:UTasLogo.png'
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions. Designated regional visa study advantages apply.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Tasmanian International Scholarship (25% tuition fee reduction)",
      details: "Automatic 25% tuition fee discount for the entire duration of the degree based on high school results.",
      tuitionCoverage: "25% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Reduction",
      details: "Tasmanian International Scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free direct online application.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Antarctic & Southern Ocean Studies (IMAS)", "Australian Maritime College (AMC)", "Ocean Engineering", "Agriculture"],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's fourth-oldest university (founded 1890) and the world's premier gateway for Antarctic and southern ocean marine research.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "wsu-australia",
    officialName: "Western Sydney University",
    institution: "Western Sydney University",
    shortName: "WSU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, New South Wales",
    officialWebsite: "https://www.westernsydney.edu.au",
    sourceUrl: "https://www.westernsydney.edu.au/international",
    officialUrl: "https://www.westernsydney.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Western Sydney University World #1 for Sustainable Development, Multi-Tier Aid",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7A003C",
      text: "#FFFFFF",
      monogram: "WSU",
      crestColor: "#7A003C",
      logoDescription: "WSU Bold Claret Shield & Typography",
      logoUrl: '/logos/wsu-australia.png',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Western_Sydney_University_logo.png'
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Australia", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Oceania", "Africa", "Asia"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Vice-Chancellor's Academic Excellence Scholarship (50% fee waiver) & $3,000–$6,000 multi-year grants",
      details: "Multi-tiered financial assistance for international undergraduates.",
      tuitionCoverage: "Up to 50% tuition waiver"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 50% Tuition Waiver",
      details: "Vice-Chancellor's Academic Excellence Scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero fee for direct online international application.",
      amount: "$0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 satisfies language criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Autumn Session 2027",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Passport Bio Page"]
    },
    studyFields: ["Sustainable Development & Ecology", "Hawkesbury Institute for the Environment", "Forensic Science", "Nursing"],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in the world for UN Sustainable Development Goals three years consecutively (Times Higher Education Impact Rankings).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "flinders-australia",
    officialName: "Flinders University",
    institution: "Flinders University",
    shortName: "Flinders",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Adelaide, South Australia",
    officialWebsite: "https://www.flinders.edu.au",
    sourceUrl: "https://www.flinders.edu.au/international",
    officialUrl: "https://www.flinders.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Flinders Go Beyond Global Scholarships (up to 50% tuition reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#FFD100",
      text: "#000000",
      monogram: "FLIN",
      crestColor: "#FFD100",
      logoDescription: "Flinders University Gold & Charcoal Institutional Emblem",
      logoUrl: '/logos/flinders-australia.svg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Flinders_University_Emblem_Variant_2022.svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% to 50% tuition fee reduction",
      details: "Vice-Chancellor International Scholarships (50% fee reduction) and Global Scholarships (20% fee reduction).",
      tuitionCoverage: "Up to 50% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% to 50% Tuition Fee Reduction",
      details: "Merit-based international scholarships awarded automatically on admission."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct international applications to Flinders University are free of charge.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "No fee for direct international online applications."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English score of C6 or better satisfies undergraduate English criteria.",
      satPolicy: "SAT/ACT not required for Australian admissions."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "Senior secondary English exam recognized."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Recognized secondary qualification equivalent to Australian Year 12 ATAR 65-85.",
      language: "IELTS 6.0-6.5 equivalent or WAEC/WASSCE grade C6 or higher.",
      documents: [
        "Official Academic Transcripts",
        "Certified Certificate",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Medicine & Public Health",
      "Biomedical Engineering",
      "Marine Biology",
      "Computer Science",
      "Education"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned for its cutting-edge medical center, digital health initiatives, and strong graduate employment outcomes in South Australia.",
    officialRuleSummary: "Accredited by TEQSA and member of the Innovative Research Universities (IRU)."
  },
  {
    id: "swinburne-australia",
    officialName: "Swinburne University of Technology",
    institution: "Swinburne University of Technology",
    shortName: "Swinburne",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Melbourne, Victoria",
    officialWebsite: "https://www.swinburne.edu.au",
    sourceUrl: 'https://www.swinburne.edu.au/courses/applying/',
    officialUrl: 'https://www.swinburne.edu.au/courses/applying/',
    category: "university",
    institutionType: 'Technical University',
    title: "Swinburne International Excellence Scholarship (up to 30% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#DC2626",
      text: "#FFFFFF",
      monogram: "SWIN",
      crestColor: "#DC2626",
      logoDescription: "Swinburne University Crimson & Black Tech Crest",
      "logoUrl": "/logos/swinburne-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to commencing international undergraduate and postgraduate coursework students.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Up to 30% reduction on tuition fees across degree duration",
      details: "Tiered scholarship based on prior academic achievement.",
      tuitionCoverage: "10% to 30% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 30% Tuition Fee Reduction",
      details: "Automatic merit evaluation during admission."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free direct online applications for international students.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "No fee for online applications."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies English proficiency.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English accepted."
    },
    deadlines: {
      term: "Semester 1 (March 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions rolling.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Senior secondary qualification equivalent to Australian Year 12.",
      language: "IELTS 6.0-6.5 equivalent or senior high school English qualification.",
      documents: [
        "High School Transcripts",
        "Passport Bio Page",
        "Statement of Purpose"
      ]
    },
    studyFields: [
      "Aviation & Aerospace",
      "Artificial Intelligence",
      "Design & Architecture",
      "Software Engineering",
      "Business Analytics"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "A world-ranked tech leader based in Melbourne, internationally acclaimed for design innovation, advanced manufacturing, and aviation programs.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "jcu-australia",
    officialName: "James Cook University",
    institution: "James Cook University",
    shortName: "JCU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Townsville & Cairns, Queensland",
    officialWebsite: "https://www.jcu.edu.au",
    sourceUrl: "https://www.jcu.edu.au/international-students",
    officialUrl: "https://www.jcu.edu.au/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "JCU International Excellence Scholarship (25% tuition fee waiver)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002B49",
      text: "#FFFFFF",
      monogram: "JCU",
      crestColor: "#002B49",
      logoDescription: "James Cook University Deep Navy & Marine Blue Crest",
      "logoUrl": "/logos/jcu-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students from all eligible nations commencing studies in Queensland.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "25% tuition fee waiver for the entire duration of the course",
      details: "Awarded to high-achieving international applicants upon unconditional offer.",
      tuitionCoverage: "25% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Waiver",
      details: "Applicable for degree duration subject to academic standing."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero application fee for international direct applicants.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC/WASSCE English C6 or higher recognized for undergraduate admissions.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC English C6 satisfies language criteria."
    },
    deadlines: {
      term: "Teaching Period 1 (February 2027)",
      deadlineText: "International Deadline: January 10, 2027",
      deadlineDate: "2027-01-10",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 10, 2027",
    deadlineDate: "2027-01-10",
    admissionsRequirements: {
      academic: "Secondary credential equivalent to Australian ATAR 65-80 depending on major.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Certificate of Completion",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Marine Biology & Coral Reef Ecology",
      "Tropical Health & Medicine",
      "Environmental Science",
      "Veterinary Science",
      "Tourism"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in the world for Marine & Freshwater Biology (CWUR), situated alongside the Great Barrier Reef and the Daintree Rainforest.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "unisa-australia",
    officialName: "University of South Australia",
    institution: "University of South Australia",
    shortName: "UniSA",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Adelaide, South Australia",
    officialWebsite: "https://www.unisa.edu.au",
    sourceUrl: "https://international.unisa.edu.au",
    officialUrl: "https://international.unisa.edu.au",
    category: "university",
    institutionType: 'Public University',
    title: "Vice-Chancellor's International Excellence Scholarship (50% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00205B",
      text: "#FFFFFF",
      monogram: "UniSA",
      crestColor: "#00205B",
      logoDescription: "UniSA Royal Navy Blue & Red Emblem",
      "logoUrl": "/logos/unisa-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing full-time undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "50% tuition reduction (VC Scholarship) & 15% International Merit Scholarship",
      details: "Merit-based tuition waiver awarded on entry marks.",
      tuitionCoverage: "Up to 50% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "15% to 50% Tuition Reduction",
      details: "Automatic 15% merit grant, 50% VC scholarship for top tier."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Online applications through UniSA international portal are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies undergraduate English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC English C6 accepted."
    },
    deadlines: {
      term: "Study Period 2 (March 2027)",
      deadlineText: "Application Deadline: December 15, 2026",
      deadlineDate: "2026-12-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "December 15, 2026",
    deadlineDate: "2026-12-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting program ATAR equivalent.",
      language: "Proof of English language proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page",
        "Evidence of English Proficiency"
      ]
    },
    studyFields: [
      "Aviation",
      "Pharmacy & Medical Sciences",
      "Civil & Structural Engineering",
      "Business & Enterprise",
      "Cybersecurity"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "South Australia's largest university, ranked #1 in SA for graduate employability with strong industry partnerships in defense, aviation, and tech.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "murdoch-australia",
    officialName: "Murdoch University",
    institution: "Murdoch University",
    shortName: "Murdoch",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Perth, Western Australia",
    officialWebsite: "https://www.murdoch.edu.au",
    sourceUrl: "https://www.murdoch.edu.au/study/international-students",
    officialUrl: "https://www.murdoch.edu.au/study/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "Murdoch International Welcome Scholarship (20% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#B5121B",
      text: "#FFFFFF",
      monogram: "MURD",
      crestColor: "#B5121B",
      logoDescription: "Murdoch University Red & Black Shield",
      logoUrl: '/logos/murdoch-australia.png',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Murdoch_University_extended_logo.png'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "International students commencing studies at Murdoch University's Perth campuses.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% tuition fee reduction across degree",
      details: "Automatic 20% tuition waiver for eligible international students.",
      tuitionCoverage: "20% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Tuition Fee Reduction",
      details: "Welcome scholarship granted automatically upon offer."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero application fee for international direct applicants.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 accepted for undergraduate coursework.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "Application Deadline: January 10, 2027",
      deadlineDate: "2027-01-10",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 10, 2027",
    deadlineDate: "2027-01-10",
    admissionsRequirements: {
      academic: "Secondary school certificate meeting ATAR equivalent.",
      language: "WASSCE/WAEC English C6 or IELTS 6.0.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Veterinary Science",
      "Renewable Energy Engineering",
      "Biotechnology",
      "Criminology",
      "Environmental Science"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Houses Western Australia's only veterinary school with on-campus farm and wildlife hospital, internationally recognized for sustainability and environmental research.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "ecu-australia",
    officialName: "Edith Cowan University",
    institution: "Edith Cowan University",
    shortName: "ECU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Perth, Western Australia",
    officialWebsite: "https://www.ecu.edu.au",
    sourceUrl: "https://www.ecu.edu.au/international",
    officialUrl: "https://www.ecu.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "ECU International Masters / Undergraduate Scholarship (20% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000000",
      text: "#FFFFFF",
      monogram: "ECU",
      crestColor: "#FF6600",
      logoDescription: "Edith Cowan University Black & Orange Flame Emblem",
      "logoUrl": "/logos/ecu-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students from all eligible nations commencing undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% reduction on tuition fees for the duration of the course",
      details: "Automatic 20% tuition discount applied directly to semester invoices.",
      tuitionCoverage: "20% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Tuition Fee Reduction",
      details: "International undergraduate and postgraduate merit discount."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero application fee for international direct applicants.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies standard English criteria.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Cybersecurity & Security Studies",
      "Performing Arts (WAAPA)",
      "Nursing",
      "Motorsport Engineering",
      "Computer Science"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Recognized as an Australian Cyber Security Centre (ACSC) Academic Centre of Cyber Security Excellence and home of WAAPA, one of the world’s premier performing arts academies.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "cdu-australia",
    officialName: "Charles Darwin University",
    institution: "Charles Darwin University",
    shortName: "CDU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Darwin, Northern Territory",
    officialWebsite: "https://www.cdu.edu.au",
    sourceUrl: "https://www.cdu.edu.au/international",
    officialUrl: "https://www.cdu.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "CDU Vice-Chancellor's International High Achievers Scholarship (up to 50% fee discount)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7B1113",
      text: "#FFFFFF",
      monogram: "CDU",
      crestColor: "#7B1113",
      logoDescription: "Charles Darwin University Ochre Red & Sand Emblem",
      "logoUrl": "/logos/cdu-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying to CDU in Darwin.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "25% to 50% tuition fee reduction",
      details: "VCIHAS provides 50% fee reduction; Global Leader Scholarship provides 25% fee reduction.",
      tuitionCoverage: "Up to 50% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% to 50% Tuition Fee Reduction",
      details: "Generous Northern Territory regional study scholarships."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "No application fee for direct international applicants.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (March 2027)",
      deadlineText: "International Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Tropical & Desert Knowledge",
      "Indigenous Studies",
      "Environmental Science",
      "Engineering",
      "Nursing & Midwifery"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's northernmost university, internationally renowned for tropical science, Indigenous community development, and top graduate salary rankings.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "unisq-australia",
    officialName: "University of Southern Queensland",
    institution: "University of Southern Queensland",
    shortName: "UniSQ",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Toowoomba, Springfield & Ipswich, Queensland",
    officialWebsite: "https://www.unisq.edu.au",
    sourceUrl: "https://www.unisq.edu.au/international",
    officialUrl: "https://www.unisq.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "International Student Support Scholarship (up to 20% tuition reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#F26522",
      text: "#000000",
      monogram: "UniSQ",
      crestColor: "#F26522",
      logoDescription: "UniSQ Sun Orange & Charcoal Geometric Emblem",
      "logoUrl": "/logos/unisq-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing full-time studies on-campus.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "10% to 20% tuition fee reduction across degree duration",
      details: "Applied directly to reduce per-semester international fees.",
      tuitionCoverage: "10% to 20% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "10% to 20% Tuition Fee Reduction",
      details: "Automatic assessment during application evaluation."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online applications are free of charge.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies undergraduate English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary qualification meeting Australian Year 12 equivalence.",
      language: "Proof of English language proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Astrophysics & Space Science",
      "Agricultural Engineering",
      "Civil Engineering & Surveying",
      "Aviation",
      "Nursing"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Home to Mount Kent Observatory (NASA partner for exoplanet discovery) and ranked #1 in Australia for graduate starting salaries (Good Universities Guide).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "usc-australia",
    officialName: "University of the Sunshine Coast",
    institution: "University of the Sunshine Coast",
    shortName: "UniSC",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sunshine Coast, Queensland",
    officialWebsite: "https://www.usc.edu.au",
    sourceUrl: "https://www.usc.edu.au/international",
    officialUrl: "https://www.usc.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "UniSC International Student Scholarship (15% tuition fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00685B",
      text: "#FFFFFF",
      monogram: "UniSC",
      crestColor: "#00685B",
      logoDescription: "UniSC Coastal Teal & Gold Sunburst Emblem",
      logoUrl: '/logos/usc-australia.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Logo_University_of_the_Sunshine_Coast.svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students commencing undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "15% tuition fee reduction across course duration",
      details: "Automatically awarded upon issuance of international offer letter.",
      tuitionCoverage: "15% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "15% Tuition Fee Reduction",
      details: "Automatic grant for all eligible commencing international students."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online application is free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 10, 2027",
      deadlineDate: "2027-01-10",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 10, 2027",
    deadlineDate: "2027-01-10",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Sports Science & Paralympic Research",
      "Ecology & Sustainability",
      "Animal Ecology",
      "Biomedical Science",
      "Law"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in Queensland for overall student satisfaction and globally recognized for sustainability, Olympic and Paralympic training facilities, and coastal ecology research.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "scu-australia",
    officialName: "Southern Cross University",
    institution: "Southern Cross University",
    shortName: "SCU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Gold Coast, Lismore & Coffs Harbour, NSW/QLD",
    officialWebsite: "https://www.scu.edu.au",
    sourceUrl: "https://www.scu.edu.au/international",
    officialUrl: "https://www.scu.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Vice Chancellor's Academic Excellence Scholarship (AUD $8,000 per year)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003A70",
      text: "#FFFFFF",
      monogram: "SCU",
      crestColor: "#003A70",
      logoDescription: "Southern Cross University Deep Navy & Gold Constellation Crest",
      logoUrl: '/logos/scu-australia.png',
      logoSourceUrl: 'https://www.scu.edu.au/'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for full-time on-campus study.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "AUD $8,000 fee reduction per year (up to AUD $32,000 across degree)",
      details: "Merit-based international scholarship credited towards each semester's tuition.",
      tuitionCoverage: "AUD $8,000 per year"
    },
    funding: {
      type: "Partial / Merit",
      amount: "AUD $8,000 Fee Reduction Per Year",
      details: "Merit-based scholarship credited annually."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct international online applications are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 or higher satisfies English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Term 1 (March 2027)",
      deadlineText: "Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions rolling.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English language proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Marine Science & Ocean Engineering",
      "Forestry & Plant Science",
      "Regenerative Agriculture",
      "Tourism & Hospitality",
      "Nursing"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Pioneers the unique Southern Cross Model (six 6-week study terms per year) and ranked 'well above world standard' in 14 research fields (ERA).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "canberra-australia",
    officialName: "University of Canberra",
    institution: "University of Canberra",
    shortName: "UC",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Canberra, Australian Capital Territory",
    officialWebsite: "https://www.canberra.edu.au",
    sourceUrl: 'https://www.canberra.edu.au/future-students/apply-to-uc',
    officialUrl: 'https://www.canberra.edu.au/future-students/apply-to-uc',
    category: "university",
    institutionType: 'Public University',
    title: "UC International Course Merit Scholarship (up to 25% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#007A87",
      text: "#FFFFFF",
      monogram: "UC",
      crestColor: "#007A87",
      logoDescription: "University of Canberra Ochre Teal & Slate Geometric Monogram",
      logoUrl: '/logos/canberra-australia.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Logo_der_University_of_Canberra.svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "10% to 25% tuition fee reduction across entire degree",
      details: "Tiered scholarship awarded automatically on academic merit at the point of offer.",
      tuitionCoverage: "10% to 25% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "10% to 25% Tuition Fee Reduction",
      details: "Automatic course merit scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Online applications for international students are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English language proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Sports Integrity & Sports Science",
      "Public Policy & Governance",
      "Software Engineering",
      "Physiotherapy",
      "Graphic Design"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in the ACT for full-time graduate employment (Good Universities Guide), with close proximity to Australia’s federal government agencies and embassies.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "csu-australia",
    officialName: "Charles Sturt University",
    institution: "Charles Sturt University",
    shortName: "CSU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Bathurst, Wagga Wagga & Orange, NSW",
    officialWebsite: "https://www.csu.edu.au",
    sourceUrl: "https://www.csu.edu.au/international",
    officialUrl: "https://www.csu.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Charles Sturt International Student Support Scholarship (up to 25% fee waiver)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C41230",
      text: "#FFFFFF",
      monogram: "CSU",
      crestColor: "#C41230",
      logoDescription: "Charles Sturt University Cardinal Red & Black Shield",
      "logoUrl": "/logos/csu-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students studying at regional NSW campuses.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% to 25% tuition fee reduction across course duration",
      details: "Regional location scholarship providing substantial tuition support.",
      tuitionCoverage: "20% to 25% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% to 25% Tuition Fee Reduction",
      details: "Applied per session across the degree."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free direct online application.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Session 1 (March 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate meeting ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: [
        "Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Veterinary Science & Agriculture",
      "Medical Radiation Science",
      "Information Technology",
      "Policing & Security",
      "Wine Science"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia’s #1 university for graduate employment for eight consecutive years, with an outstanding 87% full-time employment rate (QILT).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "une-australia",
    officialName: "University of New England",
    institution: "University of New England",
    shortName: "UNE",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Armidale, New South Wales",
    officialWebsite: "https://www.une.edu.au",
    sourceUrl: "https://www.une.edu.au/study/international-students",
    officialUrl: "https://www.une.edu.au/study/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "UNE Sydney / Armidale International Bursary (up to AUD $10,000 per year)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00552B",
      text: "#FFFFFF",
      monogram: "UNE",
      crestColor: "#00552B",
      logoDescription: "University of New England Heritage Green & Gold Shield",
      logoUrl: '/logos/une-australia.svg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Logo_of_the_University_of_New_England_(Australia).svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing full-time studies.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Up to AUD $10,000 per year fee reduction",
      details: "International bursary credited against tuition fees.",
      tuitionCoverage: "Up to AUD $10,000 per year"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to AUD $10,000 Fee Reduction Per Year",
      details: "Bursaries awarded automatically upon admission."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Zero fee for direct international online applications.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Trimester 1 (March 2027)",
      deadlineText: "Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions rolling.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Agriculture & Rural Science",
      "Genetics & Animal Breeding",
      "Pharmacy",
      "Law",
      "Environmental Management"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia’s first regional university, renowned worldwide for livestock genetics, precision agriculture, and having the maximum 5-star rating for overall student experience (Good Universities Guide).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "vu-australia",
    officialName: "Victoria University",
    institution: "Victoria University",
    shortName: "VU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Melbourne, Victoria",
    officialWebsite: "https://www.vu.edu.au",
    sourceUrl: "https://www.vu.edu.au/international-students",
    officialUrl: "https://www.vu.edu.au/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "VU International Scholarship (up to 20% tuition fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002B49",
      text: "#FFFFFF",
      monogram: "VU",
      crestColor: "#FFC72C",
      logoDescription: "Victoria University Navy & Gold Monogram Emblem",
      logoUrl: '/logos/vu-australia.svg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Victoria_University_(Australia)_logo.svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international candidates commencing undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% reduction on tuition fees for the first two semesters",
      details: "Awarded automatically to commencing international students.",
      tuitionCoverage: "20% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% Tuition Fee Reduction",
      details: "Automatic grant for commencing international students."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online applications are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies undergraduate English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting program ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Sports Science & Exercise",
      "Engineering (Civil, Electrical)",
      "Early Childhood Education",
      "Information Technology",
      "Business Analytics"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Globally acclaimed for the award-winning VU Block Model (studying one subject at a time in small classes) and ranked #7 in the world for Sports Science (ShanghaiRanking).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "federation-australia",
    officialName: "Federation University Australia",
    institution: "Federation University Australia",
    shortName: "FedUni",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Ballarat, Berwick & Churchill, Victoria",
    officialWebsite: "https://federation.edu.au",
    sourceUrl: "https://federation.edu.au/international",
    officialUrl: "https://federation.edu.au/international",
    category: "university",
    institutionType: 'Public University',
    title: "Global Innovator Scholarship (up to 25% tuition fee waiver)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00205B",
      text: "#FFFFFF",
      monogram: "FED",
      crestColor: "#00205B",
      logoDescription: "Federation University Navy & Gold Cross Shield",
      "logoUrl": "/logos/federation-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% to 25% tuition fee waiver across degree duration",
      details: "Automatically applied to international tuition fees upon admission.",
      tuitionCoverage: "20% to 25% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% to 25% Tuition Fee Waiver",
      details: "Automatic merit-based scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Free direct online applications.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (March 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Mining & Geotechnical Engineering",
      "Data Science & IT",
      "Nursing & Paramedicine",
      "Environmental Science",
      "Secondary Education"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Victoria’s premier regional university, tracing roots back to the 1870 Ballarat School of Mines, ranked #1 in Victoria for student support and skills development.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "acu-australia",
    officialName: "Australian Catholic University",
    institution: "Australian Catholic University",
    shortName: "ACU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Sydney, Melbourne, Brisbane & Canberra",
    officialWebsite: "https://www.acu.edu.au",
    sourceUrl: "https://www.acu.edu.au/international-students",
    officialUrl: "https://www.acu.edu.au/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "ACU International Student Scholarship (up to 50% tuition waiver)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7B1113",
      text: "#FFFFFF",
      monogram: "ACU",
      crestColor: "#7B1113",
      logoDescription: "Australian Catholic University Maroon & Gold Cross Crest",
      logoUrl: '/logos/acu-australia.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Logo_AustralianCatholicUniversity.svg'
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all religious and secular backgrounds worldwide.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "50% tuition fee waiver for up to 20 commencing international students each year",
      details: "Competitive merit scholarship based on academic excellence.",
      tuitionCoverage: "50% tuition fee waiver"
    },
    funding: {
      type: "Partial / Merit",
      amount: "50% Tuition Fee Waiver",
      details: "Competitive academic merit scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "AUD $110 international application fee.",
      amount: "AUD $110"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "AUD $110 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Nursing & Healthcare",
      "Education & Teaching",
      "Theology & Philosophy",
      "Physiotherapy & Sports Science",
      "Business"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 in Australia for graduate employment in Nursing and Education and top 50 in the world for Nursing (ShanghaiRanking).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "bond-australia",
    officialName: "Bond University",
    institution: "Bond University",
    shortName: "Bond",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Robina, Gold Coast, Queensland",
    officialWebsite: "https://bond.edu.au",
    sourceUrl: "https://bond.edu.au/intl",
    officialUrl: "https://bond.edu.au/intl",
    category: "university",
    institutionType: 'Private University',
    title: "Bond International Stand Out Scholarship (up to 50% tuition reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00205B",
      text: "#FFFFFF",
      monogram: "BOND",
      crestColor: "#FFC72C",
      logoDescription: "Bond University Navy & Gold Arch Shield",
      "logoUrl": "/logos/bond-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to high-achieving international applicants to undergraduate and postgraduate degrees.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Up to 50% tuition fee reduction across degree",
      details: "Competitive merit scholarship based on outstanding high school or university marks.",
      tuitionCoverage: "Up to 50% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to 50% Tuition Fee Reduction",
      details: "Merit-based international stand out scholarship."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online applications to Bond University are 100% free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee for direct online applications."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "January Semester 2027",
      deadlineText: "Application Deadline: November 15, 2026",
      deadlineDate: "2026-11-15",
      cycleStatus: "open",
      statusNotice: "Admissions rolling.",
      isRolling: true
    },
    deadline: "November 15, 2026",
    deadlineDate: "2026-11-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12 ATAR 70-90.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page",
        "Resume & References"
      ]
    },
    studyFields: [
      "Law & Advocacy",
      "Actuarial Science",
      "Medicine & Health Sciences",
      "Business & Finance",
      "Architecture"
    ],
    intakeTerm: "January 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia's first private not-for-profit university, renowned for accelerated 3-semester per year degrees, 10:1 student-to-staff ratio, and #1 ranking for student experience for 18 consecutive years.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "notredame-australia",
    officialName: "The University of Notre Dame Australia",
    institution: "The University of Notre Dame Australia",
    shortName: "Notre Dame",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Fremantle & Broome, WA / Sydney, NSW",
    officialWebsite: "https://www.notredame.edu.au",
    sourceUrl: "https://www.notredame.edu.au/international",
    officialUrl: "https://www.notredame.edu.au/international",
    category: "university",
    institutionType: 'Private University',
    title: "International Merit Scholarship (20% to 25% annual fee waiver)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0C2340",
      text: "#FFFFFF",
      monogram: "UNDA",
      crestColor: "#C99700",
      logoDescription: "Notre Dame Australia Navy & Gold Open Book Star Shield",
      "logoUrl": "/logos/notredame-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students applying for undergraduate or postgraduate coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "20% to 25% annual tuition reduction",
      details: "Awarded automatically on academic achievement at the time of offer.",
      tuitionCoverage: "20% to 25% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "20% to 25% Tuition Fee Reduction",
      details: "Merit scholarship applied per semester."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online international applications are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Semester 1 (February 2027)",
      deadlineText: "International Application Deadline: December 1, 2026",
      deadlineDate: "2026-12-01",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "December 1, 2026",
    deadlineDate: "2026-12-01",
    admissionsRequirements: {
      academic: "Secondary credential meeting degree ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Medicine & Health Sciences",
      "Law",
      "Nursing & Midwifery",
      "Education",
      "Philosophy & Liberal Arts"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned for pastoral care, small seminar classes, and consistently ranking top 3 in Australia for overall educational experience and skills development (QILT).",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "torrens-australia",
    officialName: "Torrens University Australia",
    institution: "Torrens University Australia",
    shortName: "Torrens",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Adelaide, Sydney, Melbourne & Brisbane",
    officialWebsite: "https://www.torrens.edu.au",
    sourceUrl: "https://www.torrens.edu.au/international",
    officialUrl: "https://www.torrens.edu.au/international",
    category: "university",
    institutionType: 'Private University',
    title: "Torrens International Opportunity Scholarship (up to 30% fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#101820",
      text: "#FFFFFF",
      monogram: "TORR",
      crestColor: "#FF5C39",
      logoDescription: "Torrens University Charcoal & Coral Tech Emblem",
      "logoUrl": "/logos/torrens-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international candidates commencing degree studies across Australian campuses.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "15% to 30% reduction on total tuition fees",
      details: "Tiered scholarship awarded based on academic grades and country of citizenship.",
      tuitionCoverage: "15% to 30% tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "15% to 30% Tuition Fee Reduction",
      details: "Opportunity and merit scholarships awarded on admission."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online applications are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Zero fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Trimester 1 (February 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Australian Year 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Game Design & Development (Media Design School)",
      "Hospitality & Hotel Management (Blue Mountains)",
      "Business",
      "Public Health",
      "Interior Design"
    ],
    intakeTerm: "February 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia’s fastest-growing university, incorporating the legendary Blue Mountains International Hotel Management School and Billy Blue College of Design.",
    officialRuleSummary: "Accredited by TEQSA."
  },
  {
    id: "cqu-australia",
    officialName: "CQUniversity Australia",
    institution: "CQUniversity Australia",
    shortName: "CQU",
    country: "Australia",
    countryCode: "AU",
    countryFlag: "🇦🇺",
    city: "Rockhampton, Brisbane, Sydney & Melbourne",
    officialWebsite: "https://www.cqu.edu.au",
    sourceUrl: "https://www.cqu.edu.au/international-students",
    officialUrl: "https://www.cqu.edu.au/international-students",
    category: "university",
    institutionType: 'Public University',
    title: "International Student Scholarship (up to 25% tuition fee reduction)",
    isVerified: true,
    verificationSource: "Tertiary Education Quality and Standards Agency (TEQSA), Australia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#005587",
      text: "#FFFFFF",
      monogram: "CQU",
      crestColor: "#005587",
      logoDescription: "CQUniversity Teal Navy & Cyan Radiant Star Emblem",
      "logoUrl": "/logos/cqu-australia.png"
    },
    eligibilityCountries: [
      "Australia",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for full degree coursework.",
      eligibleRegions: [
        "Global",
        "Oceania",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate",
      "Doctorate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "25% tuition fee reduction for the entire duration of the course",
      details: "Automatic 25% fee waiver for all eligible commencing undergraduate and postgraduate students.",
      tuitionCoverage: "25% tuition fee reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "25% Tuition Fee Reduction",
      details: "Granted automatically with the letter of offer."
    },
    applicationFees: {
      status: "Free ($0 Fee)",
      details: "Direct online applications are free.",
      amount: "AUD $0"
    },
    applicationFee: {
      status: "Free ($0 Fee)",
      details: "Free direct online application."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher satisfies English requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Term 1 (March 2027)",
      deadlineText: "International Application Deadline: January 15, 2027",
      deadlineDate: "2027-01-15",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "January 15, 2027",
    deadlineDate: "2027-01-15",
    admissionsRequirements: {
      academic: "Secondary credential meeting program ATAR equivalent.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Aviation",
      "Engineering (Civil, Mechanical, Mining)",
      "Nursing & Paramedicine",
      "Information Technology",
      "Business"
    ],
    intakeTerm: "March 2027",
    verifiedBadge: "Verified Official Data",
    summary: "Australia’s first Ashoka U Changemaker Campus, renowned for hands-on vocational integration, multiple metropolitan and regional campuses, and strong graduate employment rates.",
    officialRuleSummary: "Accredited by TEQSA."
  }
];
