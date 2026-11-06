import type { OpportunityItem } from "./opportunities";

export const canadaUniversities: OpportunityItem[] = [
  {
    id: "ualberta-canada",
    officialName: "University of Alberta",
    institution: "University of Alberta",
    shortName: "UAlberta",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Edmonton, Alberta",
    officialWebsite: "https://www.ualberta.ca",
    sourceUrl: "https://www.ualberta.ca/admissions/undergraduate/index.html",
    officialUrl: "https://www.ualberta.ca/admissions/undergraduate/index.html",
    category: "university",
    institutionType: "International",
    title: "University of Alberta Global Undergraduate Admissions & Entrance Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Alberta Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#007C41",
      text: "#FFDB00",
      monogram: "UofA",
      crestColor: "#007C41",
      logoDescription: "University of Alberta Evergreen & Gold Crest",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "United States", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students worldwide holding recognized high school diplomas (WASSCE, KCSE, GCE A-Levels, IB, US Diploma).",
      eligibleRegions: ["Global", "Africa", "North America", "Commonwealth"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "President's International Distinction Scholarship (up to CAD $120,000 over 4 years)",
      details: "Multiple renewable awards up to $30,000/year for top-entering international students with superior admission averages.",
      tuitionCoverage: "Substantial tuition reduction via merit scholarship",
      livingStipend: "Living allowance awards available for high academic achievers"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $120,000 over 4 years",
      details: "President's International Distinction Scholarship awarded automatically upon admission."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 undergraduate application fee for international secondary applicants.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 international application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Graduates from English-medium schools or countries with English as an official language can qualify for ELP exemption with B3+ in WAEC/WASSCE English.",
      satPolicy: "SAT/ACT not required for Canadian/African high school applicants.",
      englishProficiencyPolicy: "B3 in WASSCE English fulfills English Language Proficiency (ELP) requirements."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "B3 in WASSCE English satisfies English proficiency requirement."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "International Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open for Fall 2026 intake.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "High school completion with 5 academic Grade 12 subjects (minimum overall equivalent average 75%+ for general faculties, 85%+ for engineering/computing).",
      language: "WASSCE English (B3 or better) or IELTS (6.5 minimum) or Duolingo (120+).",
      documents: ["Official High School Transcripts", "Predicted / Final Exam Results", "English Proficiency Proof"]
    },
    studyFields: [
      "Artificial Intelligence & Computer Science",
      "Petroleum & Chemical Engineering",
      "Biological Sciences",
      "Business & Economics",
      "Environmental & Conservation Sciences"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Canada's top 5 U15 research powerhouses, internationally acclaimed for artificial intelligence, machine learning (Amii), and energy research.",
    officialRuleSummary: "Accredited member of Universities Canada and the U15 Group of Canadian Research Universities."
  },
  {
    id: "mcmaster-university-canada",
    officialName: "McMaster University",
    institution: "McMaster University",
    shortName: "McMaster",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Hamilton, Ontario",
    officialWebsite: "https://www.mcmaster.ca",
    sourceUrl: "https://future.mcmaster.ca",
    officialUrl: "https://future.mcmaster.ca",
    category: "university",
    institutionType: "International",
    title: "McMaster University Health Sciences, Engineering & Admissions",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7A003C",
      text: "#FDBF57",
      monogram: "MAC",
      crestColor: "#7A003C",
      logoDescription: "McMaster Maroon & Heritage Gold Heraldic Seal",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "McMaster Global Excellence Award (CAD $10,000 to $20,000)",
      details: "Automatic entrance scholarships for top international students, plus faculty-specific awards.",
      tuitionCoverage: "Merit-based tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $20,000 Entrance Award",
      details: "Global Excellence Award awarded on academic performance."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "Applied via OUAC (Ontario Universities' Application Centre) standard fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3+ years in English-curriculum secondary school waives language testing.",
      satPolicy: "SAT optional for US/international applicants."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "English instruction waiver or WASSCE B3."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "OUAC Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active for Fall 2026.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Competitive Grade 12 or equivalent secondary credential with 5 university-preparatory courses.",
      language: "Proof of English proficiency unless eligible for secondary school waiver.",
      documents: ["OUAC Application", "High School Transcripts", "Supplementary Application (for Health Sci / Eng)"]
    },
    studyFields: ["Health Sciences", "Software & Mechatronics Engineering", "Biomedical Discovery", "Commerce", "Life Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "World-famous inventor of problem-based learning and home to one of North America's most prestigious Health Sciences faculties.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "waterloo-canada",
    officialName: "University of Waterloo",
    institution: "University of Waterloo",
    shortName: "Waterloo",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Waterloo, Ontario",
    officialWebsite: "https://uwaterloo.ca",
    sourceUrl: "https://uwaterloo.ca/future-students",
    officialUrl: "https://uwaterloo.ca/future-students",
    category: "university",
    institutionType: "International",
    title: "University of Waterloo Computer Science, Co-op & Engineering Admissions",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000000",
      text: "#E0B700",
      monogram: "UW",
      crestColor: "#000000",
      logoDescription: "Waterloo Black & Gold Chevron Seal",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Global admissions with renowned paid co-operative work experience programs.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Paid Co-op Program ($45,000–$85,000 earned over degree) + Entrance Scholarships",
      details: "World's largest co-op education program lets students earn substantial wages while studying to fund tuition.",
      tuitionCoverage: "Paid co-op work terms offset tuition costs"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Paid Co-op Earnings ($45k–$85k) + Entrance Scholarships",
      details: "Students earn during alternating 4-month paid co-op work terms."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Students studying in English-medium high schools for 3+ years are exempt from IELTS/TOEFL.",
      satPolicy: "SAT optional; Euclid Math Contest strongly recommended for Math/CS."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "Secondary school English-medium waiver applies."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "OUAC Application: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "High school completion with required senior Math and Science prerequisites (Calculus, Advanced Functions, Physics).",
      language: "IELTS 6.5 / TOEFL 90 or English secondary school waiver.",
      documents: ["High School Transcripts", "Admission Information Form (AIF)", "Euclid / CCC Contest Results"]
    },
    studyFields: ["Computer Science", "Software Engineering", "Quantum Information", "Actuarial Science", "Nanotechnology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's top technology and innovation university, globally famous for running the largest post-secondary co-operative education program in the world.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "western-university-canada",
    officialName: "Western University",
    institution: "Western University",
    shortName: "Western",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "London, Ontario",
    officialWebsite: "https://www.uwo.ca",
    sourceUrl: "https://welcome.uwo.ca",
    officialUrl: "https://welcome.uwo.ca",
    category: "university",
    institutionType: "International",
    title: "Western University Ivey Business, Science & Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#4F2683",
      text: "#FFFFFF",
      monogram: "UWO",
      crestColor: "#4F2683",
      logoDescription: "Western University Purple & Silver Crest",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International President's Entrance Scholarship (CAD $50,000)",
      details: "Three scholarships valued at $50,000 ($20,000 Year 1, $10,000/yr renewable) awarded to top international secondary applicants.",
      tuitionCoverage: "CAD $50,000 merit award"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $50,000 President's Scholarship",
      details: "Competitive international entrance scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "High school English proficiency waiver available for English curriculum graduates.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "English instruction waiver available."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "International Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary school graduation with minimum 80%+ equivalent in prerequisite subjects.",
      language: "IELTS 6.5 or equivalent English education waiver.",
      documents: ["High School Transcripts", "Ivey AEO Application (if applying to Business)"]
    },
    studyFields: ["Ivey Business Administration (HBA)", "Medical Sciences", "Software Engineering", "Neuroscience", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Canada's oldest research universities, home to the world-renowned Ivey Business School and leading neuroscience institutes.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "ucalgary-canada",
    officialName: "University of Calgary",
    institution: "University of Calgary",
    shortName: "UCalgary",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Calgary, Alberta",
    officialWebsite: "https://www.ucalgary.ca",
    sourceUrl: "https://www.ucalgary.ca/future-students/undergraduate",
    officialUrl: "https://www.ucalgary.ca/future-students/undergraduate",
    category: "university",
    institutionType: "International",
    title: "University of Calgary Engineering, Business & Global Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Alberta Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C8102E",
      text: "#FFCD00",
      monogram: "UofC",
      crestColor: "#C8102E",
      logoDescription: "UCalgary Red & Gold Bull and Cross Seal",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Welcomes international students worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "University of Calgary International Entrance Scholarship (CAD $80,000 over 4 years)",
      details: "Valued at $20,000 per year renewable for up to four years, awarded on academic merit and leadership.",
      tuitionCoverage: "CAD $20,000/year renewable scholarship"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $80,000 over 4 years ($20,000/yr)",
      details: "Renewable International Entrance Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $145 international application fee.",
      amount: "CAD $145"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $145 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English with B3 or higher satisfies English language proficiency.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "5 Grade 12 or equivalent courses including subject prerequisites.",
      language: "Proof of English proficiency (WASSCE B3 or IELTS 6.5).",
      documents: ["Transcripts", "Scholarship Application"]
    },
    studyFields: ["Schulich Engineering", "Haskayne School of Business", "Veterinary Medicine", "Kinesiology", "Geoscience"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's top young research university in Calgary's corporate hub, recognized globally for energy transition, biomedical engineering, and business.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "uottawa-canada",
    officialName: "University of Ottawa",
    institution: "University of Ottawa",
    shortName: "uOttawa",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Ottawa, Ontario",
    officialWebsite: "https://www.uottawa.ca",
    sourceUrl: "https://www.uottawa.ca/study",
    officialUrl: "https://www.uottawa.ca/study",
    category: "university",
    institutionType: "International",
    title: "University of Ottawa Bilingual Degree Programs & French Differential Fee Exemption",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#8F001A",
      text: "#80746C",
      monogram: "uO",
      crestColor: "#8F001A",
      logoDescription: "uOttawa Garnet & Grey Two-Toned Emblem",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students. International students who study in French benefit from Canadian domestic tuition rates via the Differential Tuition Fee Exemption.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Tuition Waiver",
      amount: "Differential Tuition Fee Exemption (Save CAD $20,000–$30,000/year)",
      details: "International students enrolled in French-immersion or French-language programs pay Canadian domestic tuition rates, saving tens of thousands of dollars annually.",
      tuitionCoverage: "Subsidized to Canadian domestic tuition rates"
    },
    funding: {
      type: "Tuition Waiver",
      amount: "Differential Tuition Exemption (Domestic Rates)",
      details: "French study differential tuition exemption reduces fees to domestic rates."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English or French DELF/DALF satisfies language requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WAEC English or French DELF accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary school diploma with 5 qualifying senior subjects.",
      language: "Proof of English or French language proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Public Policy & International Affairs", "Law (Common & Civil Law)", "Computer Science", "Biomedical Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The world's largest bilingual (English-French) university, located in Canada's national capital next to Parliament Hill.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "queens-university-canada",
    officialName: "Queen's University",
    institution: "Queen's University",
    shortName: "Queen's",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Kingston, Ontario",
    officialWebsite: "https://www.queensu.ca",
    sourceUrl: "https://www.queensu.ca/admission",
    officialUrl: "https://www.queensu.ca/admission",
    category: "university",
    institutionType: "International",
    title: "Queen's University Smith Commerce, Health & Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Royal Charter",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002452",
      text: "#FABD0F",
      monogram: "QU",
      crestColor: "#002452",
      logoDescription: "Queen's Royal Crown, Open Book & Saltire Shield",
          },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Principal's International Scholarship (CAD $10,000–$25,000)",
      details: "Renewable entrance scholarships for top international secondary scholars.",
      tuitionCoverage: "Merit tuition awards"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $25,000/yr",
      details: "Principal's International Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Secondary school English-medium waiver available for 3+ years in English.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "English instruction waiver available."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "OUAC Application: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Secondary school graduation with high standing in prerequisite courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Supplementary Essay (for Commerce and Health)"]
    },
    studyFields: ["Smith Commerce (BCom)", "Health Sciences", "Computing", "Civil & Mechanical Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Chartered by Queen Victoria in 1841, one of Canada's oldest and most prestigious institutions, famed for the Smith School of Business.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "dalhousie-university-canada",
    officialName: "Dalhousie University",
    institution: "Dalhousie University",
    shortName: "Dalhousie",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Halifax, Nova Scotia",
    officialWebsite: "https://www.dal.ca",
    sourceUrl: "https://www.dal.ca/admissions.html",
    officialUrl: "https://www.dal.ca/admissions.html",
    category: "university",
    institutionType: "International",
    title: "Dalhousie University Ocean Sciences, Medicine & Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Nova Scotia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#242424",
      text: "#FFD400",
      monogram: "DAL",
      crestColor: "#242424",
      logoDescription: "Dalhousie Black & Gold Eagle and Cross Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Renewable General Entrance Awards (up to CAD $40,000 over 4 years)",
      details: "Merit scholarships awarded to top entrants, renewable based on GPA.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "Renewable General Entrance Awards."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $70 direct application fee.",
      amount: "CAD $70"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $70 direct fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or higher waives IELTS/TOEFL requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application & Scholarship Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "5 Grade 12 or senior secondary subjects with minimum 75% average.",
      language: "WASSCE English B3 or IELTS 6.5.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Oceanography & Marine Biology", "Computer Science", "Engineering", "Medicine", "Management"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The flagship U15 research university of Atlantic Canada, world leader in ocean research, sustainability, and maritime engineering.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "sfu-canada",
    officialName: "Simon Fraser University",
    institution: "Simon Fraser University",
    shortName: "SFU",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Burnaby, British Columbia",
    officialWebsite: "https://www.sfu.ca",
    sourceUrl: "https://www.sfu.ca/students/admission.html",
    officialUrl: "https://www.sfu.ca/students/admission.html",
    category: "university",
    institutionType: "International",
    title: "SFU Computing Science, Sustainable Engineering & Co-op",
    isVerified: true,
    verificationSource: "Universities Canada & Ministry of Post-Secondary Education BC",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#CC0633",
      text: "#FFFFFF",
      monogram: "SFU",
      crestColor: "#CC0633",
      logoDescription: "SFU Clan Red & White Heritage Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international students worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "SFU Undergraduate Scholars Entrance Scholarship (up to CAD $120,000 over 4 years)",
      details: "Full tuition plus living stipend package for top international scholars.",
      tuitionCoverage: "Substantial tuition support via merit awards"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $120,000 over 4 years",
      details: "Undergraduate Scholars Entrance Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $145 international application fee.",
      amount: "CAD $145"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $145 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years of English secondary education qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE B3 or 3 years English instruction."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: January 31, 2026",
      deadlineDate: "2026-01-31",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 31, 2026",
    deadlineDate: "2026-01-31",
    admissionsRequirements: {
      academic: "Secondary graduation with min 5 senior academic courses including math and English.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Major Entrance Scholarship Application"]
    },
    studyFields: ["Computing Science", "Sustainable Energy Engineering", "Beedie School of Business", "Interactive Arts & Technology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Repeatedly ranked Canada's top comprehensive university by Maclean's, famed for innovative tri-semester system and massive co-op placements.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "uvic-canada",
    officialName: "University of Victoria",
    institution: "University of Victoria",
    shortName: "UVic",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Victoria, British Columbia",
    officialWebsite: "https://www.uvic.ca",
    sourceUrl: "https://www.uvic.ca/undergraduate",
    officialUrl: "https://www.uvic.ca/undergraduate",
    category: "university",
    institutionType: "International",
    title: "University of Victoria Oceans, Climate & Computer Science",
    isVerified: true,
    verificationSource: "Universities Canada & Government of British Columbia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002754",
      text: "#0093B2",
      monogram: "UVic",
      crestColor: "#002754",
      logoDescription: "UVic Coastal Blue & Martlet Bird Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Entrance Scholarships (up to CAD $40,000 over 4 years)",
      details: "Academic entrance scholarships awarded automatically to high-achieving international admits.",
      tuitionCoverage: "Merit tuition awards"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $147 international fee.",
      amount: "CAD $147"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $147 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "English medium instruction or WASSCE English satisfies requirements.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "English instruction waiver available."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: January 31, 2026",
      deadlineDate: "2026-01-31",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "January 31, 2026",
    deadlineDate: "2026-01-31",
    admissionsRequirements: {
      academic: "Secondary school diploma with grade 12 math and English.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Ocean Networks & Climate Science", "Computer Engineering", "Software Systems", "Earth & Ocean Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's top university for climate action and ocean sciences, home to Ocean Networks Canada and top co-op programs.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "concordia-university-canada",
    officialName: "Concordia University",
    institution: "Concordia University",
    shortName: "Concordia",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Montreal, Quebec",
    officialWebsite: "https://www.concordia.ca",
    sourceUrl: "https://www.concordia.ca/admissions.html",
    officialUrl: "https://www.concordia.ca/admissions.html",
    category: "university",
    institutionType: "International",
    title: "Concordia University Gina Cody Engineering & John Molson Business",
    isVerified: true,
    verificationSource: "Universities Canada & Ministère de l'Enseignement supérieur Québec",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#800020",
      text: "#FFFFFF",
      monogram: "CU",
      crestColor: "#800020",
      logoDescription: "Concordia University Burgundy & Sunburst Emblem"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Concordia Presidential Scholarship (100% Tuition & Residence covered)",
      details: "Full funding award covering tuition, books, and living expenses for up to four years.",
      tuitionCoverage: "100% tuition coverage for Presidential Scholars",
      livingStipend: "Residence and meal plan fully covered"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Full Tuition + Residence (Presidential Scholarship)",
      details: "Prestigious undergraduate entrance scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $113 international application fee.",
      amount: "CAD $113"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $113 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 full years in English-medium school.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE B3 satisfies requirement."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "High school completion with program-specific prerequisites (Math & Science for Gina Cody Engineering).",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Presidential Scholarship Application"]
    },
    studyFields: ["Gina Cody Computer Science & Software Engineering", "John Molson Commerce (JMSB)", "Film Animation", "Civil Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Dynamic English-language university in vibrant downtown Montreal, home to Canada's first engineering faculty named after a woman (Gina Cody).",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "york-university-canada",
    officialName: "York University",
    institution: "York University",
    shortName: "York",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Toronto, Ontario",
    officialWebsite: "https://www.yorku.ca",
    sourceUrl: "https://futurestudents.yorku.ca",
    officialUrl: "https://futurestudents.yorku.ca",
    category: "university",
    institutionType: "International",
    title: "York University Schulich Business, Lassonde Engineering & Osgoode Law",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#E31837",
      text: "#FFFFFF",
      monogram: "YU",
      crestColor: "#E31837",
      logoDescription: "York University Red & White Bold Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "President's International Scholarship of Excellence (CAD $180,000 over 4 years / $45,000/yr)",
      details: "Top award for international high school applicants with straight A averages and leadership records.",
      tuitionCoverage: "CAD $45,000/year renewable scholarship"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $180,000 over 4 years ($45,000/yr)",
      details: "President's International Scholarship of Excellence."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC or direct international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 4 full years of study in English secondary school.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 15, 2026",
      deadlineDate: "2026-02-15",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "February 15, 2026",
    deadlineDate: "2026-02-15",
    admissionsRequirements: {
      academic: "Secondary school graduation with minimum equivalent GPA of 80%–88% depending on program.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "International Scholarship Application"]
    },
    studyFields: ["Schulich International Business (BBA)", "Lassonde Software & Space Engineering", "Global Health", "Kinesiology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's third-largest university, celebrated internationally for the Schulich School of Business and Lassonde School of Engineering.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "carleton-university-canada",
    officialName: "Carleton University",
    institution: "Carleton University",
    shortName: "Carleton",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Ottawa, Ontario",
    officialWebsite: "https://carleton.ca",
    sourceUrl: "https://admissions.carleton.ca",
    officialUrl: "https://admissions.carleton.ca",
    category: "university",
    institutionType: "International",
    title: "Carleton University Public Affairs, Journalism & Aerospace Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#000000",
      text: "#C41230",
      monogram: "CU",
      crestColor: "#000000",
      logoDescription: "Carleton Black & Red Maple Beaver Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Prestige Entrance Scholarships (up to CAD $32,000 over 4 years)",
      details: "Renewable entrance scholarships starting automatically at 80%+ average, with top Prestige awards up to full tuition.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $32,000 over 4 years",
      details: "Prestige Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 full years in English school qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary school completion with prerequisite subjects.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Prestige Scholarship Application"]
    },
    studyFields: ["Public Affairs & Policy Management", "Aerospace Engineering", "Journalism", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Capital university in Ottawa renowned as Canada's premier institution for public policy, international affairs, journalism, and aerospace.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "memorial-university-canada",
    officialName: "Memorial University of Newfoundland",
    institution: "Memorial University of Newfoundland",
    shortName: "MUN",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "St. John's, Newfoundland & Labrador",
    officialWebsite: "https://www.mun.ca",
    sourceUrl: "https://www.mun.ca/undergrad",
    officialUrl: "https://www.mun.ca/undergrad",
    category: "university",
    institutionType: "International",
    title: "Memorial University Affordable International Tuition & Marine Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Newfoundland and Labrador",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#800000",
      text: "#FFFFFF",
      monogram: "MUN",
      crestColor: "#800000",
      logoDescription: "MUN Claret & White Marine Cross Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Recognized as offering one of the lowest and most affordable university tuition rates in all of North America for international students.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Government Aid",
      amount: "Highly Subsidized International Tuition (CAD ~$20,000/yr total tuition)",
      details: "Provincially subsidized tuition makes MUN one of the most cost-effective world-class degree opportunities in Canada.",
      tuitionCoverage: "Low provincial tuition structure"
    },
    funding: {
      type: "Government Aid",
      amount: "Highly Subsidized Low Tuition Rates",
      details: "Provincial subsidy for international students."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $120 international application fee.",
      amount: "CAD $120"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $120 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years English education qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "High school graduation with required academic courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Ocean & Naval Architectural Engineering", "Fisheries Resource Management", "Earth Sciences", "Business Administration"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The only university in Newfoundland and Labrador, global hub for cold-ocean research, naval architecture, and accessible international tuition.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "university-of-guelph-canada",
    officialName: "University of Guelph",
    institution: "University of Guelph",
    shortName: "Guelph",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Guelph, Ontario",
    officialWebsite: "https://www.uoguelph.ca",
    sourceUrl: "https://admission.uoguelph.ca",
    officialUrl: "https://admission.uoguelph.ca",
    category: "university",
    institutionType: "International",
    title: "University of Guelph Veterinary, Agriculture & Environmental Sciences",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C20430",
      text: "#FFC72C",
      monogram: "UoG",
      crestColor: "#C20430",
      logoDescription: "Guelph Gryphon Red & Gold Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Entrance Scholarships (CAD $17,500–$20,500 over 4 years)",
      details: "Merit-based entrance awards automatically assessed with application.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $20,500 over 4 years",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English medium instruction satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 15, 2026",
      deadlineDate: "2026-02-15",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "February 15, 2026",
    deadlineDate: "2026-02-15",
    admissionsRequirements: {
      academic: "Secondary school completion with program prerequisites.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Ontario Veterinary College (OVC)", "Food Science", "Environmental Engineering", "Agricultural Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Known as Canada's 'Food University', ranked #1 in Canada and #5 globally for veterinary medicine and agricultural science.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "tmu-toronto-canada",
    officialName: "Toronto Metropolitan University",
    institution: "Toronto Metropolitan University",
    shortName: "TMU",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Toronto, Ontario",
    officialWebsite: "https://www.torontomu.ca",
    sourceUrl: "https://www.torontomu.ca/admissions",
    officialUrl: "https://www.torontomu.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "TMU DMZ Tech Incubator, Media & Computer Science",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004B87",
      text: "#FFD100",
      monogram: "TMU",
      crestColor: "#004B87",
      logoDescription: "TMU Metropolitan Blue and Gold Emblem"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "President's Entrance Scholarship (CAD $40,000 over 4 years / $10,000/yr)",
      details: "High-achieving international secondary applicants with 90%+ average.",
      tuitionCoverage: "CAD $10,000/yr renewable"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $40,000 over 4 years",
      details: "President's Entrance Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC international fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years English education qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Secondary school completion with program prerequisites.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["The DMZ Startup Incubation", "Computer Science", "Creative Industries", "Biomedical Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Urban university in downtown Toronto, home to the DMZ—ranked as the #1 university-based tech incubator in the world by UBI Global.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "umanitoba-canada",
    officialName: "University of Manitoba",
    institution: "University of Manitoba",
    shortName: "UManitoba",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Winnipeg, Manitoba",
    officialWebsite: "https://umanitoba.ca",
    sourceUrl: "https://umanitoba.ca/admissions",
    officialUrl: "https://umanitoba.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "University of Manitoba Engineering, Health & International Bursaries",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Manitoba Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#4F2683",
      text: "#C49A45",
      monogram: "UM",
      crestColor: "#4F2683",
      logoDescription: "UManitoba Brown & Gold Bison Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Undergraduate Student Entrance Scholarships (up to CAD $16,000)",
      details: "Tiered entrance awards based on high school academic average.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $16,000 Entrance Scholarships",
      details: "Merit-based international entrance awards."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $120 international application fee.",
      amount: "CAD $120"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $120 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 full years in English secondary school qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary school completion with min 70% average across 5 senior subjects.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Biosystems Engineering", "Medical Microbiology", "Agricultural Economics", "Computer Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Western Canada's first university, member of the U15, recognized globally for infectious disease research and Arctic climate science.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "usask-canada",
    officialName: "University of Saskatchewan",
    institution: "University of Saskatchewan",
    shortName: "USask",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Saskatoon, Saskatchewan",
    officialWebsite: "https://www.usask.ca",
    sourceUrl: "https://admissions.usask.ca",
    officialUrl: "https://admissions.usask.ca",
    category: "university",
    institutionType: "International",
    title: "USask Agriculture, Vaccine Discovery (VIDO) & Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Saskatchewan",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004731",
      text: "#FFFFFF",
      monogram: "USask",
      crestColor: "#004731",
      logoDescription: "USask Prairie Green & Gold Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "George and Marsha Ivany International Excellence Scholarships (CAD $40,000 / $10,000/yr)",
      details: "Renewable entrance scholarships for top international secondary admits.",
      tuitionCoverage: "CAD $10,000/year renewable support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $40,000 over 4 years",
      details: "Ivany International Excellence Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $90 international application fee.",
      amount: "CAD $90"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $90 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English medium instruction satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 15, 2026",
      deadlineDate: "2026-02-15",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "February 15, 2026",
    deadlineDate: "2026-02-15",
    admissionsRequirements: {
      academic: "Secondary school completion with program prerequisites.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Vaccine Discovery (VIDO-InterVac)", "Agricultural Biotechnology", "Synchrotron Light Science", "Veterinary Medicine"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "U15 research university housing the Canadian Light Source synchrotron and VIDO, Canada's premier national infectious disease facility.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "uwindsor-canada",
    officialName: "University of Windsor",
    institution: "University of Windsor",
    shortName: "UWindsor",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Windsor, Ontario",
    officialWebsite: "https://www.uwindsor.ca",
    sourceUrl: "https://future.uwindsor.ca",
    officialUrl: "https://future.uwindsor.ca",
    category: "university",
    institutionType: "International",
    title: "University of Windsor Automotive Engineering & Computer Science",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002D62",
      text: "#FFD100",
      monogram: "UW",
      crestColor: "#002D62",
      logoDescription: "UWindsor Blue & Gold Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Open Entrance Scholarships (CAD $1,000–$16,000 renewable)",
      details: "Automatic entrance scholarships for international students with 85%+ average.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $16,000 Entrance Awards",
      details: "Open Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 direct international fee.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary diploma with prerequisite courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Automotive Engineering", "Computer Science", "Business Administration", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Located across the river from Detroit, UWindsor is internationally recognized for automotive engineering research and cross-border commercial law.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "brock-university-canada",
    officialName: "Brock University",
    institution: "Brock University",
    shortName: "Brock",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "St. Catharines, Ontario",
    officialWebsite: "https://brocku.ca",
    sourceUrl: "https://brocku.ca/admissions",
    officialUrl: "https://brocku.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "Brock University Goodman School of Business, Oenology & Co-op",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#CC0000",
      text: "#FFFFFF",
      monogram: "BROCK",
      crestColor: "#CC0000",
      logoDescription: "Brock Badger Red & White Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Brock Scholar Awards (CAD $4,000–$16,000 renewable) & Emerging Global Leaders Award",
      details: "Renewable entrance scholarships for international students with 80%+ average.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $16,000 Renewable Awards",
      details: "Brock Scholar Awards."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $130 application fee.",
      amount: "CAD $130"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $130 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years English education qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary graduation with senior academic subjects.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Goodman Business (BBA)", "Oenology & Viticulture (CCOVI)", "Game Design", "Kinesiology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The only Canadian university situated in a UNESCO Biosphere Reserve, renowned for the Goodman School of Business and co-op placements.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "unb-canada",
    officialName: "University of New Brunswick",
    institution: "University of New Brunswick",
    shortName: "UNB",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Fredericton, New Brunswick",
    officialWebsite: "https://www.unb.ca",
    sourceUrl: "https://www.unb.ca/admissions",
    officialUrl: "https://www.unb.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "UNB Cybersecurity, Geodesy & Global Entrance Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Government of New Brunswick",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C8102E",
      text: "#000000",
      monogram: "UNB",
      crestColor: "#C8102E",
      logoDescription: "UNB Red, Black & Ship Heraldic Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "UNB Entrance Scholarships (CAD $2,000 to $40,000 over 4 years)",
      details: "One in two entering students receives a scholarship at UNB.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "UNB Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 international application fee.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions open.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science subjects.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Scholarship Application"]
    },
    studyFields: ["Cybersecurity (Canadian Institute for Cybersecurity)", "Geodesy & Geomatics", "Chemical Engineering", "Forestry"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of North America's oldest public universities, founded in 1785, pioneer of GPS technology and national cybersecurity research.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "umontreal-canada",
    officialName: "Université de Montréal",
    institution: "Université de Montréal",
    shortName: "UdeM",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Montreal, Quebec",
    officialWebsite: "https://www.umontreal.ca",
    sourceUrl: "https://admission.umontreal.ca",
    officialUrl: "https://admission.umontreal.ca",
    category: "university",
    institutionType: "International",
    title: "UdeM Artificial Intelligence (MILA), Life Sciences & UdeM Exemption Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Ministère de l'Enseignement supérieur Québec",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0055A5",
      text: "#FFFFFF",
      monogram: "UdeM",
      crestColor: "#0055A5",
      logoDescription: "UdeM Blue & Gold Rays Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates worldwide. International students benefit from UdeM Exemption Scholarships covering differential fees.",
      eligibleRegions: ["Global", "Africa", "North America", "Francophonie"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Tuition Waiver",
      amount: "UdeM Exemption Scholarship for International Students (up to CAD $13,340/year waiver)",
      details: "Tiered exemption scholarships awarded automatically based on academic records to reduce tuition to near-domestic rates.",
      tuitionCoverage: "Up to CAD $13,340/yr tuition fee waiver"
    },
    funding: {
      type: "Tuition Waiver",
      amount: "Up to CAD $13,340/yr Exemption Waiver",
      details: "UdeM Exemption Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $111 application fee.",
      amount: "CAD $111"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $111 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "French proficiency (B2/C1) or English proficiency depending on language of instruction.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "French B2 or English proficiency according to degree track."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of French or English language proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["MILA Deep Learning & AI", "Pharmacy & Pharmacology", "Law", "Computer Science", "Biochemistry"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Global epicenter of deep learning research (home to Yoshua Bengio and Mila), ranked among top 3 universities in Canada in research volume.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "ulaval-canada",
    officialName: "Université Laval",
    institution: "Université Laval",
    shortName: "ULaval",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Quebec City, Quebec",
    officialWebsite: "https://www.ulaval.ca",
    sourceUrl: "https://www.ulaval.ca/admission",
    officialUrl: "https://www.ulaval.ca/admission",
    category: "university",
    institutionType: "International",
    title: "Université Laval Optics-Photonics, Forestry & Citizen of the World Awards",
    isVerified: true,
    verificationSource: "Universities Canada & Royal Charter (1852)",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C8102E",
      text: "#FFD100",
      monogram: "UL",
      crestColor: "#C8102E",
      logoDescription: "Université Laval Historic Red, Gold & Cross Royal Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America", "Francophonie"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Citizen of the World Excellence Scholarship (up to CAD $30,000)",
      details: "Merit scholarships for outstanding international entrants.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $30,000",
      details: "Citizen of the World Scholarship."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $98 application fee.",
      amount: "CAD $98"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $98 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "French proficiency (TFI/TEF B2) required for French degree courses.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "French B2 proficiency."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Secondary completion meeting provincial university entrance requirements.",
      language: "Proof of French proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Optics, Photonics & Lasers", "Forestry & Wood Sciences", "Arctic Climate Science", "Medicine"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The oldest centre of French-language higher education in North America (founded 1663), world leader in optics-photonics and northern research.",
    officialRuleSummary: "Member of Universities Canada and the U15."
  },
  {
    id: "usherbrooke-canada",
    officialName: "Université de Sherbrooke",
    institution: "Université de Sherbrooke",
    shortName: "UdeS",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Sherbrooke, Quebec",
    officialWebsite: "https://www.usherbrooke.ca",
    sourceUrl: "https://www.usherbrooke.ca/admission",
    officialUrl: "https://www.usherbrooke.ca/admission",
    category: "university",
    institutionType: "International",
    title: "Université de Sherbrooke Quantum Science & Paid Co-op Programs",
    isVerified: true,
    verificationSource: "Universities Canada & Ministère de l'Enseignement supérieur Québec",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#006400",
      text: "#FFFFFF",
      monogram: "UdeS",
      crestColor: "#006400",
      logoDescription: "UdeS Forest Green & Silver Emblem"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Paid Co-op Earnings ($40,000+) & International Tuition Waivers",
      details: "Pioneer in French-language co-operative education with substantial paid industry terms.",
      tuitionCoverage: "Paid work terms offset tuition costs"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Paid Co-op + Tuition Waivers",
      details: "Paid co-op work terms."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $102 application fee.",
      amount: "CAD $102"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $102 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Proof of French proficiency required.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "French language requirement."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary school diploma with science/math prerequisites.",
      language: "Proof of French proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Institut Quantique (Quantum Computing)", "Mechanical Engineering", "Biotechnology", "Pharmacology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "World-class quantum computing hub and Quebec's leading co-operative education university.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "uqam-canada",
    officialName: "Université du Québec à Montréal",
    institution: "Université du Québec à Montréal",
    shortName: "UQAM",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Montreal, Quebec",
    officialWebsite: "https://uqam.ca",
    sourceUrl: "https://etudier.uqam.ca",
    officialUrl: "https://etudier.uqam.ca",
    category: "university",
    institutionType: "International",
    title: "UQAM Science, Design, Communications & Social Justice Programs",
    isVerified: true,
    verificationSource: "Universities Canada & Université du Québec System",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#00A850",
      monogram: "UQAM",
      crestColor: "#003366",
      logoDescription: "UQAM Blue and Green Hexagon Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Exemption Scholarships for International Students",
      details: "Tuition exemption scholarships awarded on academic merit.",
      tuitionCoverage: "Tuition reductions for international students"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Exemption Scholarships",
      details: "Tuition reductions available."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $115 application fee.",
      amount: "CAD $115"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $115 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "French proficiency required for French-language degrees.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "French proficiency requirement."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite academic standing.",
      language: "Proof of French proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Environmental Sciences", "Software Engineering", "Graphic & Environmental Design", "Political Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Dynamic urban public university in the heart of Montreal, renowned for arts, environmental science, and social innovation.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "hec-montreal-canada",
    officialName: "HEC Montréal",
    institution: "HEC Montréal",
    shortName: "HEC Montréal",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Montreal, Quebec",
    officialWebsite: "https://www.hec.ca/en",
    sourceUrl: "https://www.hec.ca/en/programs/bba",
    officialUrl: "https://www.hec.ca/en/programs/bba",
    category: "university",
    institutionType: "International",
    title: "HEC Montréal Triple-Accredited Business Administration (Trilingual BBA)",
    isVerified: true,
    verificationSource: "Universities Canada, AACSB, EQUIS & AMBA (Triple Crown)",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002855",
      text: "#FFFFFF",
      monogram: "HEC",
      crestColor: "#002855",
      logoDescription: "HEC Montréal Navy & Bronze Crown Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international business candidates worldwide. Offers English, French, and Trilingual (EN-FR-ES) tracks.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Entrance Scholarships of Excellence (CAD $4,000 to $12,000)",
      details: "Merit-based scholarships awarded upon admission.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $12,000 Entrance Awards",
      details: "Entrance Scholarships of Excellence."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $115 application fee.",
      amount: "CAD $115"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $115 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "English or French proficiency depending on chosen BBA track.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "English or French proficiency."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 15, 2026",
      deadlineDate: "2026-02-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 15, 2026",
    deadlineDate: "2026-02-15",
    admissionsRequirements: {
      academic: "High school completion with strong grades in mathematics.",
      language: "Proof of English and/or French proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Trilingual Business Administration", "Financial Engineering", "Business Analytics", "Supply Chain"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's first business school (founded 1907), among the rare 1% of business schools worldwide holding AACSB, AMBA, and EQUIS triple accreditation.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "polytechnique-montreal-canada",
    officialName: "Polytechnique Montréal",
    institution: "Polytechnique Montréal",
    shortName: "Polytechnique",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Montreal, Quebec",
    officialWebsite: "https://www.polymtl.ca/en",
    sourceUrl: "https://www.polymtl.ca/admission/en",
    officialUrl: "https://www.polymtl.ca/admission/en",
    category: "university",
    institutionType: "International",
    title: "Polytechnique Montréal Engineering & Innovation Degrees",
    isVerified: true,
    verificationSource: "Universities Canada & Engineers Canada (CEAB)",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#C41230",
      text: "#FFFFFF",
      monogram: "POLY",
      crestColor: "#C41230",
      logoDescription: "Polytechnique Montréal Red & White Compass Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international engineering candidates worldwide.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Exemption Scholarships for International Students & Co-op Earnings",
      details: "Tuition exemption scholarships and paid industrial internships.",
      tuitionCoverage: "Merit tuition support and paid engineering internships"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Exemption Scholarships & Internships",
      details: "Tuition exemptions and paid internships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $115 application fee.",
      amount: "CAD $115"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $115 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "Proficiency in French required for undergraduate engineering courses.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "French proficiency required."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: February 1, 2026",
      deadlineDate: "2026-02-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 1, 2026",
    deadlineDate: "2026-02-01",
    admissionsRequirements: {
      academic: "Advanced secondary mathematics (calculus, algebra) and physics/chemistry.",
      language: "Proof of French proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Aerospace Engineering", "Biomedical Engineering", "Software Engineering", "Civil Engineering"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Canada's premier engineering research schools, renowned for aerospace engineering and medical technologies.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "wlu-waterloo-canada",
    officialName: "Wilfrid Laurier University",
    institution: "Wilfrid Laurier University",
    shortName: "Laurier",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Waterloo, Ontario",
    officialWebsite: "https://www.wlu.ca",
    sourceUrl: "https://www.wlu.ca/admissions",
    officialUrl: "https://www.wlu.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "Wilfrid Laurier Lazaridis School of Business & Economics",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#330066",
      text: "#FFD100",
      monogram: "WLU",
      crestColor: "#330066",
      logoDescription: "Laurier Golden Hawk Purple & Gold Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Laurier Scholars Award & Entrance Scholarships (CAD $1,500–$40,000)",
      details: "Automatic entrance awards starting at 80% average; top competitive scholarships up to $40,000.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000",
      details: "Laurier Scholars Award."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC standard international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years English instruction qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary school completion with program prerequisite standing.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Lazaridis Business Administration (BBA)", "Computer Science", "Music Therapy", "Health Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Home to the AACSB-accredited Lazaridis School of Business and Canada's largest business degree co-op program.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "trent-university-canada",
    officialName: "Trent University",
    institution: "Trent University",
    shortName: "Trent",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Peterborough, Ontario",
    officialWebsite: "https://www.trentu.ca",
    sourceUrl: "https://www.trentu.ca/futurestudents",
    officialUrl: "https://www.trentu.ca/futurestudents",
    category: "university",
    institutionType: "International",
    title: "Trent University Environmental & Forensic Sciences, Global Awards",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004731",
      text: "#FFFFFF",
      monogram: "TRENT",
      crestColor: "#004731",
      logoDescription: "Trent Green & Gold Crest and River Waves"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Trent Global Citizens Scholarships & Awards (up to Full Tuition / CAD $34,000/yr)",
      details: "Prestigious renewable scholarships for international students with superior academic achievement and community leadership.",
      tuitionCoverage: "Up to full tuition fees renewable for 4 years"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to Full Tuition (CAD $34,000/yr)",
      details: "Trent Global Citizens Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 application fee.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or 3 years English secondary education qualifies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application & Scholarship Deadline: February 15, 2026",
      deadlineDate: "2026-02-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 15, 2026",
    deadlineDate: "2026-02-15",
    admissionsRequirements: {
      academic: "Secondary school diploma with minimum 75% equivalent.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Global Citizens Scholarship Essay"]
    },
    studyFields: ["Forensic Science (DNA Profiling)", "Environmental Science", "Biomedical Science", "Indigenous Studies"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Repeatedly ranked Ontario's #1 undergraduate university by Maclean's, world leader in DNA forensics and environmental science.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "ulethbridge-canada",
    officialName: "University of Lethbridge",
    institution: "University of Lethbridge",
    shortName: "ULethbridge",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Lethbridge, Alberta",
    officialWebsite: "https://www.ulethbridge.ca",
    sourceUrl: "https://www.ulethbridge.ca/future-student",
    officialUrl: "https://www.ulethbridge.ca/future-student",
    category: "university",
    institutionType: "International",
    title: "University of Lethbridge Neuroscience, Science & Global Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Alberta Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002B49",
      text: "#0093B2",
      monogram: "uLeth",
      crestColor: "#002B49",
      logoDescription: "ULethbridge Blue & Sunburst Coulee Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Student Awards (CAD $1,000 to $10,000 renewable)",
      details: "Automatic entrance awards for academic excellence.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $10,000",
      details: "International Student Awards."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $140 international application fee.",
      amount: "CAD $140"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $140 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English medium instruction satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: June 1, 2026",
      deadlineDate: "2026-06-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "June 1, 2026",
    deadlineDate: "2026-06-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Neuroscience (Canadian Centre for Behavioural Neuroscience)", "Agricultural Biotechnology", "Digital Media"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Leading Canadian research institution hosting the Canadian Centre for Behavioural Neuroscience, known for undergraduate research access.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "uregina-canada",
    officialName: "University of Regina",
    institution: "University of Regina",
    shortName: "URegina",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Regina, Saskatchewan",
    officialWebsite: "https://www.uregina.ca",
    sourceUrl: "https://www.uregina.ca/admissions",
    officialUrl: "https://www.uregina.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "University of Regina Petroleum Systems & UR Guarantee Program",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Saskatchewan",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004731",
      text: "#DAA520",
      monogram: "UofR",
      crestColor: "#004731",
      logoDescription: "URegina Green & Gold Crown Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Entrance Scholarships (up to CAD $20,000 over 4 years) + UR Guarantee",
      details: "UR Guarantee promises a career in your field within 6 months of graduation, or a tuition-free year.",
      tuitionCoverage: "Merit tuition support and UR Guarantee career pledge"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $20,000 + UR Guarantee",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $100 international application fee.",
      amount: "CAD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Petroleum Systems Engineering", "Clean Energy Technologies", "Software Systems", "Journalism"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Comprehensive research university in Saskatchewan's capital, pioneer of the UR Guarantee career employment pledge.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "lakehead-university-canada",
    officialName: "Lakehead University",
    institution: "Lakehead University",
    shortName: "Lakehead",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Thunder Bay, Ontario",
    officialWebsite: "https://www.lakeheadu.ca",
    sourceUrl: "https://www.lakeheadu.ca/admissions",
    officialUrl: "https://www.lakeheadu.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "Lakehead University Forestry, Engineering & Entrance Grants",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002F6C",
      text: "#FFD100",
      monogram: "LAKE",
      crestColor: "#002F6C",
      logoDescription: "Lakehead Blue & Gold Beaver Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Undergraduate Entrance Scholarships (CAD $4,000 to $40,000 renewable)",
      details: "Tiered entrance scholarships automatically awarded based on secondary GPA.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $135 application fee.",
      amount: "CAD $135"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $135 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English medium instruction satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite subject requirements.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Boreal Forest Ecology", "Mechanical Engineering", "Environmental Studies", "Northern Ontario Medicine"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Recognized as Canada's #1 research university in its category by RE$EARCH Infosource, leader in boreal ecology and engineering.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "ontariotech-canada",
    officialName: "Ontario Tech University",
    institution: "Ontario Tech University",
    shortName: "Ontario Tech",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Oshawa, Ontario",
    officialWebsite: "https://ontariotechu.ca",
    sourceUrl: "https://ontariotechu.ca/admissions",
    officialUrl: "https://ontariotechu.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "Ontario Tech Nuclear Engineering, AI & Automotive Innovation",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#0077CA",
      text: "#E35205",
      monogram: "OT",
      crestColor: "#0077CA",
      logoDescription: "Ontario Tech Blue & Orange Tech Emblem"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Global Leadership Award (CAD $72,000 over 4 years / $18,000/yr)",
      details: "Prestigious award for graduating international secondary scholars demonstrating high achievement and leadership.",
      tuitionCoverage: "CAD $18,000/year renewable support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $72,000 over 4 years ($18,000/yr)",
      details: "Global Leadership Award."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "OUAC standard international application fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "Standard OUAC fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application & Scholarship Deadline: February 25, 2026",
      deadlineDate: "2026-02-25",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "February 25, 2026",
    deadlineDate: "2026-02-25",
    admissionsRequirements: {
      academic: "Secondary completion with mathematics and science prerequisites.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Global Leadership Award Application"]
    },
    studyFields: ["Nuclear Engineering (only program in Canada)", "Automotive Aerodynamics (ACE Climatic Tunnel)", "Game Development"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Canada's only university offering an undergraduate Nuclear Engineering degree, home to ACE—one of the world's most advanced climatic wind tunnels.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "laurentian-university-canada",
    officialName: "Laurentian University",
    institution: "Laurentian University",
    shortName: "Laurentian",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Sudbury, Ontario",
    officialWebsite: "https://laurentian.ca",
    sourceUrl: "https://laurentian.ca/admissions",
    officialUrl: "https://laurentian.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "Laurentian University Mining Engineering, Geology & SNOLAB Research",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002B49",
      text: "#FFD100",
      monogram: "LU",
      crestColor: "#002B49",
      logoDescription: "Laurentian Blue & Gold Mine and Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Excellence Scholarships (CAD $10,000 to $40,000 renewable)",
      details: "Automatic entrance awards based on secondary grades.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "International Excellence Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 direct international fee.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Mining Engineering", "Earth Sciences & Mineral Exploration", "SNOLAB Particle Astrophysics", "Forensics"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "World capital for mining engineering and exploration geology, partner in SNOLAB deep underground science laboratory (Nobel Prize in Physics).",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "unbc-canada",
    officialName: "University of Northern British Columbia",
    institution: "University of Northern British Columbia",
    shortName: "UNBC",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Prince George, British Columbia",
    officialWebsite: "https://www.unbc.ca",
    sourceUrl: "https://www.unbc.ca/admissions",
    officialUrl: "https://www.unbc.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "UNBC Green University, Natural Resources & Engineering",
    isVerified: true,
    verificationSource: "Universities Canada & Government of British Columbia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00483A",
      text: "#00966C",
      monogram: "UNBC",
      crestColor: "#00483A",
      logoDescription: "UNBC Forest Green & Mountain Wave Seal"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "UNBC International Student Scholarships (CAD $2,500 to $10,000)",
      details: "Merit-based international entrance awards.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $10,000",
      details: "International Student Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $125 application fee.",
      amount: "CAD $125"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $125 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Environmental Engineering", "Natural Resources Management", "Biochemistry", "Northern Health"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned as 'Canada's Green University', repeatedly ranked #1 or #2 in its category by Maclean's for environmental research and sustainability.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "tru-kamloops-canada",
    officialName: "Thompson Rivers University",
    institution: "Thompson Rivers University",
    shortName: "TRU",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Kamloops, British Columbia",
    officialWebsite: "https://www.tru.ca",
    sourceUrl: "https://www.tru.ca/admissions.html",
    officialUrl: "https://www.tru.ca/admissions.html",
    category: "university",
    institutionType: "International",
    title: "Thompson Rivers University Software Engineering, Law & Co-op",
    isVerified: true,
    verificationSource: "Universities Canada & Government of British Columbia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003865",
      text: "#FFFFFF",
      monogram: "TRU",
      crestColor: "#003865",
      logoDescription: "TRU Blue River & Sun Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Entrance Scholarships (up to CAD $10,000)",
      details: "Entrance scholarships for academic merit and global leadership.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $10,000",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $100 application fee.",
      amount: "CAD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $100 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Software Engineering", "Business Administration", "Tourism Management", "Law"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Innovative university in British Columbia offering high graduate employment, flexible open learning, and accredited law and software degrees.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "upei-canada",
    officialName: "University of Prince Edward Island",
    institution: "University of Prince Edward Island",
    shortName: "UPEI",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Charlottetown, Prince Edward Island",
    officialWebsite: "https://www.upei.ca",
    sourceUrl: "https://www.upei.ca/apply",
    officialUrl: "https://www.upei.ca/apply",
    category: "university",
    institutionType: "International",
    title: "UPEI Atlantic Veterinary College, Engineering & Sustainable Design",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Prince Edward Island",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004731",
      text: "#DAA520",
      monogram: "UPEI",
      crestColor: "#004731",
      logoDescription: "UPEI Forest Green & Gold Oak Tree Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "International Entrance Scholarships (CAD $1,000 to $16,000 over 4 years)",
      details: "Entrance awards based on high school academic performance.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $16,000 over 4 years",
      details: "International Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $50 application fee.",
      amount: "CAD $50"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $50 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Atlantic Veterinary College (AVC)", "Sustainable Design Engineering", "Mathematical & Computational Sciences"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "The sole university on Prince Edward Island, home to the world-renowned Atlantic Veterinary College and sustainable design engineering.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "acadia-university-canada",
    officialName: "Acadia University",
    institution: "Acadia University",
    shortName: "Acadia",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Wolfville, Nova Scotia",
    officialWebsite: "https://www.acadiau.ca",
    sourceUrl: "https://www2.acadiau.ca/admissions.html",
    officialUrl: "https://www2.acadiau.ca/admissions.html",
    category: "university",
    institutionType: "International",
    title: "Acadia University Pure & Applied Science, Business & Scholarships",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Nova Scotia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#A6192E",
      text: "#00205B",
      monogram: "ACAD",
      crestColor: "#A6192E",
      logoDescription: "Acadia Red & Navy Axemen Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Renewable Entrance Scholarships (CAD $4,000 to $40,000 over 4 years)",
      details: "Over $4.5 million in student financial aid awarded annually.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "Renewable Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $40 application fee.",
      amount: "CAD $40"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $40 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Scholarship Application"]
    },
    studyFields: ["Computer Science", "Nutrition & Dietetics", "Environmental Science", "Business Administration"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Canada's oldest and most prestigious predominantly undergraduate universities (founded 1838) in scenic Nova Scotia.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "smu-halifax-canada",
    officialName: "Saint Mary's University",
    institution: "Saint Mary's University",
    shortName: "SMU Halifax",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Halifax, Nova Scotia",
    officialWebsite: "https://www.smu.ca",
    sourceUrl: "https://www.smu.ca/admission",
    officialUrl: "https://www.smu.ca/admission",
    category: "university",
    institutionType: "International",
    title: "Saint Mary's University Sobey School of Business & Science",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Nova Scotia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#800000",
      text: "#FFFFFF",
      monogram: "SMU",
      crestColor: "#800000",
      logoDescription: "Saint Mary's Maroon & White Heraldic Cross"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate", "Doctorate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Presidential & International Entrance Scholarships (CAD $4,000 to $36,000 over 4 years)",
      details: "Automatic entrance awards for academic standing.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $36,000 over 4 years",
      details: "Presidential & International Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $70 application fee.",
      amount: "CAD $70"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $70 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Sobey School of Business (BComm)", "Astrophysics", "Computing Science", "Forensic Psychology"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Historic university in downtown Halifax (founded 1802), renowned for the AACSB-accredited Sobey School of Business and astrophysics observatory.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "stfx-canada",
    officialName: "St. Francis Xavier University",
    institution: "St. Francis Xavier University",
    shortName: "StFX",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Antigonish, Nova Scotia",
    officialWebsite: "https://www.stfx.ca",
    sourceUrl: "https://www.stfx.ca/admissions",
    officialUrl: "https://www.stfx.ca/admissions",
    category: "university",
    institutionType: "International",
    title: "StFX Coady Institute, Schwartz School of Business & X-Ring Tradition",
    isVerified: true,
    verificationSource: "Universities Canada & Government of Nova Scotia",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#00205B",
      text: "#FFFFFF",
      monogram: "StFX",
      crestColor: "#00205B",
      logoDescription: "StFX Blue & White Cross Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "National & International Entrance Scholarships (CAD $5,000 to $32,000 over 4 years)",
      details: "Renewable entrance scholarships for academic excellence and leadership.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $32,000 over 4 years",
      details: "Entrance Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $40 application fee.",
      amount: "CAD $40"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $40 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Schwartz School of Business", "Coady International Institute", "Health Sciences", "Aquatic Resources"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of Canada's most celebrated undergraduate universities, famous for the coveted X-Ring tradition and the Coady International Institute.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "mta-canada",
    officialName: "Mount Allison University",
    institution: "Mount Allison University",
    shortName: "Mount A",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Sackville, New Brunswick",
    officialWebsite: "https://www.mta.ca",
    sourceUrl: "https://www.mta.ca/apply",
    officialUrl: "https://www.mta.ca/apply",
    category: "university",
    institutionType: "International",
    title: "Mount Allison University Top-Ranked Undergraduate Liberal Arts & Sciences",
    isVerified: true,
    verificationSource: "Universities Canada & Government of New Brunswick",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7B1113",
      text: "#DAA520",
      monogram: "MtA",
      crestColor: "#7B1113",
      logoDescription: "Mount Allison Garnet & Gold Open Book Crest"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Bell Scholarships (CAD $56,000) & International Entrance Awards (CAD $5,000–$20,000)",
      details: "Over 75% of entering students receive entrance scholarships.",
      tuitionCoverage: "Up to CAD $56,000 total scholarship support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $56,000 (Bell Scholarships)",
      details: "Bell Scholarships & Entrance Awards."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $50 application fee.",
      amount: "CAD $50"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $50 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application & Scholarship Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Scholarship Application"]
    },
    studyFields: ["Aviation Science", "Biochemistry", "Commerce & Economics", "Environmental Science"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Ranked #1 undergraduate university in Canada by Maclean's magazine more times than any other university (33 times), renowned for Rhodes Scholars.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "ubishops-canada",
    officialName: "Bishop's University",
    institution: "Bishop's University",
    shortName: "Bishop's",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Sherbrooke, Quebec",
    officialWebsite: "https://www.ubishops.ca",
    sourceUrl: "https://www.ubishops.ca/future-students",
    officialUrl: "https://www.ubishops.ca/future-students",
    category: "university",
    institutionType: "International",
    title: "Bishop's University English-Language Liberal Arts, Business & Science",
    isVerified: true,
    verificationSource: "Universities Canada & Royal Charter (1853)",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#551A8B",
      text: "#FFFFFF",
      monogram: "BU",
      crestColor: "#551A8B",
      logoDescription: "Bishop's Purple & Silver Mitre Shield"
    },
    eligibilityCountries: ["Ghana", "Nigeria", "Kenya", "Canada", "All International Countries"],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates from all world regions. 100% English-language instruction in Quebec.",
      eligibleRegions: ["Global", "Africa", "North America"]
    },
    degreeLevels: ["Undergraduate", "Postgraduate"],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "Chancellor's Excellence Scholarships (CAD $40,000 / $10,000/yr)",
      details: "Generous merit scholarships for international applicants.",
      tuitionCoverage: "Merit tuition support"
    },
    funding: {
      type: "Partial / Merit",
      amount: "Up to CAD $40,000 over 4 years",
      details: "Chancellor's Excellence Scholarships."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $65 application fee.",
      amount: "CAD $65"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $65 fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 or English schooling satisfies.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English B3 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "Application Deadline: March 1, 2026",
      deadlineDate: "2026-03-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: false
    },
    deadline: "March 1, 2026",
    deadlineDate: "2026-03-01",
    admissionsRequirements: {
      academic: "Secondary completion with prerequisite math and science courses.",
      language: "Proof of English proficiency.",
      documents: ["Transcripts", "Identification"]
    },
    studyFields: ["Williams School of Business", "Computer Science", "Pre-Medicine", "Environmental Studies"],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "One of three English-language universities in Quebec, renowned for personalized residential undergraduate education and the Williams School of Business.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "nipissing-canada",
    officialName: "Nipissing University",
    institution: "Nipissing University",
    shortName: "Nipissing",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "North Bay, Ontario",
    officialWebsite: "https://www.nipissingu.ca",
    sourceUrl: "https://www.nipissingu.ca/international",
    officialUrl: "https://www.nipissingu.ca/international",
    category: "university",
    institutionType: "International",
    title: "Nipissing International Student Excellence Award (CAD $5,000–$10,000)",
    isVerified: true,
    verificationSource: "Universities Canada & Ontario Ministry of Colleges and Universities",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003366",
      text: "#008080",
      monogram: "NIP",
      crestColor: "#003366",
      logoDescription: "Nipissing University Blue & Teal Shield"
    },
    eligibilityCountries: [
      "Canada",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing undergraduate or graduate degree studies.",
      eligibleRegions: [
        "Global",
        "North America",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "CAD $5,000 to $10,000 per year renewable",
      details: "Entrance scholarships awarded automatically based on high school admission average.",
      tuitionCoverage: "CAD $5,000 to $10,000 entrance scholarship"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $5,000 to $10,000 Entrance Award",
      details: "Merit-based international entrance award."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $156 OUAC / Direct international application processing fee.",
      amount: "CAD $156"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $156 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English grade C6 or higher recognized for English proficiency.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Fall Semester 2026",
      deadlineText: "International Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Ontario Grade 12 with minimum 75% average.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Education & Schulich School of Education",
      "Environmental Biology",
      "Nursing",
      "Criminal Justice",
      "Business"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Renowned for the Schulich School of Education, small student-to-faculty ratios, and top national rankings for student support and mental wellness.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "macewan-canada",
    officialName: "MacEwan University",
    institution: "MacEwan University",
    shortName: "MacEwan",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Edmonton, Alberta",
    officialWebsite: "https://www.macewan.ca",
    sourceUrl: "https://www.macewan.ca/international",
    officialUrl: "https://www.macewan.ca/international",
    category: "university",
    institutionType: "International",
    title: "MacEwan International Student Entrance Scholarship (up to CAD $14,000)",
    isVerified: true,
    verificationSource: "Universities Canada & Alberta Ministry of Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#7A1C29",
      text: "#FFFFFF",
      monogram: "MAC",
      crestColor: "#7A1C29",
      logoDescription: "MacEwan University Crimson & Charcoal Griffin Crest"
    },
    eligibilityCountries: [
      "Canada",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for degree coursework.",
      eligibleRegions: [
        "Global",
        "North America",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "CAD $4,000 to $14,000 based on admission average",
      details: "Tiered international entrance scholarships automatically awarded upon acceptance.",
      tuitionCoverage: "Up to CAD $14,000 entrance award"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $4,000 to $14,000 Entrance Scholarship",
      details: "Automatic evaluation upon admission offer."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $110 international application fee.",
      amount: "CAD $110"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $110 application fee."
    },
    testWaiverRules: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE/WAEC English C6 or higher recognized for English proficiency.",
      satPolicy: "SAT optional."
    },
    testPolicy: {
      status: "WAEC/WASSCE English Accepted",
      details: "WASSCE English C6 accepted."
    },
    deadlines: {
      term: "Fall Term 2026",
      deadlineText: "International Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions rolling.",
      isRolling: true
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to Alberta Grade 12 with min 70-80% depending on program.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Nursing & Health Studies",
      "Commerce & Accounting",
      "Design & Fine Arts",
      "Computer Science",
      "Arts & Science"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Edmonton’s vibrant downtown university, acclaimed for exceptional undergraduate teaching focus, modern simulation labs, and industry co-op placements.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "mru-canada",
    officialName: "Mount Royal University",
    institution: "Mount Royal University (MRU)",
    shortName: "MRU",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Calgary, Alberta",
    officialWebsite: "https://www.mtroyal.ca",
    sourceUrl: "https://www.mtroyal.ca/international",
    officialUrl: "https://www.mtroyal.ca/international",
    category: "university",
    institutionType: "International",
    title: "MRU President's International Scholarship (up to CAD $7,500)",
    isVerified: true,
    verificationSource: "Universities Canada & Alberta Ministry of Advanced Education",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#002855",
      text: "#FFFFFF",
      monogram: "MRU",
      crestColor: "#B5A16A",
      logoDescription: "Mount Royal University Navy & Gold Open Book Crest"
    },
    eligibilityCountries: [
      "Canada",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing full-time undergraduate studies.",
      eligibleRegions: [
        "Global",
        "North America",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "CAD $3,000 to $7,500 entrance awards",
      details: "Competitive and automatic merit awards for incoming international students.",
      tuitionCoverage: "CAD $3,000 to $7,500 award"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $3,000 to $7,500 International Scholarship",
      details: "Entrance scholarship applied directly to tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $100 international application fee.",
      amount: "CAD $100"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $100 application fee."
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
      term: "Fall Semester 2026",
      deadlineText: "International Application Deadline: April 1, 2026",
      deadlineDate: "2026-04-01",
      cycleStatus: "open",
      statusNotice: "Applications open.",
      isRolling: true
    },
    deadline: "April 1, 2026",
    deadlineDate: "2026-04-01",
    admissionsRequirements: {
      academic: "Secondary credential equivalent to Alberta Grade 12.",
      language: "Proof of English language proficiency.",
      documents: [
        "Official Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Aviation (Flight Training)",
      "Bissett School of Business",
      "Nursing",
      "Computer Information Systems",
      "Communications & PR"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Home to western Canada's renowned collegiate Aviation flight school and the Bissett School of Business with Ashoka U Changemaker designation.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "ufv-canada",
    officialName: "University of the Fraser Valley",
    institution: "University of the Fraser Valley (UFV)",
    shortName: "UFV",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Abbotsford & Chilliwack, British Columbia",
    officialWebsite: "https://www.ufv.ca",
    sourceUrl: "https://international.ufv.ca",
    officialUrl: "https://international.ufv.ca",
    category: "university",
    institutionType: "International",
    title: "UFV International Excellence Entrance Scholarship (CAD $5,000)",
    isVerified: true,
    verificationSource: "Universities Canada & BC Ministry of Post-Secondary Education and Future Skills",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#004B49",
      text: "#FFFFFF",
      monogram: "UFV",
      crestColor: "#B78727",
      logoDescription: "UFV Forest Green & Gold Cascading Wave Crest"
    },
    eligibilityCountries: [
      "Canada",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Available to international students applying for degree coursework.",
      eligibleRegions: [
        "Global",
        "North America",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "CAD $5,000 entrance scholarship",
      details: "Awarded automatically to top applicants based on high school admission average.",
      tuitionCoverage: "CAD $5,000 tuition reduction"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $5,000 International Excellence Award",
      details: "Automatic entrance scholarship on admission."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $150 international application fee.",
      amount: "CAD $150"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $150 application fee."
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
      term: "Fall Semester 2026",
      deadlineText: "International Application Deadline: April 15, 2026",
      deadlineDate: "2026-04-15",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "April 15, 2026",
    deadlineDate: "2026-04-15",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to BC Grade 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Official Academic Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Agriculture & Berry Technology",
      "Aviation",
      "Kinesiology & Health Sciences",
      "Computer Information Systems",
      "Business Administration"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Located in the beautiful Fraser Valley near Vancouver, recognized for practical applied research in agricultural biotechnology and aviation.",
    officialRuleSummary: "Member of Universities Canada."
  },
  {
    id: "viu-canada",
    officialName: "Vancouver Island University",
    institution: "Vancouver Island University (VIU)",
    shortName: "VIU",
    country: "Canada",
    countryCode: "CA",
    countryFlag: "🇨🇦",
    city: "Nanaimo, British Columbia",
    officialWebsite: "https://www.viu.ca",
    sourceUrl: "https://international.viu.ca",
    officialUrl: "https://international.viu.ca",
    category: "university",
    institutionType: "International",
    title: "VIU International Regional & Academic Excellence Award (CAD $2,500–$5,000)",
    isVerified: true,
    verificationSource: "Universities Canada & BC Ministry of Post-Secondary Education and Future Skills",
    verifiedAt: "Academic Year 2026/2027",
    logo: {
      bg: "#003A63",
      text: "#009681",
      monogram: "VIU",
      crestColor: "#003A63",
      logoDescription: "Vancouver Island University Pacific Blue & Coastal Teal Emblem"
    },
    eligibilityCountries: [
      "Canada",
      "Ghana",
      "Nigeria",
      "Kenya",
      "All International Countries"
    ],
    nationalityEligibility: {
      category: "All International Citizens",
      details: "Open to international candidates commencing undergraduate or master's degrees.",
      eligibleRegions: [
        "Global",
        "North America",
        "Africa",
        "Asia"
      ]
    },
    degreeLevels: [
      "Undergraduate",
      "Postgraduate"
    ],
    fundingDetails: {
      type: "Partial / Merit",
      amount: "CAD $2,500 to $5,000 entrance award",
      details: "Granted to high-achieving international applicants upon acceptance.",
      tuitionCoverage: "CAD $2,500 to $5,000 entrance scholarship"
    },
    funding: {
      type: "Partial / Merit",
      amount: "CAD $2,500 to $5,000 Entrance Award",
      details: "Merit award applied to tuition."
    },
    applicationFees: {
      status: "Standard Fee",
      details: "CAD $150 international application processing fee.",
      amount: "CAD $150"
    },
    applicationFee: {
      status: "Standard Fee",
      details: "CAD $150 application fee."
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
      term: "Fall Semester 2026",
      deadlineText: "International Application Deadline: May 1, 2026",
      deadlineDate: "2026-05-01",
      cycleStatus: "open",
      statusNotice: "Admissions active.",
      isRolling: true
    },
    deadline: "May 1, 2026",
    deadlineDate: "2026-05-01",
    admissionsRequirements: {
      academic: "Secondary school certificate equivalent to BC Grade 12.",
      language: "Proof of English proficiency.",
      documents: [
        "Transcripts",
        "Passport Bio Page"
      ]
    },
    studyFields: [
      "Fisheries & Aquaculture",
      "Coastal Eco-Tourism",
      "Forestry",
      "Nursing",
      "Master of Business Administration (Dual Degree)"
    ],
    intakeTerm: "September 2026",
    verifiedBadge: "Verified Official Data",
    summary: "Magnificently situated on Vancouver Island overlooking the Salish Sea, recognized internationally for fisheries science, aquaculture research, and dual-degree MBAs.",
    officialRuleSummary: "Member of Universities Canada."
  }
];
