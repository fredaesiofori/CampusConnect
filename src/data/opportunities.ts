/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ghanaUniversities } from './ghanaUniversities';
import { usUniversities } from './usUniversities';
import { ukUniversities } from './ukUniversities';
import { nigeriaUniversities } from './nigeriaUniversities';
import { canadaUniversities } from './canadaUniversities';
import { australiaUniversities } from './australiaUniversities';
import { germanyUniversities } from './germanyUniversities';
import { kenyaUniversities } from './kenyaUniversities';
import { southAfricaUniversities } from './southAfricaUniversities';
import { moreGlobalUniversities } from './moreGlobalUniversities';

export type InstitutionType =
  | 'Public University'
  | 'Technical University'
  | 'Private University'
  | 'Specialized / Regional'
  | 'International';

export interface UniversityLogo {
  bg: string;
  text: string;
  monogram: string;
  crestColor: string;
  logoDescription?: string;
  logoUrl?: string;
  logoSourceUrl?: string;
}

export interface FundingDetails {
  type: 'Fully Funded' | '100% Need-Met' | 'Tuition Waiver' | 'Partial / Merit' | 'Government Aid' | (string & {});
  amount: string;
  details: string;
  tuitionCoverage?: string;
  livingStipend?: string;
}

export interface ApplicationFees {
  status: 'Free ($0 Fee)' | 'Fee Waiver Available' | 'Standard Fee' | (string & {});
  details: string;
  amount?: string;
  code?: string;
  waiverInstructions?: string;
}

export interface TestWaiverRules {
  status: 'Test-Free ($0 SAT)' | 'Test-Optional' | 'WAEC/WASSCE English Accepted' | 'Test Required' | (string & {});
  details: string;
  satPolicy?: string;
  englishProficiencyPolicy?: string;
  wassceExemptionDetails?: string;
}

export type ApplicationCycleStatus = 'open' | 'rolling' | 'expired';

export interface EvaluatedDeadline {
  status: ApplicationCycleStatus;
  badgeText: string;
  badgeVariant: 'open' | 'rolling' | 'expired';
  isExpired: boolean;
  isOpen: boolean;
  displayText: string;
  cycleNotice?: string;
}

export interface Deadlines {
  term: string;
  deadlineText: string;
  deadlineDate?: string | null;
  isRolling?: boolean;
  cycleStatus?: ApplicationCycleStatus;
  statusNotice?: string;
}

function parseDeadlineEndUtc(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  // Normalize bare YYYY-MM-DD dates to end-of-day UTC so deadlines remain valid throughout the listed day
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T23:59:59Z` : trimmed;
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function evaluateOpportunityDeadline(
  deadlines?: Deadlines,
  currentDate?: Date | string
): EvaluatedDeadline {
  if (!deadlines) {
    return {
      status: 'rolling',
      badgeText: 'Check Official Portal',
      badgeVariant: 'rolling',
      isExpired: false,
      isOpen: true,
      displayText: 'Check Official Portal',
    };
  }

  const now = currentDate ? new Date(currentDate) : new Date();
  const text = deadlines.deadlineText || '';
  const lowerText = text.toLowerCase();
  const dDate = parseDeadlineEndUtc(deadlines.deadlineDate);

  const isDatePassed = Boolean(dDate && dDate < now);
  const isExplicitExpired =
    deadlines.cycleStatus === 'expired' ||
    lowerText.includes('expired') ||
    lowerText.includes('closed') ||
    lowerText.includes('concluded');

  const isRolling =
    !isDatePassed &&
    !isExplicitExpired &&
    (deadlines.cycleStatus === 'rolling' ||
      Boolean(deadlines.isRolling) ||
      lowerText.includes('rolling') ||
      lowerText.includes('continuous'));

  // Always enforce date-based and explicit expiration before rolling/open checks
  if (isDatePassed || isExplicitExpired) {
    return {
      status: 'expired',
      badgeText: 'Deadline passed',
      badgeVariant: 'expired',
      isExpired: true,
      isOpen: false,
      displayText: 'Deadline passed',
      cycleNotice:
        deadlines.statusNotice ||
        'This application deadline has passed. Check the official institutional portal for upcoming intake dates.',
    };
  }

  if (isRolling) {
    return {
      status: 'rolling',
      badgeText: 'Rolling Admissions',
      badgeVariant: 'rolling',
      isExpired: false,
      isOpen: true,
      displayText: text || 'Rolling Admissions (Check Official Portal)',
      cycleNotice:
        deadlines.statusNotice || 'Applications evaluated on a rolling / intake basis.',
    };
  }

  if (dDate) {
    return {
      status: 'open',
      badgeText: 'Applications Open',
      badgeVariant: 'open',
      isExpired: false,
      isOpen: true,
      displayText: text,
      cycleNotice:
        deadlines.statusNotice || 'Applications open ahead of the published institutional deadline.',
    };
  }

  if (deadlines.cycleStatus === 'open') {
    return {
      status: 'open',
      badgeText: 'Applications Open',
      badgeVariant: 'open',
      isExpired: false,
      isOpen: true,
      displayText: text,
      cycleNotice: deadlines.statusNotice || 'Confirm exact closing dates on official institutional portal.',
    };
  }

  return {
    status: 'rolling',
    badgeText: 'Check Official Portal',
    badgeVariant: 'rolling',
    isExpired: false,
    isOpen: true,
    displayText: text || 'Check Official Portal',
    cycleNotice: deadlines.statusNotice || 'Verify current intake schedule on official portal.',
  };
}

export interface OpportunityItem {
  id: string;
  officialName: string;
  institution: string; // Compatibility alias
  shortName: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  officialWebsite: string;
  sourceUrl: string;
  officialUrl: string; // Compatibility alias
  category: 'university' | 'fee-waiver' | 'test-waiver' | 'scholarship' | 'admissions';
  institutionType?: InstitutionType;
  title: string;
  isVerified: boolean;
  verificationSource: string;
  verifiedAt: string;
  linkStatus?: 'verified' | 'needs-review';
  reviewNote?: string;
  logo: UniversityLogo;
  eligibilityCountries: string[];
  nationalityEligibility: {
    category: 'Ghanaian Citizens' | 'African Citizens' | 'All International Citizens' | 'All Nationalities' | (string & {});
    details: string;
    eligibleRegions: string[];
  };
  degreeLevels: (
    | 'Undergraduate'
    | "Bachelor's"
    | "Master's"
    | 'Postgraduate'
    | 'PhD'
    | 'Doctorate'
    | 'PhD / Doctorate'
    | string
  )[];
  fundingDetails: FundingDetails;
  funding: FundingDetails; // Compatibility alias
  applicationFees: ApplicationFees;
  applicationFee: ApplicationFees; // Compatibility alias
  testWaiverRules: TestWaiverRules;
  testPolicy: TestWaiverRules; // Compatibility alias
  deadlines: Deadlines;
  deadline?: string; // Compatibility alias
  deadlineDate?: string; // Compatibility alias
  admissionsRequirements: {
    academic?: string;
    language?: string;
    documents?: string[];
    documentsRequired?: string[];
    standardizedTests?: string;
    minGpa?: string;
    englishProficiency?: string;
  };
  studyFields: string[];
  intakeTerm: string;
  verifiedBadge: string;
  summary: string;
  officialRuleSummary: string;
}

export const authenticOpportunities: OpportunityItem[] = [
  // ALL 57 VERIFIED ACCREDITED TERTIARY INSTITUTIONS IN GHANA
  ...ghanaUniversities,

  // 46 VERIFIED ACCREDITED UNIVERSITIES & LIBERAL ARTS COLLEGES IN THE UNITED STATES (Total 54 with original)
  ...usUniversities,

  // 47 VERIFIED CHARTERED & RUSSELL GROUP UNIVERSITIES IN THE UNITED KINGDOM (Total 50 with original)
  ...ukUniversities,

  // 50 VERIFIED NUC-ACCREDITED FEDERAL, STATE & PRIVATE UNIVERSITIES IN NIGERIA (Total 51 with original)
  ...nigeriaUniversities,

  // 47 VERIFIED UNIVERSITIES CANADA ACCREDITED INSTITUTIONS (Total 50 with original)
  ...canadaUniversities,

  // 38 VERIFIED TEQSA ACCREDITED UNIVERSITIES IN AUSTRALIA (Total 40 with original)
  ...australiaUniversities,

  // 48 VERIFIED HRK ACCREDITED UNIVERSITIES IN GERMANY (Total 50 with original)
  ...germanyUniversities,

  // 49 VERIFIED CUE ACCREDITED UNIVERSITIES IN KENYA (Total 50 with original)
  ...kenyaUniversities,

  // 29 VERIFIED CHE/DHET ACCREDITED UNIVERSITIES IN SOUTH AFRICA (Total 30 with original)
  ...southAfricaUniversities,

  // VERIFIED GLOBAL FLAGSHIP INSTITUTIONS (India, etc.)
  ...moreGlobalUniversities,

  // 4. USA - Colby College ($0 Application Fee & Test-Free)
  {
    id: 'colby-college-usa',
    officialName: 'Colby College',
    institution: 'Colby College',
    shortName: 'Colby',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Waterville, Maine',
    officialWebsite: 'https://www.colby.edu',
    sourceUrl: 'https://www.colby.edu/admission/apply/',
    officialUrl: 'https://www.colby.edu/admission/apply/',
    category: 'fee-waiver',
    institutionType: 'Private University',
    title: 'Zero Application Fee & 100% Demonstrated Need Met (No Loans)',
    isVerified: true,
    verificationSource: 'Colby College Office of Admissions Official Universal $0 Application Fee Policy',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#002855',
      text: '#FFFFFF',
      monogram: 'COLBY',
      crestColor: '#8065FF',
      logoDescription: 'Colby College Deep Blue & White Seal',
      logoUrl: '/logos/colby-college-usa.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Colby_College_logo.svg'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'United States', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to all international students worldwide regardless of citizenship or country of origin.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: 'Full Financial Need Met Without Loans',
      details: 'Guarantees meeting 100% of demonstrated financial need for all admitted students, including international students, solely through grants.',
      tuitionCoverage: '100% Demonstrated Financial Need covered through institutional grant aid',
    },
    funding: {
      type: '100% Need-Met',
      amount: 'Full Financial Need Met Without Loans',
      details: 'Guarantees meeting 100% of demonstrated financial need for all admitted students, including international students, solely through grants.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: 'Colby has permanent $0 application fees for all applicants worldwide. No fee waiver code required.',
      amount: '$0.00 Permanent Universal Policy',
      code: 'NO-FEE-REQUIRED',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: 'Colby has permanent $0 application fees for all applicants worldwide. No fee waiver code required.',
      code: 'NO-FEE-REQUIRED',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Colby is permanently test-optional for all undergraduate applicants. SAT and ACT scores are never required for admission or financial aid.',
      satPolicy: 'Permanently test-optional. SAT/ACT never required.',
      englishProficiencyPolicy: 'TOEFL/IELTS optional or waived if secondary education was conducted in English.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Colby is permanently test-optional for all undergraduate applicants. SAT and ACT scores are never required for admission or financial aid.',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 2, 2027",
      deadlineDate: "2027-01-02",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Common Application actively open for Fall 2027 with universal $0 application fee for all students worldwide.",
    },
    deadline: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 2, 2027",
    deadlineDate: '2027-01-02',
    admissionsRequirements: {
      academic: 'Rigorous secondary school transcript (WASSCE, KCSE, Cambridge A-Levels, or equivalent top percentile academic achievement).',
      language: 'TOEFL/IELTS optional or waived if secondary education was conducted in English.',
      documents: [
        'Common Application',
        'High School Transcript / WASSCE Results',
        'School Counselor Recommendation',
        'Two Teacher Evaluations',
        'CSS Profile (for Financial Aid)',
      ],
      standardizedTests: 'SAT/ACT completely optional.',
    },
    studyFields: [
      'Computer Science',
      'Artificial Intelligence',
      'Economics',
      'Biology & Pre-Med',
      'Environmental Studies',
      'International Relations',
      'Mathematics',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of America’s most selective liberal arts colleges, committed to universal free applications and comprehensive need-based international grant funding.',
    officialRuleSummary: 'Official Colby College Admissions policy. Zero application fee automatically applied via Common Application.',
  },

  // 5. USA - Denison University ($0 Application Fee & Merit Aid)
  {
    id: 'denison-university-usa',
    officialName: 'Denison University',
    institution: 'Denison University',
    shortName: 'Denison',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Granville, Ohio',
    officialWebsite: 'https://denison.edu',
    sourceUrl: 'https://denison.edu/campus/finances/apply-for-scholarships-aid',
    officialUrl: 'https://denison.edu/campus/finances/apply-for-scholarships-aid',
    category: 'test-waiver',
    institutionType: 'Private University',
    title: 'Free Common App & Test-Optional International Admissions',
    isVerified: true,
    verificationSource: 'Denison University Office of Admissions International Policies',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#A6192E',
      text: '#FFFFFF',
      monogram: 'DU',
      crestColor: '#FFFFFF',
      logoDescription: 'Denison University Cardinal Red & White Monogram',
      logoUrl: '/logos/denison-university-usa.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Denison_University_logo.svg'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Welcomes applicants from all international jurisdictions. Generous merit and need-based institutional scholarships for non-US students.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: 'Merit Scholarships up to $48,000/yr + Need-Based Grants',
      details: 'Over $28 million awarded in international financial aid; admitted students receive comprehensive need- and merit-based institutional scholarships.',
      tuitionCoverage: 'Substantial merit awards plus need-based tuition assistance',
    },
    funding: {
      type: '100% Need-Met',
      amount: 'Merit Scholarships up to $48,000/yr + Need-Based Grants',
      details: 'Over $28 million awarded in international financial aid; admitted students receive comprehensive need- and merit-based institutional scholarships.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: 'Denison charges $0 application fee for all first-year applications submitted via the Common App.',
      amount: '$0.00 Free Common App',
      code: 'AUTOMATIC-$0',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: 'Denison charges $0 application fee for all first-year applications submitted via the Common App.',
      code: 'AUTOMATIC-$0',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Test-optional since 2008. International scholars can submit without SAT/ACT without any disadvantage.',
      satPolicy: 'Test-optional since 2008.',
      englishProficiencyPolicy: 'Duolingo English Test, TOEFL, or official high school English medium instruction letter.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Test-optional since 2008. International scholars can submit without SAT/ACT without any disadvantage.',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Early Decision I / Action: Nov 15, 2026 · Regular Decision: Jan 15, 2027",
      deadlineDate: "2027-01-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Applications open on Common App with free international application and test-optional review.",
    },
    deadline: "Early Decision I / Action: Nov 15, 2026 · Regular Decision: Jan 15, 2027",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'High school graduation certificate / WAEC results with strong marks across STEM and humanities.',
      language: 'Duolingo English Test, TOEFL, or official high school English medium instruction letter.',
      documents: [
        'Common Application',
        'Secondary School Report & Transcripts',
        'Two Academic Teacher Recommendations',
        'Denison Certificate of Finances',
      ],
      standardizedTests: 'SAT/ACT not required.',
    },
    studyFields: [
      'Data Analytics',
      'Computer Science',
      'Global Commerce',
      'Pre-Engineering',
      'Communication',
      'Biochemistry',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Premier Midwestern college known for practical career integration, data analytics, and substantial financial support for international undergraduates.',
    officialRuleSummary: 'Admissions policy verified on official Denison University registrar portal.',
  },

  // 6. UK - University of Oxford (Rhodes & Clarendon)
  {
    id: 'oxford-rhodes-uk',
    officialName: 'University of Oxford',
    institution: 'University of Oxford',
    shortName: 'Oxford',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    city: 'Oxford, England',
    officialWebsite: 'https://www.ox.ac.uk',
    sourceUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    officialUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Rhodes Scholarship for West & Southern Africa / Clarendon Fund',
    isVerified: true,
    verificationSource: 'Rhodes Trust Oxford & University of Oxford Graduate Admissions Directorate',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/oxford-rhodes-uk.svg',
      bg: '#002147',
      text: '#FFFFFF',
      monogram: 'OXFORD',
      crestColor: '#E7B75C',
      logoDescription: 'University of Oxford Navy Blue Shield with Gold Open Book & Crowns',
          },
    eligibilityCountries: [
      'Ghana',
      'Nigeria',
      'Benin',
      'Burkina Faso',
      'Cape Verde',
      'Gambia',
      'Guinea',
      'Guinea-Bissau',
      'Ivory Coast',
      'Liberia',
      'Mali',
      'Mauritania',
      'Niger',
      'Senegal',
      'Sierra Leone',
      'Togo',
      'Southern Africa',
    ],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Rhodes West Africa Constituency open to citizens of Benin, Burkina Faso, Cape Verde, Gambia, Ghana, Guinea, Guinea-Bissau, Ivory Coast, Liberia, Mali, Mauritania, Niger, Nigeria, Senegal, Sierra Leone, and Togo.',
      eligibleRegions: ['Ghana', 'Nigeria', 'West Africa', 'Southern Africa'],
    },
    degreeLevels: ["Master's", 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: '100% Full Tuition + £18,180 Annual Living Stipend + Flights',
      details: 'Covers all Oxford University fees, college fees, round-trip economy airfare to the UK, health surcharge, and visa costs.',
      tuitionCoverage: '100% University and College Tuition Fees Paid',
      livingStipend: '£18,180 annual living stipend plus flights & healthcare surcharge',
    },
    funding: {
      type: 'Fully Funded',
      amount: '100% Full Tuition + £18,180 Annual Living Stipend + Flights',
      details: 'Covers all Oxford University fees, college fees, round-trip economy airfare to the UK, health surcharge, and visa costs.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'University of Oxford offers application fee waivers for applicants from low-income countries designated by the World Bank.',
      amount: 'Fee waiver available based on DAC/World Bank low-income list',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'University of Oxford offers application fee waivers for applicants from low-income countries designated by the World Bank.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE / GMAT not required for the majority of Oxford graduate courses; SAT not applicable for postgraduate degrees.',
      satPolicy: 'SAT not required for postgraduate courses.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE / GMAT not required for the majority of Oxford graduate courses; SAT not applicable for postgraduate degrees.',
    },
    deadlines: {
      term: "Michaelmas 2027 (2026 Cycle Closed)",
      deadlineText: "August 1, 2026 (Expired / 2026 Cycle Closed · Next Opens June 2027)",
      deadlineDate: "2026-08-01",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "The 2026 Rhodes Scholarship application cycle for West Africa closed on August 1, 2026. The next application cycle will reopen in June 2027.",
    },
    deadline: "August 1, 2026 (Expired / 2026 Cycle Closed · Next Opens June 2027)",
    deadlineDate: '2026-08-01',
    admissionsRequirements: {
      academic: 'First Class Honours undergraduate degree or a GPA of 3.7+ out of 4.0 (or equivalent).',
      language: 'Higher level English proficiency (IELTS 7.5 / TOEFL 110) or degree completed in an English-speaking country/institution.',
      documents: [
        'Official University Academic Transcript',
        'Personal Statement',
        'Academic CV',
        'Four Letters of Recommendation',
        'Proof of Citizenship',
      ],
      standardizedTests: 'GRE only required for select Economics & Saïd Business School programs.',
    },
    studyFields: [
      'Public Policy',
      'Data Science',
      'Law',
      'Global Health Science',
      'Economics for Development',
      'Engineering Science',
    ],
    intakeTerm: 'Michaelmas 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'The world’s oldest and highest-prestige international scholarship, enabling exceptional African leaders to study at Oxford with zero out-of-pocket costs.',
    officialRuleSummary: 'Governed by the Rhodes Trust in Oxford. Open to citizens of West African nations including Ghana, Nigeria, and regional territories.',
  },

  // 7. UK - University of Cambridge (Gates Cambridge)
  {
    id: 'cambridge-gates-uk',
    officialName: 'University of Cambridge',
    institution: 'University of Cambridge',
    shortName: 'Cambridge',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    city: 'Cambridge, England',
    officialWebsite: 'https://www.cam.ac.uk',
    sourceUrl: 'https://www.undergraduate.study.cam.ac.uk/apply',
    officialUrl: 'https://www.undergraduate.study.cam.ac.uk/apply',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Gates Cambridge Scholarship (Full Cost of Attendance)',
    isVerified: true,
    verificationSource: 'Gates Cambridge Trust & Cambridge University Student Registry',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/cambridge-gates-uk.svg',
      bg: '#A3C1AD',
      text: '#000000',
      monogram: 'CAM',
      crestColor: '#A81C2E',
      logoDescription: 'University of Cambridge Scarlet & Gold Arms with Lion and Book',
          },
    eligibilityCountries: ['All Countries outside the UK', 'Ghana', 'Nigeria', 'Kenya', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to citizens of any country outside the United Kingdom applying to pursue a full-time postgraduate degree at Cambridge.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ["Master's", 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Cost of Attendance (~£45,000/yr value)',
      details: 'Covers University Composition Fee, maintenance allowance of £20,000 per year, inbound and outbound airfare, and visa/NHS surcharge costs.',
      tuitionCoverage: '100% University Composition Fee and College Fees',
      livingStipend: '£20,000 annual maintenance allowance + family allowance where applicable',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Cost of Attendance (~£45,000/yr value)',
      details: 'Covers University Composition Fee, maintenance allowance of £20,000 per year, inbound and outbound airfare, and visa/NHS surcharge costs.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Cambridge offers application fee waivers for eligible international applicants from low-income countries.',
      amount: 'Fee waiver available via applicant portal',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Cambridge offers application fee waivers for eligible international applicants from low-income countries.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE not required for the vast majority of graduate departments at Cambridge. SAT not applicable.',
      satPolicy: 'No SAT required for postgraduate studies.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE not required for the vast majority of graduate departments at Cambridge. SAT not applicable.',
    },
    deadlines: {
      term: "2027/2028 Academic Year",
      deadlineText: "December 3, 2026 (International Round)",
      deadlineDate: "2026-12-03",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Gates Cambridge Scholarship applications actively open for 2027/2028 postgraduate courses.",
    },
    deadline: "December 3, 2026 (International Round)",
    deadlineDate: '2026-12-03',
    admissionsRequirements: {
      academic: 'Outstanding intellectual ability, exceptional academic record (equivalent to a UK First Class Honours).',
      language: 'English proficiency (IELTS 7.5 or equivalent) unless prior degree was taught in English.',
      documents: [
        'Postgraduate Application & Research Proposal',
        'Gates Cambridge Statement',
        'Academic Transcripts',
        'Two Academic References + One Personal Reference',
      ],
      standardizedTests: 'GRE only required by Judge Business School and specific Economics tracks.',
    },
    studyFields: [
      'Biotechnology',
      'Computer Science',
      'Engineering',
      'Law',
      'Medical Science',
      'Physics',
      'Development Studies',
    ],
    intakeTerm: 'Michaelmas 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of the most competitive and prestigious scholarships in the world, funding outstanding international scholars to undertake postgraduate studies at Cambridge.',
    officialRuleSummary: 'Administered under the Gates Cambridge Trust and University of Cambridge Board of Graduate Studies.',
  },

  // 8. CANADA - University of Toronto (Lester B. Pearson)
  {
    id: 'utoronto-pearson-canada',
    officialName: 'University of Toronto',
    institution: 'University of Toronto',
    shortName: 'U of T',
    country: 'Canada',
    countryCode: 'CA',
    countryFlag: '🇨🇦',
    city: 'Toronto, Ontario',
    officialWebsite: 'https://www.utoronto.ca',
    sourceUrl: 'https://future.utoronto.ca/pearson/',
    officialUrl: 'https://future.utoronto.ca/pearson/',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Lester B. Pearson International Scholarship Program',
    isVerified: true,
    verificationSource: 'University of Toronto Future Students Admissions Directorate',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/utoronto-pearson-canada.svg',
      bg: '#002A5C',
      text: '#FFFFFF',
      monogram: 'U of T',
      crestColor: '#FFFFFF',
      logoDescription: 'University of Toronto Royal Blue Crest',
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Scholars'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to international students studying on a Canadian study permit who demonstrate exceptional academic achievement and creative leadership.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Tuition, Books, Incidental Fees & Full Residence Support for 4 Years',
      details: 'Canada’s premier undergraduate scholarship for international students demonstrating exceptional academic achievement and leadership.',
      tuitionCoverage: '100% Full Undergraduate Tuition covered for 4 years',
      livingStipend: 'Full residence room & board and incidental fees provided',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Tuition, Books, Incidental Fees & Full Residence Support for 4 Years',
      details: 'Canada’s premier undergraduate scholarship for international students demonstrating exceptional academic achievement and leadership.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'OUAC / U of T international application fee applies; scholarship covers full residency and 4-year tuition if selected.',
      amount: 'CAD $180 (OUAC International)',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'OUAC / U of T international application fee applies; scholarship covers full residency and 4-year tuition if selected.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'SAT/ACT scores are never required for Canadian high school or international diploma applicants.',
      satPolicy: 'No SAT/ACT required in Canada.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'SAT/ACT scores are never required for Canadian high school or international diploma applicants.',
    },
    deadlines: {
      term: "Fall 2027",
      deadlineText: "School Nomination: Nov 30, 2026 · Student Application: Jan 15, 2027",
      deadlineDate: "2026-11-30",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "High school nomination portal actively open for Lester B. Pearson International Scholarship.",
    },
    deadline: "School Nomination: Nov 30, 2026 · Student Application: Jan 15, 2027",
    deadlineDate: '2026-11-30',
    admissionsRequirements: {
      academic: 'High school senior nominated by their secondary school with outstanding academic records (top 5% of class).',
      language: 'English proficiency test (IELTS 6.5+ / Duolingo 120+) or verified 4 years of secondary study in English.',
      documents: [
        'School Nomination Form',
        'U of T International Application',
        'Lester B. Pearson Scholarship Essay',
        'Two Referee Letters',
      ],
      standardizedTests: 'No SAT/ACT required for Canada.',
    },
    studyFields: [
      'Engineering',
      'Computer Science',
      'Commerce / Rotman',
      'Life Sciences',
      'Humanities & Social Sciences',
      'Architecture',
    ],
    intakeTerm: 'September 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Recognizes international students who demonstrate exceptional academic achievement, creative leadership, and a positive global impact.',
    officialRuleSummary: 'Official U of T Future Students guidelines. High school counselor must nominate candidate prior to institutional deadline.',
  },

  // 9. CANADA - McGill University
  {
    id: 'mcgill-university-canada',
    officialName: 'McGill University',
    institution: 'McGill University Montreal',
    shortName: 'McGill',
    country: 'Canada',
    countryCode: 'CA',
    countryFlag: '🇨🇦',
    city: 'Montreal, Quebec',
    officialWebsite: 'https://www.mcgill.ca',
    sourceUrl: 'https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships',
    officialUrl: 'https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Major Entrance Scholarships & Mastercard Foundation Partner Program',
    isVerified: true,
    verificationSource: 'McGill University Scholarships and Student Aid Office',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/mcgill-university-canada.png',
      bg: '#ED1B2F',
      text: '#FFFFFF',
      monogram: 'MCGILL',
      crestColor: '#FFFFFF',
      logoDescription: 'McGill University Red & White Crown and Martlets Crest',
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'Nigeria', 'Kenya', 'Sub-Saharan Africa'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Entrance scholarships open to all international high school graduates; Mastercard Foundation awards explicitly open to Sub-Saharan African citizens.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate', "Master's"],
    fundingDetails: {
      type: 'Tuition Waiver',
      amount: 'Major Entrance Awards up to CAD $12,000/yr (Renewable for 4 Years)',
      details: 'Substantial merit scholarships for top entering undergraduates; MCF partnership provides full rides for eligible African candidates.',
      tuitionCoverage: 'Renewable tuition subsidies up to full cost of attendance for MCF scholars',
    },
    funding: {
      type: 'Tuition Waiver',
      amount: 'Major Entrance Awards up to CAD $12,000/yr (Renewable for 4 Years)',
      details: 'Substantial merit scholarships for top entering undergraduates; MCF partnership provides full rides for eligible African candidates.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'CAD $138.64 application fee for undergraduate programs submitted through the McGill portal.',
      amount: 'CAD $138.64',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'CAD $138.64 online credit card fee.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'McGill does not require SAT/ACT for students applying from Canadian or international curriculums outside the United States.',
      satPolicy: 'No SAT/ACT required for non-US high school students.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'McGill does not require SAT/ACT for students applying from Canadian or international curriculums outside the United States.',
    },
    deadlines: {
      term: "Fall 2027",
      deadlineText: "Regular International Deadline: Jan 15, 2027",
      deadlineDate: "2027-01-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "McGill Enrolment Services portal open for Fall 2027 undergraduate admissions and Major Entrance awards.",
    },
    deadline: "Regular International Deadline: Jan 15, 2027",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'Top high school academic record (minimum 85%+ or high A/B in WASSCE/A-Levels depending on faculty).',
      language: 'IELTS 6.5+ or Duolingo 115+ (exempt if high school instruction was in English).',
      documents: [
        'McGill Online Application',
        'High School Academic Transcripts',
        'Major Entrance Scholarship Application Form',
      ],
      standardizedTests: 'No SAT/ACT required.',
    },
    studyFields: [
      'Biomedical Engineering',
      'Computer Science',
      'Desautels Faculty of Management',
      'Neuroscience',
      'Environmental Sciences',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of Canada’s most prestigious institutions, attracting world-class researchers and offering substantial entrance awards for global scholars.',
    officialRuleSummary: 'Official McGill Scholarships and Student Aid Office guidelines.',
  },

  // 10. GERMANY - Technical University of Munich (DAAD / Zero Tuition)
  {
    id: 'tum-germany-daad',
    officialName: 'Technical University of Munich',
    institution: 'Technical University of Munich (TUM)',
    shortName: 'TUM',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    city: 'Munich, Bavaria',
    officialWebsite: 'https://www.tum.de',
    sourceUrl: 'https://www.tum.de/en/studies/international-students',
    officialUrl: 'https://www.tum.de/en/studies/international-students',
    category: 'university',
    institutionType: 'Technical University',
    title: 'DAAD Helmut-Schmidt & Zero/Low Tuition Public STEM Degrees',
    isVerified: true,
    verificationSource: 'DAAD (German Academic Exchange Service) & Bavarian Higher Education Directorate',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/tum-germany-daad.png',
      bg: '#3070B3',
      text: '#FFFFFF',
      monogram: 'TUM',
      crestColor: '#FFFFFF',
      logoDescription: 'Technical University of Munich Blue & White Block Mark',
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'DAC List Developing Nations', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'DAAD programs target future leaders from developing countries (DAC list including Ghana, Nigeria, Kenya) and global scholars.',
      eligibleRegions: ['Ghana', 'Africa', 'Developing Nations', 'International'],
    },
    degreeLevels: ["Master's", 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: '€934 Monthly Allowance + Full Health Insurance + Travel Subsidy',
      details: 'DAAD Helmut-Schmidt-Programme covers full living costs, rent allowance, round-trip travel, and German language prep courses.',
      livingStipend: '€934 monthly allowance + health insurance + travel subsidies',
    },
    funding: {
      type: 'Fully Funded',
      amount: '€934 Monthly Allowance + Full Health Insurance + Travel Subsidy',
      details: 'DAAD Helmut-Schmidt-Programme covers full living costs, rent allowance, round-trip travel, and German language prep courses.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Uni-Assist VPD evaluation fee covered for DAAD scholars; direct TUM online application fee is €0.',
      amount: '€0 direct TUM portal fee',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Uni-Assist VPD evaluation fee covered for DAAD scholars; direct TUM online application fee is €0.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT or GRE required for accredited bachelor degrees. Technical assessment interview or aptitude assessment conducted online.',
      satPolicy: 'No SAT/ACT required for German universities.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT or GRE required for accredited bachelor degrees. Technical assessment interview or aptitude assessment conducted online.',
    },
    deadlines: {
      term: "Winter 2026/2027 (Cycle Concluded)",
      deadlineText: "July 31, 2026 (Expired / Winter 2026 Closed · Next Cycle Opens Feb 2027)",
      deadlineDate: "2026-07-31",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "DAAD EPOS applications for Winter 2026 closed on July 31, 2026. Applications for 2027/2028 intake open in February 2027.",
    },
    deadline: "July 31, 2026 (Expired / Winter 2026 Closed · Next Cycle Opens Feb 2027)",
    deadlineDate: '2026-07-31',
    admissionsRequirements: {
      academic: 'Bachelor degree in engineering, natural sciences, or public administration with above-average grades (German grade 2.5 or better).',
      language: 'English B2/C1 (IELTS 6.5+) for English-taught master’s programs; German not required for international tracks.',
      documents: [
        'Degree Certificate & Transcript of Records',
        'Letter of Motivation',
        'DAAD Application Form',
        'Two Recommendation Letters',
        'Curriculum Vitae (Europass)',
      ],
      standardizedTests: 'No standardized tests (SAT/ACT/GRE) required for general DAAD admission.',
    },
    studyFields: [
      'Robotics & Artificial Intelligence',
      'Sustainable Technology',
      'Biomedical Engineering',
      'Data Engineering & Analytics',
      'Informatics',
    ],
    intakeTerm: 'Winter Semester 2026/2027',
    verifiedBadge: 'Verified Official Data',
    summary: 'Germany’s top-ranked technical university, world-renowned for engineering excellence and fully subsidized public higher education.',
    officialRuleSummary: 'Regulated under the Bavarian Higher Education Act and German Academic Exchange Service (DAAD) official guidelines.',
  },

  // 11. USA - Berea College ($0 Tuition Promise for All Students)
  {
    id: 'berea-college-usa',
    officialName: 'Berea College',
    institution: 'Berea College',
    shortName: 'Berea',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Berea, Kentucky',
    officialWebsite: 'https://www.berea.edu',
    sourceUrl: 'https://www.berea.edu/admissions',
    officialUrl: 'https://www.berea.edu/admissions',
    category: 'fee-waiver',
    institutionType: 'Private University',
    title: 'No-Tuition Promise for 100% of Enrolled International Students',
    isVerified: true,
    verificationSource: 'Berea College Office of Admissions Official Tuition Promise Charter',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#14213D',
      text: '#FFFFFF',
      monogram: 'BEREA',
      crestColor: '#FCA311',
      logoDescription: 'Berea College Navy & Gold Lamp of Learning',
      logoUrl: '/logos/berea-college-usa.png',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Berea_college_full_logo.png'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to all international undergraduate students demonstrating high financial need and academic potential.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: '100% Tuition Paid ($44,000/yr) + Work-Study Stipend',
      details: 'Every admitted student receives the Berea College Tuition Promise Scholarship covering 100% of tuition for all four years.',
      tuitionCoverage: '100% Tuition Paid for 4 Full Years ($176,000 Total Value)',
      livingStipend: 'Campus work-study position provided to cover room, board, and books',
    },
    funding: {
      type: 'Fully Funded',
      amount: '100% Tuition Paid ($44,000/yr) + Work-Study Stipend',
      details: 'Every admitted student receives the Berea College Tuition Promise Scholarship covering 100% of tuition for all four years.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: '$0 Application Fee for all international applicants. Berea never charges application fees.',
      amount: '$0.00 Universal Free Application',
      code: 'AUTOMATIC-BEREA',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: '$0 Application Fee for all international applicants. Berea never charges application fees.',
      code: 'AUTOMATIC-BEREA',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'SAT/ACT scores optional; evaluated holistically with secondary school academic transcript and personal essays.',
      satPolicy: 'SAT/ACT scores optional.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'SAT/ACT scores optional; evaluated holistically with secondary school academic transcript and personal essays.',
    },
    deadlines: {
      term: "Fall 2027",
      deadlineText: "Early Action: Nov 30, 2026 · Regular Decision: Jan 15, 2027",
      deadlineDate: "2027-01-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Berea College portal open for international applicants with 100% tuition-free promise.",
    },
    deadline: "Early Action: Nov 30, 2026 · Regular Decision: Jan 15, 2027",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'Strong secondary school completion (WASSCE, KCSE, or equivalent) with high marks and demonstrated financial need.',
      language: 'Duolingo English Test (105+), TOEFL, or IELTS.',
      documents: [
        'Berea International Application',
        'Secondary School Records',
        'International Financial Questionnaire',
        'Two Recommendation Forms',
      ],
      standardizedTests: 'SAT/ACT optional.',
    },
    studyFields: [
      'Computer Science',
      'Business Administration',
      'Nursing',
      'Engineering Technologies',
      'Agriculture & Natural Resources',
      'Economics',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'The only top-ranked US college that charges zero tuition to any student. Every admitted international scholar receives an automatic full-tuition scholarship.',
    officialRuleSummary: 'Official Berea College policy: 100% of admitted students receive the Tuition Promise Scholarship. No loans required.',
  },

  // 12. UK - University of Edinburgh (Mastercard Foundation & WAEC Waiver)
  {
    id: 'edinburgh-mcf-uk',
    officialName: 'University of Edinburgh',
    institution: 'University of Edinburgh',
    shortName: 'Edinburgh',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    city: 'Edinburgh, Scotland',
    officialWebsite: 'https://www.ed.ac.uk',
    sourceUrl: 'https://study.ed.ac.uk/',
    officialUrl: 'https://study.ed.ac.uk/',
    category: 'admissions',
    institutionType: 'Public University',
    title: 'Mastercard Foundation Scholars & WASSCE English Language Waiver',
    isVerified: true,
    verificationSource: 'University of Edinburgh College of Humanities & Mastercard Foundation Secretariat',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/edinburgh-mcf-uk.png',
      bg: '#041E42',
      text: '#FFFFFF',
      monogram: 'EDIN',
      crestColor: '#D9381E',
      logoDescription: 'University of Edinburgh Scottish Rampant Lion & Shield',
          },
    eligibilityCountries: ['Ghana', 'Nigeria', 'Kenya', 'Rwanda', 'Sub-Saharan African Countries'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Applicants must be citizens of and ordinarily resident in a Sub-Saharan African country (including Ghana, Nigeria, Kenya).',
      eligibleRegions: ['Ghana', 'Nigeria', 'Kenya', 'Sub-Saharan Africa'],
    },
    degreeLevels: ["Master's"],
    fundingDetails: {
      type: 'Fully Funded',
      amount: '100% Tuition, Monthly Living Allowance, Flights & Accommodation',
      details: 'Full scholarship covering travel, tuition, living expenses, laptop, and career leadership support throughout the degree.',
      tuitionCoverage: '100% Tuition Fees covered by Mastercard Foundation Partnership',
      livingStipend: 'Full accommodation, monthly living allowance, and return airfare provided',
    },
    funding: {
      type: 'Fully Funded',
      amount: '100% Tuition, Monthly Living Allowance, Flights & Accommodation',
      details: 'Full scholarship covering travel, tuition, living expenses, laptop, and career leadership support throughout the degree.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Application fee waivers automatically available for Mastercard Foundation applicants from Sub-Saharan Africa.',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Application fee waivers automatically available for Mastercard Foundation applicants from Sub-Saharan Africa.',
    },
    testWaiverRules: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE / WAEC English grade C6 or better accepted as satisfying University of Edinburgh English language proficiency requirements.',
      wassceExemptionDetails: 'Official waiver: WAEC/WASSCE English grade A1–C6 accepted for direct entry.',
    },
    testPolicy: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE / WAEC English grade C6 or better accepted as satisfying University of Edinburgh English language proficiency requirements.',
    },
    deadlines: {
      term: "2027/2028 Academic Year",
      deadlineText: "December 10, 2026",
      deadlineDate: "2026-12-10",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Mastercard Foundation Scholars Program applications open for postgraduate master’s entry.",
    },
    deadline: "December 10, 2026",
    deadlineDate: '2026-12-10',
    admissionsRequirements: {
      academic: 'UK 2:1 Honours equivalent or strong undergraduate GPA from an accredited African university.',
      language: 'WAEC English grade A1-C6 or IELTS equivalent.',
      documents: [
        'Degree Certificate',
        'Academic Transcript',
        'Mastercard Foundation Application Essay',
        'Two References',
        'Proof of Nationality',
      ],
      standardizedTests: 'No GRE/GMAT required for Edinburgh Mastercard Foundation postgraduate tracks.',
    },
    studyFields: [
      'Africa & International Development',
      'Public Health',
      'Data, Inequality and Society',
      'Environmental Sustainability',
      'Global Health Policy',
    ],
    intakeTerm: 'September 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of the world’s ancient universities, partnering with the Mastercard Foundation to fund young African changemakers in science and policy.',
    officialRuleSummary: 'Official Edinburgh College of Humanities and Social Science language and scholarship regulations.',
  },

  // 13. AUSTRALIA - University of Melbourne (Melbourne International Undergraduate)
  {
    id: 'unimelb-australia',
    officialName: 'University of Melbourne',
    institution: 'University of Melbourne',
    shortName: 'UniMelb',
    country: 'Australia',
    countryCode: 'AU',
    countryFlag: '🇦🇺',
    city: 'Melbourne, Victoria',
    officialWebsite: 'https://www.unimelb.edu.au',
    sourceUrl: 'https://study.unimelb.edu.au/',
    officialUrl: 'https://study.unimelb.edu.au/',
    category: 'university',
    institutionType: 'Public University',
    title: 'Melbourne International Undergraduate Scholarship & Research Grants',
    isVerified: true,
    verificationSource: 'University of Melbourne Academic Board & Group of Eight International Office',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/unimelb-australia.svg',
      bg: '#092B5A',
      text: '#FFFFFF',
      monogram: 'MELB',
      crestColor: '#C49A45',
      logoDescription: 'University of Melbourne Blue & Gold Victory Crest',
          },
    eligibilityCountries: ['All Countries (Non-Australian/NZ)', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Eligible for all citizens of countries other than Australia and New Zealand. Automatic assessment upon university offer.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: {
      type: 'Tuition Waiver',
      amount: 'Up to 100% Full Fee Remission (Worth AUD $140,000)',
      details: 'Awarded automatically to high-achieving international students based on past academic merit upon offer issuance.',
      tuitionCoverage: '50% to 100% Full Tuition Fee Remission for the duration of the degree',
    },
    funding: {
      type: 'Tuition Waiver',
      amount: 'Up to 100% Full Fee Remission (Worth AUD $140,000)',
      details: 'Awarded automatically to high-achieving international students based on past academic merit upon offer issuance.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Application fee waivers available through authorized university representative education expos and official agent portal.',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Application fee waivers available through authorized university representative education expos and official agent portal.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'Australian universities do not require SAT or ACT scores. Admission is determined solely on high school marks or tertiary results.',
      satPolicy: 'SAT/ACT scores not required in Australia.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'Australian universities do not require SAT or ACT scores. Admission is determined solely on high school marks or tertiary results.',
    },
    deadlines: {
      term: 'Semester 1 2027 (Direct Cutoff Passed)',
      deadlineText: "October 31, 2026",
      deadlineDate: "2026-10-31",
      isRolling: false,
      cycleStatus: 'expired',
      statusNotice: 'Semester 1 (February 2027) international cutoff (October 31, 2026) has passed. Check the official portal for Semester 2 (July 2027) dates.',
    },
    deadline: "October 31, 2026",
    deadlineDate: '2026-10-31',
    admissionsRequirements: {
      academic: 'High academic standing in secondary qualification (GCE A-Levels, IB, or recognized university foundation program).',
      language: 'IELTS 6.5 with no band less than 6.0, or TOEFL equivalent.',
      documents: [
        'High School / University Academic Transcripts',
        'Passport ID Page',
        'Graduation Certificate',
        'Evidence of English Proficiency',
      ],
      standardizedTests: 'No SAT/ACT required in Australia.',
    },
    studyFields: [
      'Biomedicine',
      'Computing and Software Systems',
      'Commerce',
      'Civil Engineering',
      'Design & Architecture',
      'Agriculture',
    ],
    intakeTerm: 'Semester 1 (Feb 2027) & Semester 2 (July 2026)',
    verifiedBadge: 'Verified Official Data',
    summary: 'Ranked #1 in Australia and #14 in the world (QS 2025), renowned for transformative research and comprehensive international fee remission awards.',
    officialRuleSummary: 'Subject to Australian Department of Home Affairs student visa requirements and University of Melbourne selection regulations.',
  },

  // 14. AUSTRALIA - Australian National University (ANU)
  {
    id: 'anu-australia',
    officialName: 'Australian National University',
    institution: 'Australian National University (ANU)',
    shortName: 'ANU',
    country: 'Australia',
    countryCode: 'AU',
    countryFlag: '🇦🇺',
    city: 'Canberra, ACT',
    officialWebsite: 'https://www.anu.edu.au',
    sourceUrl: 'https://www.anu.edu.au/study/scholarships/find-a-scholarship/anu-chancellor%E2%80%99s-international-scholarship',
    officialUrl: 'https://www.anu.edu.au/study/scholarships/find-a-scholarship/anu-chancellor%E2%80%99s-international-scholarship',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'ANU Chancellor’s International Scholarship & Research Awards',
    isVerified: true,
    verificationSource: 'ANU Division of Student Administration and Academic Services',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/anu-australia.svg',
      bg: '#000000',
      text: '#FFFFFF',
      monogram: 'ANU',
      crestColor: '#C49A45',
      logoDescription: 'ANU Black & Gold Boomerang Shield Crest',
          },
    eligibilityCountries: ['All Countries (Non-Australian/NZ)', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Awarded to high-achieving international applicants from regions including Africa, Asia, Europe, and the Americas.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate', "Master's"],
    fundingDetails: {
      type: 'Tuition Waiver',
      amount: '25% to 50% Tuition Reduction (Up to AUD $25,000/yr)',
      details: 'Chancellor’s International Scholarship awarded automatically based on academic merit; no separate scholarship application required.',
      tuitionCoverage: 'Significant tuition reduction for all standard degree years',
    },
    funding: {
      type: 'Tuition Waiver',
      amount: '25% to 50% Tuition Reduction (Up to AUD $25,000/yr)',
      details: 'Chancellor’s International Scholarship awarded automatically based on academic merit; no separate scholarship application required.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'ANU waives the AUD $100 application fee during official Virtual Open Day promotions and for eligible scholarship nominees.',
      amount: 'AUD $100 (Waivers available during promotional periods)',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'AUD $100 application fee waived during specific application cycles.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'Australian universities evaluate high school qualifications directly; SAT/ACT is not required.',
      satPolicy: 'No SAT/ACT required.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'Australian universities evaluate high school qualifications directly; SAT/ACT is not required.',
    },
    deadlines: {
      term: "Semester 1 2027",
      deadlineText: "December 15, 2026",
      deadlineDate: "2026-12-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Applications open for Semester 1 2027 international intake and Chancellor’s International Scholarship.",
    },
    deadline: "December 15, 2026",
    deadlineDate: '2026-12-15',
    admissionsRequirements: {
      academic: 'Equivalent of an Australian ATAR 85-98 depending on degree program (evaluated from national secondary credentials).',
      language: 'IELTS 6.5 overall (minimum 6.0 in each band) or equivalent PTE/TOEFL.',
      documents: [
        'Official Academic Transcripts',
        'Passport Identification Document',
        'Proof of English Proficiency',
      ],
      standardizedTests: 'None required.',
    },
    studyFields: [
      'Advanced Computing',
      'International Security Studies',
      'Finance & Economics',
      'Environmental Management',
      'Actuarial Studies',
    ],
    intakeTerm: 'Semester 1 (Feb 2027)',
    verifiedBadge: 'Verified Official Data',
    summary: 'Australia’s national university, located in the federal capital Canberra, globally ranked for public policy, computer science, and international relations.',
    officialRuleSummary: 'ANU Admissions Directorate and Australian Higher Education standards.',
  },

  // 15. USA - Harvard University (Need-Blind & Full Financial Aid)
  {
    id: 'harvard-university-usa',
    officialName: 'Harvard University',
    institution: 'Harvard University',
    shortName: 'Harvard',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Cambridge, Massachusetts',
    officialWebsite: 'https://www.harvard.edu',
    sourceUrl: 'https://college.harvard.edu/admissions',
    officialUrl: 'https://college.harvard.edu/admissions',
    category: 'scholarship',
    institutionType: 'Private University',
    title: '100% Need-Blind International Admissions & Full Financial Aid',
    isVerified: true,
    verificationSource: 'Harvard College Griffin Financial Aid Office Official Need-Blind International Guarantee',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/harvard-university-usa.svg',
      bg: '#A51C30',
      text: '#FFFFFF',
      monogram: 'HARVARD',
      crestColor: '#FFFFFF',
      logoDescription: 'Harvard University Crimson Veritas Shield',
          },
    eligibilityCountries: ['All Nationalities Worldwide', 'Ghana', 'International Global'],
    nationalityEligibility: {
      category: 'All Nationalities',
      details: 'Strictly need-blind for all citizens of the world. International applicants are considered under the identical standard as US applicants with 100% need met.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Financial Need Met (Zero Loans)',
      details: 'Families with annual income below $85,000 pay $0 for tuition, room, board, and health insurance. Includes $2,000 startup grant.',
      tuitionCoverage: '100% Full Financial Need Met without student loans',
      livingStipend: 'Full room, board, and personal expenses grant for families earning under $85,000/yr',
    },
    funding: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Financial Need Met (Zero Loans)',
      details: 'Families with annual income below $85,000 pay $0 for tuition, room, board, and health insurance. Includes $2,000 startup grant.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Automatic Common App fee waivers granted to any student requesting it without financial verification documentation.',
      amount: '$85 (Automated waiver request on Common App with no documentation required)',
      code: 'COMMON-APP-WAIVER',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Automatic Common App fee waivers granted to any student requesting it without financial verification documentation.',
      code: 'COMMON-APP-WAIVER',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Harvard evaluates international applicants holistically. Scores are optional through the admitted class of 2030.',
      satPolicy: 'Test-optional policy in effect.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Harvard evaluates international applicants holistically. Scores are optional through the admitted class of 2030.',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Restrictive Early Action: Nov 1, 2026 · Regular Decision: Jan 1, 2027",
      deadlineDate: "2027-01-01",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Applications open on Common Application and Coalition with 100% need-blind financial aid for all international applicants.",
    },
    deadline: "Restrictive Early Action: Nov 1, 2026 · Regular Decision: Jan 1, 2027",
    deadlineDate: '2027-01-01',
    admissionsRequirements: {
      academic: 'Exceptional academic excellence (WASSCE, IB, A-Levels, or equivalent national credentials with distinction).',
      language: 'English proficiency demonstration; high school curriculum in English satisfies requirement.',
      documents: [
        'Common Application',
        'Secondary School Report & Midyear Report',
        'Two Teacher Evaluations',
        'Counselor Recommendation',
      ],
      standardizedTests: 'SAT/ACT optional.',
    },
    studyFields: [
      'Computer Science',
      'Applied Mathematics',
      'Economics',
      'Government & International Relations',
      'Molecular Biology',
      'Engineering Sciences',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of only seven US universities that is strictly need-blind for all international applicants, ensuring admission regardless of ability to pay.',
    officialRuleSummary: 'Official Harvard College Financial Aid Office regulations: financial need does not impact admission decisions.',
  },

  // 16. USA - Princeton University (100% Need-Blind & Loan-Free)
  {
    id: 'princeton-university-usa',
    officialName: 'Princeton University',
    institution: 'Princeton University',
    shortName: 'Princeton',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Princeton, New Jersey',
    officialWebsite: 'https://www.princeton.edu',
    sourceUrl: 'https://admission.princeton.edu/cost-aid',
    officialUrl: 'https://admission.princeton.edu/cost-aid',
    category: 'scholarship',
    institutionType: 'Private University',
    title: '100% Need-Blind International Admissions & No-Loan Financial Aid',
    isVerified: true,
    verificationSource: 'Princeton Undergraduate Financial Aid Office Official Charter',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/princeton-university-usa.svg',
      bg: '#E77500',
      text: '#000000',
      monogram: 'PU',
      crestColor: '#000000',
      logoDescription: 'Princeton University Orange & Black Shield with Open Bible',
          },
    eligibilityCountries: ['All Nationalities Worldwide', 'Ghana', 'International Global'],
    nationalityEligibility: {
      category: 'All Nationalities',
      details: 'Princeton is completely need-blind for all international applicants. Seeking financial aid does not disadvantage any applicant.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: 'Full Financial Need Met Without Loans (Zero Debt)',
      details: 'Families with annual income up to $100,000 pay nothing for tuition, room, and board. Families earning over $100k receive generous grant aid.',
      tuitionCoverage: '100% Full Financial Need Met with grants (no repayment needed)',
      livingStipend: 'Full housing, dining, personal allowance, and books included for qualifying scholars',
    },
    funding: {
      type: '100% Need-Met',
      amount: 'Full Financial Need Met Without Loans (Zero Debt)',
      details: 'Families with annual income up to $100,000 pay nothing for tuition, room, and board. Families earning over $100k receive generous grant aid.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Princeton fee waiver readily granted on the Common App or Coalition Application upon request.',
      amount: '$70 (Automated waiver option available)',
      code: 'PRINCETON-WAIVER',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Automated waiver option on Common App.',
      code: 'PRINCETON-WAIVER',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Princeton remains test-optional for undergraduate admissions. Submitting SAT or ACT scores is completely optional.',
      satPolicy: 'Test-optional policy.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Princeton remains test-optional for undergraduate admissions.',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Single-Choice Early Action: Nov 1, 2026 · Regular Decision: Jan 1, 2027",
      deadlineDate: "2027-01-01",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Applications open on Common App for Fall 2027 with 100% need-blind aid and zero student loans.",
    },
    deadline: "Single-Choice Early Action: Nov 1, 2026 · Regular Decision: Jan 1, 2027",
    deadlineDate: '2027-01-01',
    admissionsRequirements: {
      academic: 'Exceptional academic transcripts, rigorous curriculum (WASSCE, A-Levels, IB, or national diploma with highest distinction).',
      language: 'English proficiency demonstration (or education conducted in English).',
      documents: [
        'Common Application or Coalition Application',
        'Princeton Supplement',
        'Graded Written Paper from High School',
        'Counselor Recommendation & Two Teacher Evaluations',
      ],
      standardizedTests: 'SAT/ACT optional.',
    },
    studyFields: [
      'Operations Research and Financial Engineering',
      'Computer Science',
      'Public and International Affairs (SPIA)',
      'Molecular Biology',
      'Mechanical and Aerospace Engineering',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'One of the world’s preeminent Ivy League research universities, pioneered the first completely loan-free financial aid program in the United States.',
    officialRuleSummary: 'Official Princeton University Undergraduate Admission and Financial Aid regulations.',
  },

  // 17. USA - Bowdoin College (Need-Blind International Pioneer)
  {
    id: 'bowdoin-college-usa',
    officialName: 'Bowdoin College',
    institution: 'Bowdoin College',
    shortName: 'Bowdoin',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Brunswick, Maine',
    officialWebsite: 'https://www.bowdoin.edu',
    sourceUrl: 'https://www.bowdoin.edu/admissions/',
    officialUrl: 'https://www.bowdoin.edu/admissions/',
    category: 'fee-waiver',
    institutionType: 'Private University',
    title: 'Need-Blind for International Applicants & $0 Fee for Aid Applicants',
    isVerified: true,
    verificationSource: 'Bowdoin College Office of Admissions Comprehensive Need-Blind Policy',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#000000',
      text: '#FFFFFF',
      monogram: 'BOW',
      crestColor: '#FFFFFF',
      logoDescription: 'Bowdoin Black & White Polar Bear Shield',
      logoUrl: '/logos/bowdoin-college-usa.png',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bowdoin_college_blacklogo.png'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Bowdoin is strictly need-blind for all students regardless of citizenship, guaranteeing 100% of demonstrated need without loans.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Financial Need Met Solely With Grants',
      details: 'All financial aid packages consist entirely of grants and campus work opportunities; no loans are ever packaged.',
      tuitionCoverage: '100% Tuition, room, and board based on demonstrated family need',
    },
    funding: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Financial Need Met Solely With Grants',
      details: 'All financial aid packages consist entirely of grants and campus work opportunities; no loans are ever packaged.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: '$0 Application fee for all students applying for financial aid or who are first-generation college students.',
      amount: '$0.00 Fee for Aid Applicants',
      code: 'AUTOMATIC-AID-APPLICANT',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: '$0 Application fee for all students applying for financial aid.',
      code: 'AUTOMATIC-AID-APPLICANT',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Bowdoin was the first college in the United States to make standardized testing optional (since 1969 — over 55 years).',
      satPolicy: 'Test-optional since 1969.',
      englishProficiencyPolicy: 'Waived if curriculum was conducted in English.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Bowdoin was the first college in the United States to make standardized testing optional (since 1969).',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 5, 2027",
      deadlineDate: "2027-01-05",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Applications open on Common App with need-blind international admissions and $0 fee for aid seekers.",
    },
    deadline: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 5, 2027",
    deadlineDate: '2027-01-05',
    admissionsRequirements: {
      academic: 'High school graduation with top academic standing (WASSCE, A-Levels, IB, or national diploma).',
      language: 'TOEFL, IELTS, or Duolingo English Test (waived if high school instruction was in English).',
      documents: [
        'Common Application or Coalition Application',
        'Secondary School Report & Transcripts',
        'Two Teacher Recommendations',
      ],
      standardizedTests: 'SAT/ACT completely optional.',
    },
    studyFields: [
      'Government and Legal Studies',
      'Computer Science',
      'Economics',
      'Environmental Studies & Coastal Sciences',
      'Biochemistry',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'A top-ranked American liberal arts college that made history by eliminating testing barriers and extending full need-blind admissions to all international students.',
    officialRuleSummary: 'Official Bowdoin College Admissions policy.',
  },

  // 18. RWANDA - African Leadership University (ALU)
  {
    id: 'alu-rwanda',
    officialName: 'African Leadership University',
    institution: 'African Leadership University (ALU)',
    shortName: 'ALU',
    country: 'Rwanda',
    countryCode: 'RW',
    countryFlag: '🇷🇼',
    city: 'Kigali Innovation City',
    officialWebsite: 'https://www.alueducation.com',
    sourceUrl: 'https://www.alueducation.com/admissions/',
    officialUrl: 'https://www.alueducation.com/admissions/',
    category: 'fee-waiver',
    institutionType: 'Private University',
    title: 'Zero Application Fee & Mandela Centennial Leaders Scholarship',
    isVerified: true,
    verificationSource: 'Higher Education Council (HEC) of Rwanda & ALU Admissions Charter',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      logoUrl: '/logos/alu-rwanda.png',
      bg: '#1A365D',
      text: '#FFFFFF',
      monogram: 'ALU',
      crestColor: '#ECC94B',
      logoDescription: 'African Leadership University Navy & Gold Pan-African Shield',
          },
    eligibilityCountries: ['Ghana', 'Nigeria', 'Kenya', 'Rwanda', 'All 54 African Countries'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Admissions and scholarships exclusively designed for citizens of 54 African Union member countries including Ghana, Nigeria, and Kenya.',
      eligibleRegions: ['Ghana', 'Nigeria', 'Kenya', 'Rwanda', 'All 54 African Countries'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Mandela Centennial Scholars & Pamoja Tuition Grants',
      details: 'Full-ride scholarships covering tuition, modern housing at Kigali campus, meals, and annual flight allowance for top African talent.',
      tuitionCoverage: '100% Full Tuition Grant for selected scholars',
      livingStipend: 'Kigali campus residence accommodation, dining, and laptop grant included',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Mandela Centennial Scholars & Pamoja Tuition Grants',
      details: 'Full-ride scholarships covering tuition, modern housing at Kigali campus, meals, and annual flight allowance for top African talent.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: 'ALU does not charge application fees for any African candidate submitting through the official admissions portal.',
      amount: '$0.00 Universal Free Application for African Citizens',
      code: 'FREE-APP-ALU',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: 'ALU does not charge application fees for any African candidate submitting through the official admissions portal.',
      code: 'FREE-APP-ALU',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT, ACT, or external standardized tests required. Candidates take ALU’s internal online cognitive and leadership assessment.',
      satPolicy: 'No external SAT/ACT testing required.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT, ACT, or external standardized tests required. Candidates take ALU’s internal online cognitive and leadership assessment.',
    },
    deadlines: {
      term: "January 2027 Spring Intake",
      deadlineText: "Rolling / January 2027 Intake Open",
      deadlineDate: "2027-01-31",
      isRolling: true,
      cycleStatus: "rolling",
      statusNotice: "Applications open on ALU Admissions Portal for the upcoming January 2027 intake.",
    },
    deadline: "Rolling / January 2027 Intake Open",
    deadlineDate: '2027-01-31',
    admissionsRequirements: {
      academic: 'High school graduation with pass in 5 subjects including Mathematics and English (WASSCE, KCSE, Baccalauréat, or equivalent).',
      language: 'Official high school English medium transcript or ALU online English evaluation.',
      documents: [
        'National High School Certificate / WASSCE Results',
        'Personal Essay on African Leadership & Global Challenges',
        'National ID / Passport Page',
      ],
      standardizedTests: 'No SAT/ACT required.',
    },
    studyFields: [
      'Software Engineering',
      'Computer Science',
      'Entrepreneurial Leadership',
      'Global Challenges',
      'International Business & Trade',
    ],
    intakeTerm: 'September 2026 & January 2027',
    verifiedBadge: 'Verified Official Data',
    summary: 'Pioneering African higher education hub based in Kigali, developing the next generation of ethical, entrepreneurial leaders across 54 African countries.',
    officialRuleSummary: 'Accredited by the Higher Education Council (HEC) of Rwanda. Applications open to all African citizens.',
  },

  // 19. USA - Bates College ($0 Application Fee & Test-Optional Pioneer)
  {
    id: 'bates-college-usa',
    officialName: 'Bates College',
    institution: 'Bates College',
    shortName: 'Bates',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Lewiston, Maine',
    officialWebsite: 'https://www.bates.edu',
    sourceUrl: 'https://www.bates.edu/admission/',
    officialUrl: 'https://www.bates.edu/admission/',
    category: 'test-waiver',
    institutionType: 'Private University',
    title: 'Zero Application Fee & Permanent Test-Optional Admissions',
    isVerified: true,
    verificationSource: 'Bates College Office of Admission Policy on International Access',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#7A1C1C',
      text: '#FFFFFF',
      monogram: 'BATES',
      crestColor: '#C5A059',
      logoDescription: 'Bates College Garnet & Gold Bobcat Shield',
      logoUrl: '/logos/bates-college-usa.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bates_College_wordmark.svg'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to all international undergraduate candidates globally. Need-based financial aid awards equal to 100% of demonstrated need.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Need Met with Grants',
      details: 'Meets 100% of demonstrated financial need for all admitted international students for four full years.',
      tuitionCoverage: '100% Demonstrated Financial Need met entirely through grant aid (no student loans)',
    },
    funding: {
      type: '100% Need-Met',
      amount: '100% Demonstrated Need Met with Grants',
      details: 'Meets 100% of demonstrated financial need for all admitted international students for four full years.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: '$0 Application Fee for all international applicants. Automatically waived on the Common Application.',
      amount: '$0.00 Automated Waiver on Common Application',
      code: 'AUTOMATIC-BATES',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: '$0 Application Fee for all international applicants. Automatically waived on the Common Application.',
      code: 'AUTOMATIC-BATES',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'Test-optional since 1984 (over 40 years). International applicants can apply without SAT/ACT with zero disadvantage.',
      satPolicy: 'Test-optional pioneer for 40+ years.',
      englishProficiencyPolicy: 'High school instruction in English satisfies proficiency.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'Test-optional since 1984 (over 40 years). International applicants can apply without SAT/ACT with zero disadvantage.',
    },
    deadlines: {
      term: "Fall 2027 (Common App Open)",
      deadlineText: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 10, 2027",
      deadlineDate: "2027-01-10",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Common Application open with permanent $0 fee for all applicants and test-optional policy.",
    },
    deadline: "Early Decision I: Nov 15, 2026 · Regular Decision: Jan 10, 2027",
    deadlineDate: '2027-01-10',
    admissionsRequirements: {
      academic: 'Rigorous high school academic record (WASSCE, A-Levels, IB, or national diploma with strong marks).',
      language: 'TOEFL, IELTS, or Duolingo English Test (or high school instruction in English waiver).',
      documents: [
        'Common Application',
        'High School Transcript',
        'Counselor Recommendation',
        'Two Teacher Evaluations',
      ],
      standardizedTests: 'SAT/ACT completely optional.',
    },
    studyFields: [
      'Digital and Computational Studies',
      'Computer Science',
      'Economics',
      'Biochemistry',
      'Politics',
      'Neuroscience',
      'Physics',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Renowned liberal arts college celebrated for open academic culture, experiential learning, and universal free application access.',
    officialRuleSummary: 'Official Bates College Office of Admission policy. No application fee required for international students.',
  },

  // 20. GERMANY - Heidelberg University (DAAD & State Tuition Waiver)
  {
    id: 'heidelberg-university-germany',
    officialName: 'Heidelberg University',
    institution: 'Heidelberg University (Ruprecht-Karls-Universität)',
    shortName: 'Heidelberg',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    city: 'Heidelberg, Baden-Württemberg',
    officialWebsite: 'https://www.uni-heidelberg.de',
    sourceUrl: 'https://www.uni-heidelberg.de/en/study/international-studies',
    officialUrl: 'https://www.uni-heidelberg.de/en/study/international-studies',
    category: 'university',
    institutionType: 'Public University',
    title: 'DAAD EPOS / Baden-Württemberg Tuition Waiver Programs',
    isVerified: true,
    verificationSource: 'Baden-Württemberg Ministry of Science and Arts & Heidelberg University Admissions Office',
    verifiedAt: 'Academic Year 2026/2027',
    logo: {
      bg: '#6E1423',
      text: '#FFFFFF',
      monogram: 'HD',
      crestColor: '#C49A45',
      logoDescription: 'Heidelberg University Crimson & Gold Imperial Eagle and Palatinate Lion Seal',
      logoUrl: '/logos/heidelberg-university-germany.svg',
      logoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Logo_University_of_Heidelberg.svg'
          },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to international applicants worldwide; statutory hardship fee exemptions apply for students from developing nations.',
      eligibleRegions: ['Ghana', 'Africa', 'International / Global'],
    },
    degreeLevels: ["Master's", 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'DAAD EPOS €934/month + Health Insurance + Tuition Exemption',
      details: 'DAAD Development-Related Postgraduate Courses provide full monthly stipend and travel allowances; state tuition waivers available.',
      livingStipend: '€934 monthly allowance + statutory German student healthcare',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'DAAD EPOS €934/month + Health Insurance + Tuition Exemption',
      details: 'DAAD Development-Related Postgraduate Courses provide full monthly stipend and travel allowances; state tuition waivers available.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Direct application through Heidelberg HeiCo portal is €0; fee exemption available for DAAD-nominated scholars.',
      amount: '€0 direct HeiCo university fee',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Direct application through Heidelberg HeiCo portal is €0; fee exemption available for DAAD-nominated scholars.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'German public universities do not require SAT or GRE for the majority of humanities, medicine, and natural science faculties.',
      satPolicy: 'No SAT/ACT required in Germany.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'German public universities do not require SAT or GRE for the majority of humanities, medicine, and natural science faculties.',
    },
    deadlines: {
      term: "Winter 2026/2027 (Cycle Concluded)",
      deadlineText: "July 15, 2026 (Expired / Winter 2026 Closed · Summer 2027 Opens Dec 2026)",
      deadlineDate: "2026-07-15",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "Winter semester 2026/2027 intake closed July 15, 2026. Summer semester 2027 admissions open in December 2026.",
    },
    deadline: "July 15, 2026 (Expired / Winter 2026 Closed · Summer 2027 Opens Dec 2026)",
    deadlineDate: '2026-07-15',
    admissionsRequirements: {
      academic: 'Recognized undergraduate degree with superior academic evaluation (German grade 2.0 or better).',
      language: 'English C1 (IELTS 7.0 or TOEFL 95+) for English programs; German DSH-2 for German-taught tracks.',
      documents: [
        'HeiCo Online Application',
        'Certified Copies of Degree Certificates & Transcripts',
        'Letter of Motivation',
        'Academic CV',
      ],
      standardizedTests: 'None required.',
    },
    studyFields: [
      'Translational Medical Research',
      'Computer Science',
      'International Health',
      'Physics & Astronomy',
      'Molecular Biosciences',
    ],
    intakeTerm: 'Winter Semester 2026/2027',
    verifiedBadge: 'Verified Official Data',
    summary: 'Germany’s oldest university and a world leader in medicine, life sciences, and physics, offering state tuition exemptions and DAAD scholarships.',
    officialRuleSummary: 'Regulated under the State Higher Education Act of Baden-Württemberg.',
  },

  // 21. UNITED STATES - Massachusetts Institute of Technology (MIT)
  {
    id: 'mit-usa',
    officialName: 'Massachusetts Institute of Technology',
    institution: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    city: 'Cambridge, Massachusetts',
    officialWebsite: 'https://www.mit.edu',
    sourceUrl: 'https://www.mit.edu/admissions-aid/',
    officialUrl: 'https://www.mit.edu/admissions-aid/',
    category: 'university',
    institutionType: 'Private University',
    title: 'Need-Blind Undergraduate Admissions & 100% Demonstrated Need Met (Zero Loans)',
    isVerified: true,
    verificationSource: 'MIT Student Financial Services & Office of Admissions Bulletin (SEVP Certified)',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/mit-usa.png',
      bg: '#A31F34',
      text: '#FFFFFF',
      monogram: 'MIT',
      crestColor: '#8A1B2D',
      logoDescription: 'MIT Cardinal and Steel Grey Seal',
    },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All Nationalities',
      details: 'MIT is one of only eight US institutions offering full need-blind admissions to all international applicants worldwide, meeting 100% of demonstrated financial need with zero loans.',
      eligibleRegions: ['Ghana', 'Africa', 'Global / Worldwide'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: '100% Need-Met',
      amount: 'Full Tuition, Room & Board ($85,000+/year demonstrated need)',
      details: 'MIT meets 100% of calculated financial need for all admitted students regardless of citizenship, replacing loans with institutional scholarships.',
      tuitionCoverage: '100% of tuition covered based on demonstrated need',
      livingStipend: 'Comprehensive room, board, books, and personal allowance included',
    },
    funding: {
      type: '100% Need-Met',
      amount: 'Full Tuition, Room & Board ($85,000+/year demonstrated need)',
      details: 'MIT meets 100% of calculated financial need for all admitted students regardless of citizenship, replacing loans with institutional scholarships.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'International applicants for whom the $75 application fee presents a financial hardship can request a fee waiver directly in the MIT application portal.',
      amount: '$75 (Waiver available)',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'International applicants for whom the $75 application fee presents a financial hardship can request a fee waiver directly in the MIT application portal.',
    },
    testWaiverRules: {
      status: 'Test Required',
      details: 'MIT requires standardized test scores (SAT or ACT). English tests like TOEFL/IELTS are accepted in addition to SAT/ACT.',
      satPolicy: 'SAT Math + Evidence-Based Reading & Writing or ACT required.',
    },
    testPolicy: {
      status: 'Test Required',
      details: 'MIT requires standardized test scores (SAT or ACT). English tests like TOEFL/IELTS are accepted in addition to SAT/ACT.',
    },
    deadlines: {
      term: "Fall 2027",
      deadlineText: "Early Action: Nov 1, 2026 · Regular Action: Jan 4, 2027",
      deadlineDate: "2027-01-04",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "MIT online application portal actively open for Fall 2027 with 100% need-blind aid.",
    },
    deadline: "Early Action: Nov 1, 2026 · Regular Action: Jan 4, 2027",
    deadlineDate: '2027-01-04',
    admissionsRequirements: {
      academic: 'Top-tier secondary school coursework in calculus, physics, chemistry, biology, and humanities.',
      language: 'TOEFL iBT (minimum 90, recommended 100+) or IELTS (minimum 7.0, recommended 7.5+).',
      documents: [
        'MIT Application Portal Account',
        'Secondary School Report & Transcript',
        'Two Teacher Recommendations (One Math/Science, One Humanities)',
        'Standardized Test Scores',
      ],
      standardizedTests: 'SAT or ACT required.',
    },
    studyFields: [
      'Computer Science',
      'Artificial Intelligence',
      'Mechanical Engineering',
      'Physics',
      'Mathematics',
      'Biological Engineering',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'MIT offers world-leading STEM and engineering education with need-blind admissions for international students and full financial aid packages without loans.',
    officialRuleSummary: 'Accredited by the New England Commission of Higher Education (NECHE).',
  },

  // 22. SOUTH AFRICA - University of Cape Town (UCT)
  {
    id: 'uct-south-africa',
    officialName: 'University of Cape Town',
    institution: 'University of Cape Town',
    shortName: 'UCT',
    country: 'South Africa',
    countryCode: 'ZA',
    countryFlag: '🇿🇦',
    city: 'Rondebosch, Cape Town',
    officialWebsite: 'https://www.uct.ac.za',
    sourceUrl: 'https://uct.ac.za/students/applications-admission-requirements/eligibility-admission',
    officialUrl: 'https://uct.ac.za/students/applications-admission-requirements/eligibility-admission',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Mastercard Foundation Scholars Program & International Postgraduate Merit Awards',
    isVerified: true,
    verificationSource: 'UCT International Academic Programmes Office (IAPO) & Mastercard Foundation Registry',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/uct-south-africa.svg',
      bg: '#002B49',
      text: '#FFFFFF',
      monogram: 'UCT',
      crestColor: '#D3A446',
      logoDescription: 'UCT Deep Blue & Gold Crest',
    },
    eligibilityCountries: ['Ghana', 'Nigeria', 'Kenya', 'Rwanda', 'Uganda', 'Tanzania', 'Ethiopia', 'Sub-Saharan Africa'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Applicants must be citizens of and resident in a Sub-Saharan African country, demonstrating academic excellence, leadership commitment, and financial need.',
      eligibleRegions: ['Ghana', 'Sub-Saharan Africa'],
    },
    degreeLevels: ['Undergraduate', "Master's"],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Comprehensive 100% Tuition + Living Stipend + Flight + Medical Aid',
      details: 'Covers full tuition, student accommodation, monthly stipend, travel to Cape Town, medical aid, and academic laptop allowance.',
      tuitionCoverage: '100% full international tuition waiver',
      livingStipend: 'ZAR monthly living allowance + residence board',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Comprehensive 100% Tuition + Living Stipend + Flight + Medical Aid',
      details: 'Covers full tuition, student accommodation, monthly stipend, travel to Cape Town, medical aid, and academic laptop allowance.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Mastercard Foundation applicants can apply for an application fee waiver through the IAPO office.',
      amount: 'ZAR 300 (Waiver eligible)',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Mastercard Foundation applicants can apply for an application fee waiver through the IAPO office.',
    },
    testWaiverRules: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE English Language with grade C6 or higher satisfies the English language proficiency requirement for African applicants.',
      wassceExemptionDetails: 'WASSCE grade A1–C6 exempts from TOEFL/IELTS.',
    },
    testPolicy: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE English Language with grade C6 or higher satisfies the English language proficiency requirement for African applicants.',
    },
    deadlines: {
      term: "2027 Academic Year (Feb Intake Closed)",
      deadlineText: "August 31, 2026 (Expired / 2027 Feb Intake Closed · Next Opens April 2027)",
      deadlineDate: "2026-08-31",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "International undergraduate applications for the February 2027 academic year closed on August 31, 2026.",
    },
    deadline: "August 31, 2026 (Expired / 2027 Feb Intake Closed · Next Opens April 2027)",
    deadlineDate: '2026-08-31',
    admissionsRequirements: {
      academic: 'SAQA Foreign Qualification evaluation and Matriculation Board endorsement.',
      language: 'English language requirement satisfied via WASSCE A1–C6.',
      documents: [
        'UCT Online Application',
        'Certified School Transcripts',
        'Mastercard Foundation Essay',
        'Financial Need Declaration',
      ],
      standardizedTests: 'National Benchmark Tests (NBT) may be required for specific faculties.',
    },
    studyFields: [
      'Data Science',
      'Electrical Engineering',
      'Public Health',
      'Economics',
      'Environmental Science',
    ],
    intakeTerm: 'First Semester 2027 (February)',
    verifiedBadge: 'Verified Official Data',
    summary: 'Ranked #1 in Africa, UCT provides world-class undergraduate and postgraduate education with full Mastercard Foundation scholarships for African leaders.',
    officialRuleSummary: 'Accredited by the South African Council on Higher Education (CHE).',
  },

  // 23. FRANCE - Sciences Po Paris
  {
    id: 'sciences-po-france',
    officialName: 'Sciences Po (Paris Institute of Political Studies)',
    institution: 'Sciences Po',
    shortName: 'Sciences Po',
    country: 'France',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    city: 'Paris',
    officialWebsite: 'https://www.sciencespo.fr',
    sourceUrl: 'https://www.sciencespo.fr/',
    officialUrl: 'https://www.sciencespo.fr/',
    category: 'scholarship',
    institutionType: 'Specialized / Regional',
    title: 'Émile Boutmy Scholarships for Non-EU International Students',
    isVerified: true,
    verificationSource: 'Sciences Po Admissions & Financial Aid Direction & Campus France Directory',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/sciences-po-france.svg',
      bg: '#A6192E',
      text: '#FFFFFF',
      monogram: 'SP',
      crestColor: '#E03C31',
      logoDescription: 'Sciences Po Red & Lion Monogram',
    },
    eligibilityCountries: ['Ghana', 'Nigeria', 'Kenya', 'All Non-EU Countries', 'International Outside EU'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Strictly reserved for first-time applicants who are non-European Union citizens whose household does not file taxes within the European Union.',
      eligibleRegions: ['Ghana', 'Africa', 'Global Non-EU'],
    },
    degreeLevels: ['Undergraduate', "Master's"],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Up to €14,720/year tuition waiver + €5,000/year living allowance',
      details: 'Awarded on academic excellence and profile alignment. Tiered packages provide full or partial tuition grants with living stipends.',
      tuitionCoverage: 'Up to 100% of tuition waived',
      livingStipend: '€5,000/year cost-of-living stipend',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Up to €14,720/year tuition waiver + €5,000/year living allowance',
      details: 'Awarded on academic excellence and profile alignment. Tiered packages provide full or partial tuition grants with living stipends.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'Standard international application fee of €100 payable upon dossier submission.',
      amount: '€100',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'Standard international application fee of €100 payable upon dossier submission.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'Sciences Po does not require SAT or ACT. Admissions evaluation is holistic based on school performance, personal essay, and online interview.',
      satPolicy: 'No SAT/ACT required.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'Sciences Po does not require SAT or ACT. Admissions evaluation is holistic based on school performance, personal essay, and online interview.',
    },
    deadlines: {
      term: "2027 Intake",
      deadlineText: "February 22, 2027 (Émile Boutmy Scholarship)",
      deadlineDate: "2027-02-22",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "Sciences Po portal open for non-EU applicants and Émile Boutmy scholarships.",
    },
    deadline: "February 22, 2027 (Émile Boutmy Scholarship)",
    deadlineDate: '2027-02-22',
    admissionsRequirements: {
      academic: 'Exceptional secondary school record (French Baccalauréat equivalent, WASSCE with top grades, Cambridge A-Levels, or IB).',
      language: 'English C1 (IELTS 7.0 or TOEFL 100) for English tracks; French B2/C1 for French tracks.',
      documents: [
        'Sciences Po Online Application',
        'High School Transcripts & Predicted Grades',
        'Motivation Essays (3 prompts)',
        'Two Academic References',
      ],
      standardizedTests: 'None required.',
    },
    studyFields: [
      'International Relations',
      'Political Science',
      'Economics & Society',
      'Public Policy',
      'Human Rights',
    ],
    intakeTerm: 'Fall 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Europe’s leading institution in political science and international affairs, offering generous Émile Boutmy excellence funding for non-EU students.',
    officialRuleSummary: 'Regulated under the French Ministry of Higher Education and Research.',
  },

  // 24. JAPAN - The University of Tokyo
  {
    id: 'u-tokyo-japan',
    officialName: 'The University of Tokyo',
    institution: 'The University of Tokyo',
    shortName: 'UTokyo',
    country: 'Japan',
    countryCode: 'JP',
    countryFlag: '🇯🇵',
    city: 'Tokyo',
    officialWebsite: 'https://www.u-tokyo.ac.jp/en/',
    sourceUrl: 'https://www.u-tokyo.ac.jp/en/prospective-students/undergraduate.html',
    officialUrl: 'https://www.u-tokyo.ac.jp/en/prospective-students/undergraduate.html',
    category: 'university',
    institutionType: 'Public University',
    title: 'PEAK Undergraduate Programs in English & Japanese Government (MEXT) University Recommendation',
    isVerified: true,
    verificationSource: 'University of Tokyo PEAK Admissions Office & MEXT Official Guidelines',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/u-tokyo-japan.svg',
      bg: '#0F2D59',
      text: '#FFFFFF',
      monogram: 'UT',
      crestColor: '#E6A100',
      logoDescription: 'University of Tokyo Ginkgo Leaf Crest',
    },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Applicants must have completed 12 years of formal education primarily in languages other than Japanese.',
      eligibleRegions: ['Ghana', 'Africa', 'Worldwide'],
    },
    degreeLevels: ['Undergraduate', 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Tuition Waiver + ¥126,000/month stipend + Roundtrip Airfare',
      details: 'The University of Tokyo Scholarship and MEXT Japanese Government Awards cover 100% of admission fees, full tuition, and monthly living allowance.',
      tuitionCoverage: '100% admission and annual tuition fee waiver',
      livingStipend: '¥126,000 monthly living stipend',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Tuition Waiver + ¥126,000/month stipend + Roundtrip Airfare',
      details: 'The University of Tokyo Scholarship and MEXT Japanese Government Awards cover 100% of admission fees, full tuition, and monthly living allowance.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'Application fee of ¥5,000 payable online via credit card during application window.',
      amount: '¥5,000 (~$35 USD)',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'Application fee of ¥5,000 payable online via credit card during application window.',
    },
    testWaiverRules: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'Standardized national school examination results (WASSCE, IB, A-Levels, SAT) accepted. English proficiency test waived if primary education was in English.',
      satPolicy: 'SAT optional; national secondary school exit credentials accepted.',
    },
    testPolicy: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'Standardized national school examination results (WASSCE, IB, A-Levels, SAT) accepted. English proficiency test waived if primary education was in English.',
    },
    deadlines: {
      term: "Autumn 2027 (PEAK)",
      deadlineText: "Application Period: Nov 25, 2026 – Jan 15, 2027",
      deadlineDate: "2027-01-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "PEAK undergraduate admissions portal opening November 25, 2026 for Autumn 2027.",
    },
    deadline: "Application Period: Nov 25, 2026 – Jan 15, 2027",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'Official transcripts for the final 3 years of secondary school showing top 5–10% class standing.',
      language: 'TOEFL iBT (minimum 100) or IELTS (minimum 7.0), or English-medium certification.',
      documents: [
        'PEAK Online Application Form',
        'Official High School Transcripts',
        'Two Letters of Recommendation',
        'Essays on Global Issues',
      ],
      standardizedTests: 'National Examination (WASSCE, IB, A-Levels, or SAT) required.',
    },
    studyFields: [
      'International Program on Japan in East Asia',
      'International Program on Environmental Sciences',
      'Sustainability Science',
      'Global Governance',
    ],
    intakeTerm: 'Autumn 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Japan’s premier university offering full English-taught undergraduate degree programs (PEAK) with comprehensive 4-year government and university scholarships.',
    officialRuleSummary: 'Accredited by the Ministry of Education, Culture, Sports, Science and Technology of Japan (MEXT).',
  },

  // 25. NETHERLANDS - Delft University of Technology (TU Delft)
  {
    id: 'tu-delft-netherlands',
    officialName: 'Delft University of Technology',
    institution: 'Delft University of Technology',
    shortName: 'TU Delft',
    country: 'Netherlands',
    countryCode: 'NL',
    countryFlag: '🇳🇱',
    city: 'Delft',
    officialWebsite: 'https://www.tudelft.nl/en/',
    sourceUrl: 'https://www.tudelft.nl/en/education/admission-and-application',
    officialUrl: 'https://www.tudelft.nl/en/education/admission-and-application',
    category: 'scholarship',
    institutionType: 'Technical University',
    title: 'Justus & Louise van Effen Excellence MSc Scholarships',
    isVerified: true,
    verificationSource: 'TU Delft International Admissions Board & Nuffic Study in NL Accreditation',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/tu-delft-netherlands.svg',
      bg: '#00A6D6',
      text: '#FFFFFF',
      monogram: 'TUD',
      crestColor: '#000000',
      logoDescription: 'TU Delft Cyan and Black Monogram',
    },
    eligibilityCountries: ['Ghana', 'Nigeria', 'Kenya', 'All Non-EU Countries', 'International Outside EU'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Open to excellently performing international applicants admitted to a TU Delft 2-year MSc program with a cumulative grade point average of 80% or higher.',
      eligibleRegions: ['Ghana', 'Africa', 'Global Non-EU'],
    },
    degreeLevels: ["Master's"],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Tuition (€21,500/year) + €30,000 Total Living Allowance',
      details: 'Full tuition fee waiver for 2 years plus living expenses (€15,000 per year) and membership in the scholarship community.',
      tuitionCoverage: '100% full international MSc tuition coverage',
      livingStipend: '€1,250/month living expense allowance',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Tuition (€21,500/year) + €30,000 Total Living Allowance',
      details: 'Full tuition fee waiver for 2 years plus living expenses (€15,000 per year) and membership in the scholarship community.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Non-refundable application fee of €100 for non-Dutch degree holders; reimbursed upon scholarship award.',
      amount: '€100',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Non-refundable application fee of €100 for non-Dutch degree holders; reimbursed upon scholarship award.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'No GRE required for most engineering disciplines; GRE required only for Aerospace and Computer Science MSc programs.',
      satPolicy: 'GRE required only for select faculties.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'No GRE required for most engineering disciplines; GRE required only for Aerospace and Computer Science MSc programs.',
    },
    deadlines: {
      term: "2027/2028 MSc",
      deadlineText: "December 1, 2026 (Justus van Effen Scholarship)",
      deadlineDate: "2026-12-01",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "TU Delft Studielink and Osiris portal open for 2027/2028 MSc intake.",
    },
    deadline: "December 1, 2026 (Justus van Effen Scholarship)",
    deadlineDate: '2026-12-01',
    admissionsRequirements: {
      academic: 'Bachelor’s degree from an internationally recognized university with minimum cumulative GPA of 80% (or first-class honours equivalent).',
      language: 'TOEFL iBT (minimum 100 with all subscores 22+) or IELTS Academic (minimum 7.0 with all subscores 6.5+).',
      documents: [
        'TU Delft Online Application',
        'Certified Degree Certificate & Transcripts',
        'MSc Motivation Letter & Scholarship Essay',
        'Two Letters of Reference from Professors',
      ],
      standardizedTests: 'GRE required only for Computer Science & Aerospace tracks.',
    },
    studyFields: [
      'Aerospace Engineering',
      'Computer Science & Software',
      'Civil & Environmental Engineering',
      'Sustainable Energy Technology',
      'Robotics',
    ],
    intakeTerm: 'Fall 2026 (September)',
    verifiedBadge: 'Verified Official Data',
    summary: 'Europe’s leading technological university offering full Justus & Louise van Effen excellence grants covering full tuition and living expenses for top MSc engineers.',
    officialRuleSummary: 'Accredited by the Accreditation Organisation of the Netherlands and Flanders (NVAO).',
  },

  // 26. SWITZERLAND - ETH Zurich
  {
    id: 'eth-zurich-switzerland',
    officialName: 'ETH Zurich (Swiss Federal Institute of Technology)',
    institution: 'ETH Zurich',
    shortName: 'ETH Zurich',
    country: 'Switzerland',
    countryCode: 'CH',
    countryFlag: '🇨🇭',
    city: 'Zurich',
    officialWebsite: 'https://ethz.ch/en.html',
    sourceUrl: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
    officialUrl: 'https://ethz.ch/en/studies/master/application.html',
    category: 'scholarship',
    institutionType: 'Technical University',
    title: 'Excellence Scholarship & Opportunity Programme (ESOP)',
    isVerified: true,
    verificationSource: 'ETH Zurich Financial Aid & Rectorate Guidelines (SERI Regulated)',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/eth-zurich-switzerland.svg',
      bg: '#215682',
      text: '#FFFFFF',
      monogram: 'ETH',
      crestColor: '#1F4068',
      logoDescription: 'ETH Zurich Swiss Blue Logo',
    },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All Nationalities',
      details: 'Open to national and international students from any university worldwide who graduated in the top 10% of their undergraduate program.',
      eligibleRegions: ['Ghana', 'Africa', 'Worldwide'],
    },
    degreeLevels: ["Master's"],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'CHF 12,000 per semester living stipend + Full Tuition Waiver',
      details: 'Covers full tuition fees and living expenses of CHF 12,000 per semester (CHF 24,000 per year) for the entire duration of the Master’s degree program.',
      tuitionCoverage: '100% full tuition waiver',
      livingStipend: 'CHF 2,000 monthly stipend',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'CHF 12,000 per semester living stipend + Full Tuition Waiver',
      details: 'Covers full tuition fees and living expenses of CHF 12,000 per semester (CHF 24,000 per year) for the entire duration of the Master’s degree program.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'Application fee of CHF 150 for holders of non-Swiss university degrees.',
      amount: 'CHF 150',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'Application fee of CHF 150 for holders of non-Swiss university degrees.',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE test required for applicants holding a bachelor’s degree from outside the Bologna system applying to Computer Science / Electrical Engineering.',
      satPolicy: 'GRE required for select non-Bologna degree holders.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'GRE test required for applicants holding a bachelor’s degree from outside the Bologna system applying to Computer Science / Electrical Engineering.',
    },
    deadlines: {
      term: "2027/2028 Master’s",
      deadlineText: "December 15, 2026 (ESOP Excellence Scholarship)",
      deadlineDate: "2026-12-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "ETH Zurich eApply portal open for international master’s applicants.",
    },
    deadline: "December 15, 2026 (ESOP Excellence Scholarship)",
    deadlineDate: '2026-12-15',
    admissionsRequirements: {
      academic: 'Outstanding bachelor’s degree with grade ranking in the top 10% of the graduation cohort.',
      language: 'English C1 (IELTS 7.0 or TOEFL 100).',
      documents: [
        'ETH eApply Application',
        'Certified Transcripts with Grading Scale & Class Rank',
        'Pre-proposal for Master’s Thesis',
        'Two Academic Letters of Evaluation',
      ],
      standardizedTests: 'GRE required for non-EU bachelor holders in Computer Science.',
    },
    studyFields: [
      'Computer Science',
      'Robotics, Systems and Control',
      'Data Science',
      'Quantum Engineering',
      'Cybersecurity',
    ],
    intakeTerm: 'Autumn Semester 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Consistently ranked among the top 10 universities in the world, ETH Zurich provides full ESOP scholarships for top-tier master’s researchers in science and tech.',
    officialRuleSummary: 'Governed by the Swiss Federal Act on the Federal Institutes of Technology.',
  },

  // 27. NIGERIA - University of Ibadan
  {
    id: 'unibadan-nigeria',
    officialName: 'University of Ibadan',
    institution: 'University of Ibadan',
    shortName: 'UI',
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    city: 'Ibadan, Oyo State',
    officialWebsite: 'https://www.ui.edu.ng',
    sourceUrl: 'https://pgcollege.ui.edu.ng',
    officialUrl: 'https://admissions.ui.edu.ng',
    category: 'university',
    institutionType: 'Public University',
    title: 'Pan-African Postgraduate Research Fellowships & Direct International Admissions',
    isVerified: true,
    verificationSource: 'National Universities Commission (NUC) of Nigeria & University of Ibadan Postgraduate College Bulletin',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      bg: '#8B0000',
      text: '#FFD700',
      monogram: 'UI',
      crestColor: '#5C0000',
      logoDescription: 'University of Ibadan Crimson and Gold',
      logoUrl: '/logos/unibadan-nigeria.jpg',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:University_of_Ibadan_logo.jpeg'
    },
    eligibilityCountries: ['Ghana', 'Nigeria', 'ECOWAS Member States', 'African Union'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Open to Nigerian, Ghanaian, and international scholars across Africa with streamlined admission pathways for ECOWAS nationals.',
      eligibleRegions: ['Ghana', 'Nigeria', 'ECOWAS', 'Africa'],
    },
    degreeLevels: ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: {
      type: 'Tuition Waiver',
      amount: 'Bilateral ECOWAS Tuition Concessions & Research Grants',
      details: 'Subsidized federal tuition rates for African researchers and institutional doctoral research grants.',
      tuitionCoverage: 'Subsidized public university tuition fees',
    },
    funding: {
      type: 'Tuition Waiver',
      amount: 'Bilateral ECOWAS Tuition Concessions & Research Grants',
      details: 'Subsidized federal tuition rates for African researchers and institutional doctoral research grants.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'Standard application fee of NGN 25,000 for international postgraduates.',
      amount: 'NGN 25,000 (~$20 USD)',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'Standard application fee of NGN 25,000 for international postgraduates.',
    },
    testWaiverRules: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE / WAEC Senior School Certificate with 5 credits including English and Mathematics satisfies all entry test requirements.',
      wassceExemptionDetails: 'WASSCE grade A1–C6 fully recognized.',
    },
    testPolicy: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE / WAEC Senior School Certificate with 5 credits including English and Mathematics satisfies all entry test requirements.',
    },
    deadlines: {
      term: "2026/2027 Academic Year (Screening Concluded)",
      deadlineText: "July 31, 2026 (Expired / 2026 Screening Concluded)",
      deadlineDate: "2026-07-31",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "2026/2027 post-UTME / direct entry screening exercise concluded on July 31, 2026.",
    },
    deadline: "July 31, 2026 (Expired / 2026 Screening Concluded)",
    deadlineDate: '2026-07-31',
    admissionsRequirements: {
      academic: 'WASSCE with 5 credits for undergraduate; First Class or Second Class Upper Honours degree for postgraduate.',
      language: 'English-medium certification or WAEC English credit.',
      documents: [
        'UI Portal Application',
        'Official Academic Transcripts',
        'Two Academic Referees',
        'Statement of Research Intent',
      ],
      standardizedTests: 'Postgraduate entrance examination administered via computer-based test.',
    },
    studyFields: [
      'Public Health & Tropical Medicine',
      'Agricultural Sciences',
      'African Studies',
      'Computer Science',
      'Civil Engineering',
    ],
    intakeTerm: 'First Semester 2026/2027',
    verifiedBadge: 'Verified Official Data',
    summary: 'Nigeria’s premier university and a continental hub for tropical medicine, agriculture, and public health with subsidized tuition for African scholars.',
    officialRuleSummary: 'Accredited by the National Universities Commission (NUC) of Nigeria.',
  },

  // 28. KENYA - University of Nairobi
  {
    id: 'uon-kenya',
    officialName: 'University of Nairobi',
    institution: 'University of Nairobi',
    shortName: 'UoN',
    country: 'Kenya',
    countryCode: 'KE',
    countryFlag: '🇰🇪',
    city: 'Nairobi',
    officialWebsite: 'https://www.uonbi.ac.ke',
    sourceUrl: 'https://application.uonbi.ac.ke',
    officialUrl: 'https://application.uonbi.ac.ke',
    category: 'university',
    institutionType: 'Public University',
    title: 'Direct International Admissions & East African Community Mobility Programs',
    isVerified: true,
    verificationSource: 'Commission for University Education (CUE) Kenya & UoN Center for International Programmes',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      bg: '#005A36',
      text: '#FFFFFF',
      monogram: 'UoN',
      crestColor: '#F58220',
      logoDescription: 'University of Nairobi Green and Ochre',
      logoUrl: '/logos/uon-kenya.gif',
      logoSourceUrl: 'https://en.wikipedia.org/wiki/File:Uon_emblem.gif'
    },
    eligibilityCountries: ['Ghana', 'Kenya', 'East African Community (EAC)', 'African Union'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Welcomes international candidates from Ghana, Kenya, EAC, and AU member nations with harmonized credit transfer agreements.',
      eligibleRegions: ['Ghana', 'Kenya', 'East Africa', 'African Union'],
    },
    degreeLevels: ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: {
      type: 'Partial / Merit',
      amount: 'EAC Common Market Subsidies + Vice-Chancellor Merit Grants',
      details: 'EAC partner state citizens pay domestic tuition rates; merit research fellowships available for doctoral scholars.',
      tuitionCoverage: 'Subsidized domestic-equivalent fee rates for regional partners',
    },
    funding: {
      type: 'Partial / Merit',
      amount: 'EAC Common Market Subsidies + Vice-Chancellor Merit Grants',
      details: 'EAC partner state citizens pay domestic tuition rates; merit research fellowships available for doctoral scholars.',
    },
    applicationFees: {
      status: 'Standard Fee',
      details: 'Application fee of KES 3,000 (US $30 for foreign applicants) payable via M-Pesa or bank transfer.',
      amount: 'KES 3,000 / $30 USD',
    },
    applicationFee: {
      status: 'Standard Fee',
      details: 'Application fee of KES 3,000 (US $30 for foreign applicants) payable via M-Pesa or bank transfer.',
    },
    testWaiverRules: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE, KCSE, and Cambridge A-Levels directly accepted. WAEC English with credit satisfies the language requirement.',
      wassceExemptionDetails: 'WASSCE grade C6 or higher satisfies English requirement.',
    },
    testPolicy: {
      status: 'WAEC/WASSCE English Accepted',
      details: 'WASSCE, KCSE, and Cambridge A-Levels directly accepted. WAEC English with credit satisfies the language requirement.',
    },
    deadlines: {
      term: "January 2027 Module II",
      deadlineText: "Rolling / January 2027 Intake Open",
      deadlineDate: "2027-01-15",
      isRolling: true,
      cycleStatus: "rolling",
      statusNotice: "University of Nairobi online application portal active for January 2027 intake.",
    },
    deadline: "Rolling / January 2027 Intake Open",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'KCSE Mean Grade C+ or equivalent (WASSCE, IB, A-Levels). Kenya National Qualifications Authority (KNQA) equation of foreign certificates.',
      language: 'English proficiency confirmed through secondary school certificate.',
      documents: [
        'UoN Online Application Form',
        'Certified Copy of Certificates & Transcripts',
        'Copy of National Passport',
        'KNQA Equation Letter',
      ],
      standardizedTests: 'None required.',
    },
    studyFields: [
      'Information Technology',
      'Medicine & Surgery',
      'Diplomacy & International Studies',
      'Environmental Law',
      'Business Administration',
    ],
    intakeTerm: 'September 2026 Intake',
    verifiedBadge: 'Verified Official Data',
    summary: 'Kenya’s top university and a vibrant East African hub for technology, diplomacy, and environmental law with accessible tuition for African scholars.',
    officialRuleSummary: 'Chartered by the Commission for University Education (CUE) Kenya.',
  },

  // 29. CANADA - University of British Columbia (UBC)
  {
    id: 'ubc-canada',
    officialName: 'University of British Columbia',
    institution: 'University of British Columbia',
    shortName: 'UBC',
    country: 'Canada',
    countryCode: 'CA',
    countryFlag: '🇨🇦',
    city: 'Vancouver, British Columbia',
    officialWebsite: 'https://www.ubc.ca',
    sourceUrl: 'https://you.ubc.ca/financial-planning/scholarships-awards-international-students/international-scholars/',
    officialUrl: 'https://you.ubc.ca/applying-ubc/',
    category: 'scholarship',
    institutionType: 'Public University',
    title: 'Karen McKellin International Leader of Tomorrow Award & Major Entrance Scholarships',
    isVerified: true,
    verificationSource: 'UBC International Student Initiative & IRCC Designated Learning Institution (DLI #O19327981502)',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/ubc-canada.svg',
      bg: '#002145',
      text: '#FFFFFF',
      monogram: 'UBC',
      crestColor: '#0055B7',
      logoDescription: 'UBC Coastal Blue and Gold',
    },
    eligibilityCountries: ['All Countries', 'Ghana', 'International Worldwide'],
    nationalityEligibility: {
      category: 'All International Citizens',
      details: 'Applicants must be international students entering university directly from secondary school or post-secondary, nominated by their high school.',
      eligibleRegions: ['Ghana', 'Africa', 'Global International'],
    },
    degreeLevels: ['Undergraduate'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Tuition + Room & Board (Up to CAD $50,000+/year proportional to financial need)',
      details: 'Need-and-merit based award covering full tuition and living costs determined by student demonstrated financial need, renewable for 4 years.',
      tuitionCoverage: 'Full international undergraduate tuition waiver',
      livingStipend: 'Comprehensive living stipend and housing on Vancouver campus',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Tuition + Room & Board (Up to CAD $50,000+/year proportional to financial need)',
      details: 'Need-and-merit based award covering full tuition and living costs determined by student demonstrated financial need, renewable for 4 years.',
    },
    applicationFees: {
      status: 'Fee Waiver Available',
      details: 'Standard international application fee of CAD $155; fee waiver available for nominated International Scholars from lower-income nations.',
      amount: 'CAD $155 (Waiver available)',
    },
    applicationFee: {
      status: 'Fee Waiver Available',
      details: 'Standard international application fee of CAD $155; fee waiver available for nominated International Scholars from lower-income nations.',
    },
    testWaiverRules: {
      status: 'Test-Optional',
      details: 'SAT/ACT is not required for admission to UBC. WAEC/WASSCE English language proficiency recognized upon review.',
      satPolicy: 'Test-optional for all undergraduate programs.',
    },
    testPolicy: {
      status: 'Test-Optional',
      details: 'SAT/ACT is not required for admission to UBC. WAEC/WASSCE English language proficiency recognized upon review.',
    },
    deadlines: {
      term: "Winter Session 2027",
      deadlineText: "ILOT Award: Dec 1, 2026 · Regular: Jan 15, 2027",
      deadlineDate: "2027-01-15",
      isRolling: false,
      cycleStatus: "open",
      statusNotice: "UBC applications open via EducationPlannerBC for 2027 entry.",
    },
    deadline: "ILOT Award: Dec 1, 2026 · Regular: Jan 15, 2027",
    deadlineDate: '2027-01-15',
    admissionsRequirements: {
      academic: 'Senior Secondary School Graduation Diploma (WASSCE, IB, A-Levels, or equivalent) with high academic standing (equivalent to minimum 85%+).',
      language: 'IELTS Academic (minimum 6.5, no band below 6.0) or TOEFL iBT (minimum 90 with 22 in reading/listening, 21 in writing/speaking).',
      documents: [
        'EducationPlannerBC / UBC Application',
        'UBC Personal Profile Essays',
        'School Nomination Form for International Scholars',
        'Interim & Final Transcripts',
      ],
      standardizedTests: 'Not required.',
    },
    studyFields: [
      'Computer Science',
      'Biomedical Engineering',
      'Commerce & Finance',
      'Forestry & Conservation',
      'Global Resource Systems',
    ],
    intakeTerm: 'Winter Term 1 (September 2026)',
    verifiedBadge: 'Verified Official Data',
    summary: 'UBC is a global center for research and teaching, offering transformational 4-year International Leader of Tomorrow awards for outstanding scholars.',
    officialRuleSummary: 'Accredited by the Ministry of Post-Secondary Education and Future Skills of British Columbia.',
  },

  // 30. RWANDA - University of Rwanda
  {
    id: 'univ-rwanda',
    officialName: 'University of Rwanda',
    institution: 'University of Rwanda',
    shortName: 'UR',
    country: 'Rwanda',
    countryCode: 'RW',
    countryFlag: '🇷🇼',
    city: 'Kigali',
    officialWebsite: 'https://ur.ac.rw',
    sourceUrl: 'https://ur.ac.rw/?Admissions-75',
    officialUrl: 'https://registration.ur.ac.rw',
    category: 'university',
    institutionType: 'Public University',
    title: 'World Bank African Centers of Excellence Fellowships & Regional Undergraduate Entry',
    isVerified: true,
    verificationSource: 'Higher Education Council of Rwanda (HEC) & World Bank ACE II Project Directory',
    verifiedAt: 'October 2026 Academic Audit',
    logo: {
      logoUrl: '/logos/univ-rwanda.png',
      bg: '#1B365D',
      text: '#FFFFFF',
      monogram: 'UR',
      crestColor: '#00A3E0',
      logoDescription: 'University of Rwanda Blue and Sunburst',
    },
    eligibilityCountries: ['Ghana', 'Rwanda', 'East African Community (EAC)', 'African Union'],
    nationalityEligibility: {
      category: 'African Citizens',
      details: 'Open to African Union member states with regional student visa facilitation and World Bank fellowships for African STEM researchers.',
      eligibleRegions: ['Ghana', 'Rwanda', 'EAC', 'African Union'],
    },
    degreeLevels: ['Undergraduate', "Master's", 'PhD'],
    fundingDetails: {
      type: 'Fully Funded',
      amount: 'Full Tuition + $600/month stipend + Research Grants for ACE Scholars',
      details: 'World Bank African Centers of Excellence offer full scholarships for international African MSc and PhD researchers in Data Science and Energy.',
      tuitionCoverage: '100% tuition coverage for ACE regional awardees',
      livingStipend: '$600 monthly living allowance',
    },
    funding: {
      type: 'Fully Funded',
      amount: 'Full Tuition + $600/month stipend + Research Grants for ACE Scholars',
      details: 'World Bank African Centers of Excellence offer full scholarships for international African MSc and PhD researchers in Data Science and Energy.',
    },
    applicationFees: {
      status: 'Free ($0 Fee)',
      details: 'Online application for African Centers of Excellence fellowship tracks is free ($0 application fee).',
      amount: '$0 for ACE International Fellows',
    },
    applicationFee: {
      status: 'Free ($0 Fee)',
      details: 'Online application for African Centers of Excellence fellowship tracks is free ($0 application fee).',
    },
    testWaiverRules: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT, ACT, or GRE required. Admissions based on national high school certificate or recognized undergraduate degree.',
      wassceExemptionDetails: 'WASSCE grade A1–C6 fully recognized.',
    },
    testPolicy: {
      status: 'Test-Free ($0 SAT)',
      details: 'No SAT, ACT, or GRE required. Admissions based on national high school certificate or recognized undergraduate degree.',
    },
    deadlines: {
      term: "2026/2027 Academic Year (Cycle Concluded)",
      deadlineText: "July 15, 2026 (Expired / 2026 Intake Closed)",
      deadlineDate: "2026-07-15",
      isRolling: false,
      cycleStatus: "expired",
      statusNotice: "Main 2026/2027 intake for ACE II centers closed on July 15, 2026.",
    },
    deadline: "July 15, 2026 (Expired / 2026 Intake Closed)",
    deadlineDate: '2026-07-15',
    admissionsRequirements: {
      academic: 'National High School Certificate or equivalent with minimum 2 principal passes for undergraduate; Bachelor’s degree in related discipline for postgraduate.',
      language: 'English proficiency certificate or English-medium degree transcript.',
      documents: [
        'UR Online Registration',
        'Certified Academic Certificates & Transcripts',
        'Passport Data Page Copy',
        'Academic Motivation Letter',
      ],
      standardizedTests: 'None required.',
    },
    studyFields: [
      'Data Science & Analytics',
      'Renewable Energy & Power Systems',
      'Internet of Things (IoT)',
      'Epidemiology',
      'Economics',
    ],
    intakeTerm: 'September 2026',
    verifiedBadge: 'Verified Official Data',
    summary: 'Rwanda’s flagship public university hosting multi-million dollar World Bank African Centers of Excellence in Data Science, IoT, and Energy Systems.',
    officialRuleSummary: 'Accredited by the Higher Education Council (HEC) of Rwanda.',
  },

  // 31. SINGAPORE - National University of Singapore
  {
    "id": "nus-singapore",
    "officialName": "National University of Singapore",
    "institution": "National University of Singapore",
    "shortName": "NUS",
    "country": "Singapore",
    "countryCode": "SG",
    "countryFlag": "🇸🇬",
    "city": "Kent Ridge, Singapore",
    "officialWebsite": "https://nus.edu.sg",
    "sourceUrl": "https://www.nus.edu.sg/oam/admissions",
    "officialUrl": "https://www.nus.edu.sg/oam/admissions",
    "category": "university",
    "institutionType": "Public University",
    "title": "Singapore MOE Tuition Grant Scheme & NUS Science & Technology Undergraduate Scholarship",
    "isVerified": true,
    "verificationSource": "Singapore Ministry of Education (MOE) & NUS Office of Admissions Bulletin",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/nus-singapore.svg",
      "bg": "#EF7C00",
      "text": "#003D7C",
      "monogram": "NUS",
      "crestColor": "#003D7C",
      "logoDescription": "NUS Orange & Deep Navy Crest",
    },
    "eligibilityCountries": [
      "Singapore",
      "Ghana",
      "Nigeria",
      "Kenya",
      "India",
      "Malaysia",
      "Indonesia",
      "China",
      "United Kingdom",
      "Canada",
      "United States",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Open to all international nationalities for admissions. The Singapore MOE Tuition Grant subsidizes up to 50% tuition for global scholars in exchange for a 3-year service commitment in Singapore-registered entities.",
      "eligibleRegions": [
        "Singapore",
        "ASEAN",
        "Ghana",
        "Africa",
        "Global International"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition + S$6,000 Annual Living Allowance + Airfare Grant",
      "details": "NUS Science & Technology (S&T) and Global Merit Scholarships provide 100% tuition coverage, accommodation subsidy, and yearly living allowances.",
      "tuitionCoverage": "100% subsidized tuition via MOE Grant & NUS Merit Endowment",
      "livingStipend": "S$6,000 per annum + S$1,750 computer allowance"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition + S$6,000 Annual Living Allowance + Airfare Grant",
      "details": "NUS Science & Technology (S&T) and Global Merit Scholarships provide 100% tuition coverage, accommodation subsidy, and yearly living allowances."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "S$20 (approx. $15 USD) for international qualifications. Hardship fee exemptions coordinated through financial aid office.",
      "amount": "S$20 (~$15 USD)"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "S$20 (approx. $15 USD) for international qualifications. Hardship fee exemptions coordinated through financial aid office."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is not required for applicants with Cambridge A-Levels, International Baccalaureate (IB 38+), or recognized national high school diplomas.",
      "satPolicy": "SAT optional for international curriculum holders; strong school-leaving results required.",
      "englishProficiencyPolicy": "WASSCE English with grades A1-B3 accepted in lieu of IELTS/TOEFL for applicants from Anglophone West Africa.",
      "wassceExemptionDetails": "WASSCE Core English A1-B3 fulfills English proficiency requirement."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is not required for applicants with Cambridge A-Levels, International Baccalaureate (IB 38+), or recognized national high school diplomas."
    },
    "deadlines": {
      "term": "Academic Year 2027/2028 (August 2027 Intake)",
      "deadlineText": "February 28, 2027",
      "deadlineDate": "2027-02-28",
      "cycleStatus": "open",
      "statusNotice": "Admissions actively open on the official NUS Applicant Portal for AY 2027/2028.",
      "isRolling": false
    },
    "deadline": "February 28, 2027",
    "deadlineDate": "2027-02-28",
    "admissionsRequirements": {
      "academic": "Exceptional academic record: High School Diploma / Cambridge A-Levels (minimum 3 AAA grades) / IB Diploma (minimum 38 points).",
      "language": "English proficiency (IELTS 6.5+, TOEFL 92+, or WASSCE A1-B3).",
      "documents": [
        "NUS Online International Application",
        "Official High School Transcript & National Exam Results",
        "Passport Identification Data Page",
        "Academic Referee Reports (Postgraduate)"
      ],
      "standardizedTests": "Optional (SAT/ACT not mandatory for IB or Cambridge holders)."
    },
    "studyFields": [
      "Computer Science & Artificial Intelligence",
      "Data Science & Analytics",
      "Biomedical Engineering",
      "Finance & Business Analytics",
      "Mechanical Engineering"
    ],
    "intakeTerm": "August 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Asia’s premier research university ranked #8 globally, offering world-class STEM and business programs backed by Singapore MOE tuition grants and merit scholarships.",
    "officialRuleSummary": "Regulated by the Ministry of Education (MOE) Singapore under the National University of Singapore Act."
  },

  // 32. CHINA - Tsinghua University
  {
    "id": "tsinghua-university-china",
    "officialName": "Tsinghua University",
    "institution": "Tsinghua University",
    "shortName": "Tsinghua",
    "country": "China",
    "countryCode": "CN",
    "countryFlag": "🇨🇳",
    "city": "Haidian District, Beijing",
    "officialWebsite": "https://www.tsinghua.edu.cn/en/",
    "sourceUrl": "https://www.tsinghua.edu.cn/en/Admissions.htm",
    "officialUrl": "https://www.tsinghua.edu.cn/en/Admissions.htm",
    "category": "university",
    "institutionType": "Public University",
    "title": "Schwarzman Scholars & Chinese Government Scholarship (CSC Full Award)",
    "isVerified": true,
    "verificationSource": "China Scholarship Council (CSC) & Tsinghua Undergraduate/Graduate International Admissions",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/tsinghua-university-china.png",
      "bg": "#660874",
      "text": "#FFFFFF",
      "monogram": "THU",
      "crestColor": "#660874",
      "logoDescription": "Tsinghua Royal Purple Seal",
    },
    "eligibilityCountries": [
      "China",
      "Ghana",
      "Nigeria",
      "Kenya",
      "South Africa",
      "United States",
      "United Kingdom",
      "Canada",
      "Germany",
      "France",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Open to non-Chinese citizens holding valid foreign passports. Schwarzman Scholars accepts candidates globally regardless of nationality; CSC scholarships are open to citizens of diplomatic partner states.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Europe",
        "Americas",
        "Asia-Pacific"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + Comprehensive Health Insurance + Monthly Stipend (RMB 3,000–3,500/mo)",
      "details": "The Chinese Government Scholarship (CSC Type A & B) and Schwarzman Scholars fully cover tuition, campus accommodation, travel stipend, and monthly living allowances.",
      "tuitionCoverage": "100% full tuition waiver",
      "livingStipend": "RMB 3,500/month (~$500 USD) + free campus dormitory"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + Comprehensive Health Insurance + Monthly Stipend (RMB 3,000–3,500/mo)",
      "details": "The Chinese Government Scholarship (CSC Type A & B) and Schwarzman Scholars fully cover tuition, campus accommodation, travel stipend, and monthly living allowances."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "RMB 800 (~$110 USD) for standard university application. Schwarzman Scholars program is 100% free ($0 fee) to apply.",
      "amount": "RMB 800 / $0 for Schwarzman"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "RMB 800 (~$110 USD) for standard university application. Schwarzman Scholars program is 100% free ($0 fee) to apply."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is optional. Applicants can submit national high school leaving examinations, IB, or A-Levels. Chinese proficiency (HSK) is waived for English-taught programs.",
      "satPolicy": "SAT optional; holistic portfolio and video interview review.",
      "englishProficiencyPolicy": "IELTS/TOEFL waived for native English speakers or applicants whose high school education was conducted in English."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is optional. Applicants can submit national high school leaving examinations, IB, or A-Levels."
    },
    "deadlines": {
      "term": "Fall 2027 Undergraduate & Graduate Intake",
      "deadlineText": "January 10, 2027 (Round 1) / March 1, 2027 (CSC Fellowship)",
      "deadlineDate": "2027-03-01",
      "cycleStatus": "open",
      "statusNotice": "Applications actively open on the Tsinghua International Student Portal for Fall 2027.",
      "isRolling": false
    },
    "deadline": "January 10, 2027 (Round 1) / March 1, 2027 (CSC Fellowship)",
    "deadlineDate": "2027-03-01",
    "admissionsRequirements": {
      "academic": "High school graduation diploma or Bachelor’s degree with high academic standing.",
      "language": "English proficiency (TOEFL 85+ or IELTS 6.5+) for English-medium tracks; or HSK Level 5 (180+) for Chinese-taught programs.",
      "documents": [
        "Tsinghua Online Application Form",
        "Official High School / University Transcripts",
        "Two Letters of Academic Recommendation",
        "Personal Statement & Video Essay"
      ],
      "standardizedTests": "Optional (SAT, ACT, IB, or A-Levels accepted)."
    },
    "studyFields": [
      "Global Affairs (Schwarzman)",
      "Computer Science & Engineering",
      "Artificial Intelligence",
      "Civil & Environmental Engineering",
      "Economics & Finance"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "China’s highest-ranked institution and global STEM powerhouse, offering fully funded fellowships for international scholars in global affairs, computer science, and engineering.",
    "officialRuleSummary": "Accredited by the Ministry of Education of the People’s Republic of China."
  },

  // 33. SOUTH KOREA - KAIST (Korea Advanced Institute of Science and Technology)
  {
    "id": "kaist-south-korea",
    "officialName": "KAIST (Korea Advanced Institute of Science and Technology)",
    "institution": "Korea Advanced Institute of Science and Technology",
    "shortName": "KAIST",
    "country": "South Korea",
    "countryCode": "KR",
    "countryFlag": "🇰🇷",
    "city": "Daejeon, South Korea",
    "officialWebsite": "https://www.kaist.ac.kr/en/",
    "sourceUrl": "https://admission.kaist.ac.kr/intl-undergraduate/",
    "officialUrl": "https://admission.kaist.ac.kr",
    "category": "university",
    "institutionType": "Technical University",
    "title": "KAIST International Student Full Scholarship (100% Tuition & Monthly Allowance)",
    "isVerified": true,
    "verificationSource": "KAIST Office of International Admissions & Korean Ministry of Science and ICT",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/kaist-south-korea.svg",
      "bg": "#004191",
      "text": "#FFFFFF",
      "monogram": "KAIST",
      "crestColor": "#004191",
      "logoDescription": "KAIST Cobalt Blue Wordmark",
    },
    "eligibilityCountries": [
      "South Korea",
      "Ghana",
      "Nigeria",
      "Kenya",
      "Ethiopia",
      "Rwanda",
      "United States",
      "Canada",
      "Vietnam",
      "Indonesia",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All international applicants who are not citizens of Korea are automatically considered for the KAIST International Student Scholarship upon admission.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Americas",
        "Asia",
        "Europe"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Waiver for 8 Semesters + 350,000 KRW/month living stipend + Health Insurance",
      "details": "All admitted undergraduate and graduate international students receive 100% tuition coverage for the entire program duration as long as they maintain a 2.7/4.3 GPA.",
      "tuitionCoverage": "100% tuition covered by KAIST National Endowment",
      "livingStipend": "350,000 KRW per month living allowance + national health insurance"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Waiver for 8 Semesters + 350,000 KRW/month living stipend + Health Insurance",
      "details": "All admitted undergraduate and graduate international students receive 100% tuition coverage for the entire program duration as long as they maintain a 2.7/4.3 GPA."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "80,000 KRW or $80 USD international application processing fee.",
      "amount": "80,000 KRW (~$60 USD)"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "80,000 KRW or $80 USD international application processing fee."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT and ACT are optional. Admissions decisions are based on high school grades in mathematics and science, letters of recommendation, and personal statements.",
      "satPolicy": "SAT/ACT optional; high school transcripts and science Olympiad awards prioritized.",
      "englishProficiencyPolicy": "IELTS/TOEFL waived if secondary education was instructed completely in English."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT and ACT are optional. Admissions decisions are based on high school grades in mathematics and science."
    },
    "deadlines": {
      "term": "Fall 2027 Undergraduate International Cycle",
      "deadlineText": "Early: Nov 20, 2026 · Regular: January 15, 2027",
      "deadlineDate": "2027-01-15",
      "cycleStatus": "open",
      "statusNotice": "Online application window actively open for Fall 2027 undergraduate international admissions.",
      "isRolling": false
    },
    "deadline": "Early: Nov 20, 2026 · Regular: January 15, 2027",
    "deadlineDate": "2027-01-15",
    "admissionsRequirements": {
      "academic": "High school graduation with exceptional grades in Advanced Mathematics, Physics, Chemistry, and Computing.",
      "language": "TOEFL iBT 83, IELTS 6.5, or official verification of English-medium secondary schooling.",
      "documents": [
        "KAIST Online Application",
        "One Recommendation Letter from STEM Teacher",
        "Official High School Transcript & Profile",
        "Honors and Awards Portfolio (Optional)"
      ],
      "standardizedTests": "Optional (SAT, ACT, AP, IB, or national STEM exams accepted)."
    },
    "studyFields": [
      "School of Computing (Computer Science)",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Bio & Brain Engineering",
      "Physics & Mathematical Sciences"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "South Korea’s top science and technology research university, 100% taught in English, providing every admitted international student full tuition and monthly living allowances.",
    "officialRuleSummary": "Established by the South Korean Government under the special KAIST Act.",
    "linkStatus": "needs-review",
    "reviewNote": "International admissions subdomain (admission.kaist.ac.kr) timed out during automated check; verify portal connectivity."
  },

  // 34. UNITED ARAB EMIRATES - New York University Abu Dhabi
  {
    "id": "nyu-abu-dhabi-uae",
    "officialName": "New York University Abu Dhabi",
    "institution": "New York University Abu Dhabi",
    "shortName": "NYUAD",
    "country": "United Arab Emirates",
    "countryCode": "AE",
    "countryFlag": "🇦🇪",
    "city": "Saadiyat Island, Abu Dhabi",
    "officialWebsite": "https://nyuad.nyu.edu",
    "sourceUrl": "https://nyuad.nyu.edu/en/admissions.html",
    "officialUrl": "https://nyuad.nyu.edu/en/admissions.html",
    "category": "university",
    "institutionType": "Private University",
    "title": "Need-Blind Admissions & 100% Demonstrated Need-Met Aid (Falcon Scholarship)",
    "isVerified": true,
    "verificationSource": "NYU Office of Global Financial Aid & UAE Commission for Academic Accreditation",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/nyu-abu-dhabi-uae.svg",
      "bg": "#57068C",
      "text": "#FFFFFF",
      "monogram": "NYUAD",
      "crestColor": "#57068C",
      "logoDescription": "NYU Torch & Violet Seal",
    },
    "eligibilityCountries": [
      "United Arab Emirates",
      "Ghana",
      "Nigeria",
      "Kenya",
      "United States",
      "United Kingdom",
      "Canada",
      "India",
      "Pakistan",
      "Brazil",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Admissions and financial aid are open to all citizens worldwide. 100% of demonstrated financial need is met for all admitted students, including tuition, housing, health insurance, and international travel.",
      "eligibleRegions": [
        "Global International",
        "Middle East",
        "Africa",
        "Europe",
        "Americas",
        "Asia"
      ]
    },
    "degreeLevels": [
      "Undergraduate"
    ],
    "fundingDetails": {
      "type": "100% Need-Met",
      "amount": "Full Tuition ($62,000+) + Room & Board + Comprehensive Medical + Annual Airfare",
      "details": "All admitted international students receive personalized financial aid packages meeting 100% of demonstrated need with zero student loans.",
      "tuitionCoverage": "100% demonstrated tuition covered",
      "livingStipend": "Full campus housing, dining plan, books, and international flights provided based on need"
    },
    "funding": {
      "type": "100% Need-Met",
      "amount": "Full Tuition ($62,000+) + Room & Board + Comprehensive Medical + Annual Airfare",
      "details": "All admitted international students receive personalized financial aid packages meeting 100% of demonstrated need with zero student loans."
    },
    "applicationFees": {
      "status": "Fee Waiver Available",
      "details": "Common Application fee waiver available via school counselor or CSS Profile hardship request ($0 fee).",
      "amount": "$80 or $0 with Waiver",
      "waiverInstructions": "Select Common App fee waiver or email nyuad.admissions@nyu.edu."
    },
    "applicationFee": {
      "status": "Fee Waiver Available",
      "details": "Common Application fee waiver available via school counselor or CSS Profile hardship request ($0 fee)."
    },
    "testWaiverRules": {
      "status": "Test-Optional",
      "details": "NYU is test-optional. International students may apply with or without standardized test scores (SAT/ACT).",
      "satPolicy": "Test-optional policy applies to all programs at NYUAD.",
      "englishProficiencyPolicy": "Waived if student studied in an English-speaking high school curriculum (e.g. WASSCE, IB, A-Levels).",
      "wassceExemptionDetails": "WASSCE with strong English grades waives external language testing."
    },
    "testPolicy": {
      "status": "Test-Optional",
      "details": "NYU is test-optional. International students may apply with or without standardized test scores (SAT/ACT)."
    },
    "deadlines": {
      "term": "Class of 2031 (Fall 2027 Intake)",
      "deadlineText": "Early Decision I: Nov 1, 2026 · Regular Decision: January 5, 2027",
      "deadlineDate": "2027-01-05",
      "cycleStatus": "open",
      "statusNotice": "Common Application portal actively open for Fall 2027 admissions with 100% need-met aid.",
      "isRolling": false
    },
    "deadline": "Early Decision I: Nov 1, 2026 · Regular Decision: January 5, 2027",
    "deadlineDate": "2027-01-05",
    "admissionsRequirements": {
      "academic": "Outstanding secondary school diploma, WASSCE (A1/B2 grades), IB Diploma, or Cambridge A-Levels.",
      "language": "English proficiency via secondary curriculum verification or IELTS 7.5 / TOEFL 100+.",
      "documents": [
        "Common Application for NYU",
        "Official Secondary School Transcripts & School Report",
        "Two Teacher Recommendations & Counselor Recommendation",
        "CSS Profile for Financial Aid Evaluation"
      ],
      "standardizedTests": "Test-Optional (SAT/ACT not mandatory)."
    },
    "studyFields": [
      "Computer Science",
      "Bioengineering & Health Sciences",
      "Economics & Global Development",
      "Mechanical & Civil Engineering",
      "Political Science & International Relations"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "A highly selective liberal arts and research portal campus of New York University in Abu Dhabi, offering 100% need-met aid covering tuition, housing, and flights for global scholars.",
    "officialRuleSummary": "Accredited by the UAE Commission for Academic Accreditation and the Middle States Commission on Higher Education."
  },

  // 35. QATAR - Georgetown University in Qatar
  {
    "id": "georgetown-university-qatar",
    "officialName": "Georgetown University in Qatar",
    "institution": "Georgetown University in Qatar",
    "shortName": "GU-Q",
    "country": "Qatar",
    "countryCode": "QA",
    "countryFlag": "🇶🇦",
    "city": "Education City, Doha",
    "officialWebsite": "https://qatar.georgetown.edu",
    "sourceUrl": "https://qatar.georgetown.edu/admissions/",
    "officialUrl": "https://qatar.georgetown.edu/admissions/",
    "category": "university",
    "institutionType": "Private University",
    "title": "Bachelor of Science in Foreign Service (BSFS) & Qatar Foundation Need-Based Aid",
    "isVerified": true,
    "verificationSource": "Qatar Foundation for Education & Georgetown University Office of Undergraduate Admissions",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      logoUrl: '/logos/georgetown-university-qatar.svg',
      "bg": "#041E42",
      "text": "#FFFFFF",
      "monogram": "GU-Q",
      "crestColor": "#63666A",
      "logoDescription": "Georgetown Navy & Gray Seal",
    },
    "eligibilityCountries": [
      "Qatar",
      "Ghana",
      "Nigeria",
      "Kenya",
      "United States",
      "Jordan",
      "Egypt",
      "Lebanon",
      "India",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Admissions open to all international candidates. Qatar Foundation provides need-based financial aid and merit scholarships to students from across Africa, the Middle East, Asia, Europe, and the Americas.",
      "eligibleRegions": [
        "Global International",
        "Middle East",
        "Africa",
        "Worldwide"
      ]
    },
    "degreeLevels": [
      "Undergraduate"
    ],
    "fundingDetails": {
      "type": "100% Need-Met",
      "amount": "Full Tuition + Qatar Foundation Zero-Interest Loans & Forgivable Grants",
      "details": "Qatar Foundation Financial Aid Program provides zero-interest loans that can be forgiven upon graduation through approved service employment in Qatar.",
      "tuitionCoverage": "Up to 100% tuition assistance based on assessed family contribution",
      "livingStipend": "Campus housing in Education City provided based on need"
    },
    "funding": {
      "type": "100% Need-Met",
      "amount": "Full Tuition + Qatar Foundation Zero-Interest Loans & Forgivable Grants",
      "details": "Qatar Foundation Financial Aid Program provides zero-interest loans that can be forgiven upon graduation through approved service employment in Qatar."
    },
    "applicationFees": {
      "status": "Fee Waiver Available",
      "details": "Admissions application fee waivers are automatically considered for international applicants demonstrating financial hardship.",
      "amount": "$65 or $0 with Waiver"
    },
    "applicationFee": {
      "status": "Fee Waiver Available",
      "details": "Admissions application fee waivers are automatically considered for international applicants demonstrating financial hardship."
    },
    "testWaiverRules": {
      "status": "Test-Optional",
      "details": "SAT/ACT is optional for admissions to GU-Q. Academic performance in high school and extracurricular leadership are evaluated holistically.",
      "satPolicy": "SAT/ACT optional.",
      "englishProficiencyPolicy": "IELTS/TOEFL waived for students whose language of secondary instruction was English."
    },
    "testPolicy": {
      "status": "Test-Optional",
      "details": "SAT/ACT is optional for admissions to GU-Q."
    },
    "deadlines": {
      "term": "Fall 2027 Undergraduate Admissions",
      "deadlineText": "Priority Round: Nov 15, 2026 · Regular Decision: February 1, 2027",
      "deadlineDate": "2027-02-01",
      "cycleStatus": "open",
      "statusNotice": "Admissions portal actively open for Fall 2027 entry and Qatar Foundation grant funding.",
      "isRolling": false
    },
    "deadline": "Priority Round: Nov 15, 2026 · Regular Decision: February 1, 2027",
    "deadlineDate": "2027-02-01",
    "admissionsRequirements": {
      "academic": "High school graduation with strong performance in social sciences, history, literature, and mathematics.",
      "language": "English proficiency demonstration via secondary schooling or IELTS 7.0 / TOEFL 100.",
      "documents": [
        "Georgetown Online Application Portal",
        "Counselor and Teacher Recommendation Letters",
        "Official Transcripts and National Certificates (WASSCE, IB, A-Levels)",
        "Personal Statement and Why GU-Q Essay"
      ],
      "standardizedTests": "Optional (SAT/ACT optional)."
    },
    "studyFields": [
      "International Politics",
      "International Economics",
      "Culture and Politics",
      "International History"
    ],
    "intakeTerm": "August 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "World-renowned school of foreign service conferring official Georgetown University degrees in Doha, supported by Qatar Foundation need-based forgivable financial aid.",
    "officialRuleSummary": "Regulated under the Qatar Ministry of Education and Higher Education in partnership with Georgetown University Washington D.C."
  },

  // 36. SWEDEN - Karolinska Institutet
  {
    "id": "karolinska-institutet-sweden",
    "officialName": "Karolinska Institutet",
    "institution": "Karolinska Institutet",
    "shortName": "Karolinska",
    "country": "Sweden",
    "countryCode": "SE",
    "countryFlag": "🇸🇪",
    "city": "Solna / Stockholm, Sweden",
    "officialWebsite": "https://ki.se/en",
    "sourceUrl": "https://education.ki.se/bachelors-masters-studies/apply",
    "officialUrl": "https://education.ki.se/bachelors-masters-studies/apply",
    "category": "university",
    "institutionType": "Specialized / Regional",
    "title": "Karolinska Institutet Global Master’s Scholarship & Swedish Institute Grants",
    "isVerified": true,
    "verificationSource": "Swedish Higher Education Authority (UKÄ) & Karolinska Scholarship Committee",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/karolinska-institutet-sweden.svg",
      "bg": "#990000",
      "text": "#FFFFFF",
      "monogram": "KI",
      "crestColor": "#D4AF37",
      "logoDescription": "Karolinska Crimson & Gold Medical Emblem",
    },
    "eligibilityCountries": [
      "Sweden",
      "Ghana",
      "Nigeria",
      "Kenya",
      "South Africa",
      "Canada",
      "United States",
      "India",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All fee-paying international students (non-EU/EEA) are eligible to apply for the KI Global Master’s Scholarship. Swedish Institute Scholarships are additionally open to citizens of designated emerging nations.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Asia",
        "Americas"
      ]
    },
    "degreeLevels": [
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Tuition Waiver",
      "amount": "100% Full Tuition Coverage for Duration of Master’s Degree (approx. 360,000 SEK)",
      "details": "The KI Global Master’s Scholarship covers the entire tuition fee for selected international students with outstanding academic merits.",
      "tuitionCoverage": "100% tuition waiver",
      "livingStipend": "Swedish Institute scholars also receive SEK 12,000/month living grant"
    },
    "funding": {
      "type": "Tuition Waiver",
      "amount": "100% Full Tuition Coverage for Duration of Master’s Degree (approx. 360,000 SEK)",
      "details": "The KI Global Master’s Scholarship covers the entire tuition fee for selected international students with outstanding academic merits."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "900 SEK (~$85 USD) centralized application fee on universityadmissions.se.",
      "amount": "900 SEK (~$85 USD)"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "900 SEK (~$85 USD) centralized application fee on universityadmissions.se."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE, SAT, or GMAT required for any Master’s program. Admissions are purely based on previous academic qualifications and CV/motivation.",
      "satPolicy": "No standardized entrance tests required.",
      "englishProficiencyPolicy": "English language requirements met with IELTS 6.5, TOEFL 90, or university degree completed in English in Ghana, Nigeria, or South Africa.",
      "wassceExemptionDetails": "University degree taught in English fulfills English level 6."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE, SAT, or GMAT required for any Master’s program."
    },
    "deadlines": {
      "term": "Autumn 2027 Global Master's Cycle",
      "deadlineText": "Application: January 15, 2027 · Document Submission: February 1, 2027",
      "deadlineDate": "2027-01-15",
      "cycleStatus": "open",
      "statusNotice": "Applications actively open on UniversityAdmissions.se for Autumn 2027 Global Master's programmes.",
      "isRolling": false
    },
    "deadline": "Application: January 15, 2027 · Document Submission: February 1, 2027",
    "deadlineDate": "2027-01-15",
    "admissionsRequirements": {
      "academic": "Bachelor’s degree (or equivalent foreign degree) with major in Biomedicine, Biology, Chemistry, Medicine, or related health sciences.",
      "language": "English 6 proficiency (IELTS 6.5 with no band below 5.5, TOEFL 90, or English-taught degree verification).",
      "documents": [
        "Centralized UniversityAdmissions.se Application",
        "Official Degree Certificates & Transcripts",
        "KI Curriculum Vitae and Motivation Form",
        "Proof of English Proficiency"
      ],
      "standardizedTests": "None required."
    },
    "studyFields": [
      "Global Health",
      "Biomedicine",
      "Bioentrepreneurship",
      "Public Health Sciences (Epidemiology)",
      "Toxicology"
    ],
    "intakeTerm": "August 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Sweden’s world-famous single-faculty medical university—home to the Nobel Assembly in Physiology or Medicine—offering full tuition waivers in biomedicine and global health.",
    "officialRuleSummary": "Regulated by the Swedish Higher Education Authority (Universitetskanslersämbetet)."
  },

  // 37. IRELAND - Trinity College Dublin, the University of Dublin
  {
    "id": "trinity-college-dublin-ireland",
    "officialName": "Trinity College Dublin, the University of Dublin",
    "institution": "Trinity College Dublin",
    "shortName": "Trinity Dublin",
    "country": "Ireland",
    "countryCode": "IE",
    "countryFlag": "🇮🇪",
    "city": "Dublin, Ireland",
    "officialWebsite": "https://www.tcd.ie",
    "sourceUrl": "https://www.tcd.ie/study/international/",
    "officialUrl": "https://www.tcd.ie/study/international/",
    "category": "university",
    "institutionType": "Public University",
    "title": "Government of Ireland International Education Scholarship (GOI-IES) & Global Excellence Award",
    "isVerified": true,
    "verificationSource": "Higher Education Authority (HEA) Ireland & Trinity Global Admissions",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/trinity-college-dublin-ireland.png",
      "bg": "#002B49",
      "text": "#FFFFFF",
      "monogram": "TCD",
      "crestColor": "#002B49",
      "logoDescription": "Trinity Navy Blue & Book of Kells Crest",
    },
    "eligibilityCountries": [
      "Ireland",
      "Ghana",
      "Nigeria",
      "Kenya",
      "United States",
      "Canada",
      "India",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All non-EU international applicants holding an offer from Trinity are eligible to apply for the Government of Ireland GOI-IES scholarship and Trinity Global Excellence Awards.",
      "eligibleRegions": [
        "Non-EU / Global International",
        "Africa",
        "North America",
        "Asia"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + €10,000 Government of Ireland Living Stipend",
      "details": "The Government of Ireland International Education Scholarship provides €10,000 for one study year alongside a full tuition waiver granted by Trinity College Dublin.",
      "tuitionCoverage": "100% tuition waiver from Trinity College Dublin",
      "livingStipend": "€10,000 cash living grant for the academic year"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + €10,000 Government of Ireland Living Stipend",
      "details": "The Government of Ireland International Education Scholarship provides €10,000 for one study year alongside a full tuition waiver granted by Trinity College Dublin."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "€55 application fee for direct online international applications.",
      "amount": "€55"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "€55 application fee for direct online international applications."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is not required for international students presenting British A-Levels, International Baccalaureate, or recognized high school diplomas.",
      "satPolicy": "SAT optional for US curriculum; not required for international tracks.",
      "englishProficiencyPolicy": "West African WASSCE English grade C6 or higher recognized for foundation or direct undergraduate entry.",
      "wassceExemptionDetails": "WASSCE English with good grades satisfies English language requirement."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is not required for international students."
    },
    "deadlines": {
      "term": "2027/2028 Academic Year",
      "deadlineText": "GOI-IES Scholarship: March 15, 2027 · TCD Direct: June 30, 2027",
      "deadlineDate": "2027-03-15",
      "cycleStatus": "open",
      "statusNotice": "Direct international portal actively open for 2027 academic admissions.",
      "isRolling": false
    },
    "deadline": "GOI-IES Scholarship: March 15, 2027 · TCD Direct: June 30, 2027",
    "deadlineDate": "2027-03-15",
    "admissionsRequirements": {
      "academic": "Senior high school diploma (minimum 80% or A-Levels ABB / IB 34+) or upper second-class honours Bachelor degree for Master’s programs.",
      "language": "IELTS 6.5+, TOEFL 90+, or recognized WASSCE English credentials.",
      "documents": [
        "Trinity MyEducation Online Application",
        "Official Academic Transcripts & Graduation Certificates",
        "Two Letters of Academic Recommendation",
        "Statement of Purpose"
      ],
      "standardizedTests": "Optional."
    },
    "studyFields": [
      "Computer Science (Data Science / AI)",
      "Immunology & Global Health",
      "Biomedical Engineering",
      "Finance & Business Analytics",
      "English Literature & History"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Ireland’s historic premier university located in central Dublin, offering full tuition waivers and state living grants in partnership with the Higher Education Authority of Ireland.",
    "officialRuleSummary": "Chartered public university under the Universities Act 1997 of Ireland."
  },

  // 38. ITALY - Politecnico di Milano
  {
    "id": "politecnico-di-milano-italy",
    "officialName": "Politecnico di Milano",
    "institution": "Politecnico di Milano",
    "shortName": "PoliMi",
    "country": "Italy",
    "countryCode": "IT",
    "countryFlag": "🇮🇹",
    "city": "Milan, Lombardy, Italy",
    "officialWebsite": "https://www.polimi.it/en",
    "sourceUrl": "https://www.polimi.it/en/international-prospective-students",
    "officialUrl": "https://www.polimi.it/en/international-prospective-students",
    "category": "university",
    "institutionType": "Technical University",
    "title": "DSU Regional Right to Education Full Scholarship & Merit Platinum Awards",
    "isVerified": true,
    "verificationSource": "Regione Lombardia DSU & Ministry of University and Research (MUR) Italy",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "bg": "#00264D",
      "text": "#FFFFFF",
      "monogram": "POLIMI",
      "crestColor": "#00264D",
      "logoDescription": "PoliMi Navy & Gold Classical Crest",
      "logoUrl": "/logos/politecnico-di-milano-italy.svg",
      "logoSourceUrl": "https://commons.wikimedia.org/wiki/File:Politecnicomilano-logo.svg"
    },
    "eligibilityCountries": [
      "Italy",
      "Ghana",
      "Nigeria",
      "Kenya",
      "Ethiopia",
      "India",
      "Egypt",
      "Brazil",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All international students enrolled in Master of Science programs can apply for DSU Right to Education Scholarships based on family financial parity (ISEE Parificato) regardless of nationality.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Americas",
        "Asia",
        "Europe"
      ]
    },
    "degreeLevels": [
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Exemption + €7,000/year living allowance + Free Campus Meals & Housing",
      "details": "DSU Regional Right to Education provides 100% exemption from all university fees, free accommodation in student residences, and meals at campus cafeterias.",
      "tuitionCoverage": "100% full tuition exemption via regional welfare grant",
      "livingStipend": "Up to €7,000 cash grant + free student accommodation"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Exemption + €7,000/year living allowance + Free Campus Meals & Housing",
      "details": "DSU Regional Right to Education provides 100% exemption from all university fees, free accommodation in student residences, and meals at campus cafeterias."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "€50 non-refundable administrative application fee on the PoliMi portal.",
      "amount": "€50"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "€50 non-refundable administrative application fee on the PoliMi portal."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE, GMAT, or SAT required for international engineering and architecture applicants with recognized Bachelor degrees.",
      "satPolicy": "No standardized exams required.",
      "englishProficiencyPolicy": "IELTS 6.0 / TOEFL 78, or official documentation verifying undergraduate studies were completed in English."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE, GMAT, or SAT required for international engineering applicants."
    },
    "deadlines": {
      "term": "First Semester 2027/2028 (September 2027 Intake)",
      "deadlineText": "Round 1: February 15, 2027 · Round 2: March 31, 2027",
      "deadlineDate": "2027-03-31",
      "cycleStatus": "open",
      "statusNotice": "Applications actively open on PoliMi Online Services for First Semester 2027/2028 MSc programs.",
      "isRolling": false
    },
    "deadline": "Round 1: February 15, 2027 · Round 2: March 31, 2027",
    "deadlineDate": "2027-03-31",
    "admissionsRequirements": {
      "academic": "Bachelor of Science or equivalent degree in Engineering, Architecture, or Design with strong mathematical foundation.",
      "language": "English proficiency (TOEFL 78, IELTS 6.0, or English-medium degree certificate).",
      "documents": [
        "PoliMi Online Application Portal",
        "Official Academic Transcripts and Course Descriptions (Syllabus)",
        "Letter of Motivation & Curriculum Vitae",
        "Portfolio (for Architecture and Design candidates)"
      ],
      "standardizedTests": "None required."
    },
    "studyFields": [
      "Computer Science and Engineering",
      "Telecommunication Engineering",
      "Mechanical Engineering",
      "Architecture and Urban Design",
      "Management Engineering"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Europe’s top technical university for engineering, architecture, and design, offering complete tuition waivers, free housing, and living grants through Lombardy regional DSU programs.",
    "officialRuleSummary": "Accredited by the Ministry of University and Research (MUR) Italy and member of IDEA League.",
    "linkStatus": "needs-review",
    "reviewNote": "Admissions portal timed out during automated check; verify link manually."
  },

  // 39. NEW ZEALAND - The University of Auckland
  {
    "id": "university-of-auckland-new-zealand",
    "officialName": "The University of Auckland",
    "institution": "The University of Auckland",
    "shortName": "UoA",
    "country": "New Zealand",
    "countryCode": "NZ",
    "countryFlag": "🇳🇿",
    "city": "Auckland, New Zealand",
    "officialWebsite": "https://www.auckland.ac.nz",
    "sourceUrl": "https://www.auckland.ac.nz/en/study/international-students.html",
    "officialUrl": "https://www.auckland.ac.nz/en/study/international-students.html",
    "category": "university",
    "institutionType": "Public University",
    "title": "Manaaki New Zealand Government Scholarships & International Student Excellence Award",
    "isVerified": true,
    "verificationSource": "New Zealand Ministry of Foreign Affairs and Trade (MFAT) & NZQA",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "bg": "#00467F",
      "text": "#FFFFFF",
      "monogram": "UoA",
      "crestColor": "#00467F",
      "logoDescription": "Auckland Blue & Open Book Crest",
      "logoUrl": "/logos/university-of-auckland-new-zealand.png",
      "logoSourceUrl": "https://en.wikipedia.org/wiki/File:University_of_Auckland_Coat_of_Arms.png"
    },
    "eligibilityCountries": [
      "New Zealand",
      "Ghana",
      "Kenya",
      "South Africa",
      "Nigeria",
      "Fiji",
      "Samoa",
      "Papua New Guinea",
      "Vietnam",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "African Citizens",
      "details": "Manaaki New Zealand Scholarships are specifically designated for citizens of eligible developing partner nations across Africa, the Pacific, Asia, and Latin America, covering full costs.",
      "eligibleRegions": [
        "Africa (Eligible Partner Nations)",
        "Pacific",
        "ASEAN",
        "Latin America"
      ]
    },
    "degreeLevels": [
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Fees + NZ$531/week living allowance + NZ$3,000 establishment allowance + Medical & Travel",
      "details": "Manaaki New Zealand Scholarships fully fund post-graduate study, including round-trip airfare, full medical insurance, and weekly living allowances.",
      "tuitionCoverage": "100% full tuition coverage funded by New Zealand MFAT",
      "livingStipend": "NZ$531 weekly living allowance + NZ$3,000 setup grant"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Fees + NZ$531/week living allowance + NZ$3,000 establishment allowance + Medical & Travel",
      "details": "Manaaki New Zealand Scholarships fully fund post-graduate study, including round-trip airfare, full medical insurance, and weekly living allowances."
    },
    "applicationFees": {
      "status": "Free ($0 Fee)",
      "details": "Online international scholarship applications submitted through the Manaaki NZ portal are completely free ($0 application fee).",
      "amount": "$0 via Manaaki Portal"
    },
    "applicationFee": {
      "status": "Free ($0 Fee)",
      "details": "Online international scholarship applications submitted through the Manaaki NZ portal are completely free ($0 application fee)."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "No SAT or GRE required for New Zealand universities. Direct admissions based on undergraduate GPA and professional experience.",
      "satPolicy": "No standardized tests required.",
      "englishProficiencyPolicy": "IELTS 6.5 / TOEFL 90; waivers available for candidates who completed an English-medium degree in an approved country."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No SAT or GRE required for New Zealand universities."
    },
    "deadlines": {
      "term": "Semester 1 & 2 2027 Academic Year",
      "deadlineText": "Semester 1 (Feb 2027): Dec 8, 2026 · Manaaki Scholarship: February 28, 2027",
      "deadlineDate": "2027-02-28",
      "cycleStatus": "open",
      "statusNotice": "Admissions actively open for 2027 study semesters and Manaaki New Zealand scholarships.",
      "isRolling": false
    },
    "deadline": "Semester 1 (Feb 2027): Dec 8, 2026 · Manaaki Scholarship: February 28, 2027",
    "deadlineDate": "2027-02-28",
    "admissionsRequirements": {
      "academic": "Recognized Bachelor’s degree with a minimum Grade Point Average of 5.0 (B grade or second-class upper equivalent) and relevant work experience.",
      "language": "English language proficiency (IELTS 6.5 with no band below 6.0 or TOEFL iBT 90).",
      "documents": [
        "Manaaki New Zealand Online Application",
        "Academic Transcripts and Degree Certificate",
        "Work Experience & Leadership Verification",
        "Development Impact Statement"
      ],
      "standardizedTests": "None required."
    },
    "studyFields": [
      "Renewable Energy & Geothermal Engineering",
      "Climate Change & Environmental Science",
      "Food Security & Agribusiness",
      "Public Policy & Governance",
      "Public Health"
    ],
    "intakeTerm": "February / July 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "New Zealand’s highest-ranked university providing full tuition, weekly living stipends, and airfare for developing nation scholars through official government Manaaki scholarships.",
    "officialRuleSummary": "Regulated under the Education and Training Act 2020 of New Zealand."
  },

  // 40. EGYPT - The American University in Cairo
  {
    "id": "american-university-in-cairo-egypt",
    "officialName": "The American University in Cairo",
    "institution": "The American University in Cairo",
    "shortName": "AUC Egypt",
    "country": "Egypt",
    "countryCode": "EG",
    "countryFlag": "🇪🇬",
    "city": "New Cairo, Cairo, Egypt",
    "officialWebsite": "https://www.aucegypt.edu",
    "sourceUrl": "https://www.aucegypt.edu/admissions/scholarships",
    "officialUrl": "https://www.aucegypt.edu/admissions",
    "category": "university",
    "institutionType": "Private University",
    "title": "African Graduate Fellowships & Tomorrow’s Leaders Undergraduate Full Scholarship",
    "isVerified": true,
    "verificationSource": "Egyptian Ministry of Higher Education & Middle States Commission on Higher Education",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "bg": "#002855",
      "text": "#FFFFFF",
      "monogram": "AUC",
      "crestColor": "#D99B00",
      "logoDescription": "AUC Cairo Deep Blue & Gold Crest",
      "logoUrl": "/logos/american-university-in-cairo-egypt.svg",
      "logoSourceUrl": "https://en.wikipedia.org/wiki/File:The_American_University_in_Cairo_logo.svg"
    },
    "eligibilityCountries": [
      "Egypt",
      "Ghana",
      "Nigeria",
      "Kenya",
      "Rwanda",
      "Uganda",
      "Tanzania",
      "South Africa",
      "All African Union Nations"
    ],
    "nationalityEligibility": {
      "category": "African Citizens",
      "details": "The African Graduate Fellowship is exclusively open to nationals of African countries (non-Egyptian) seeking Master’s degrees in science, engineering, and social sciences.",
      "eligibleRegions": [
        "All 54 African Union Member States",
        "Ghana",
        "Egypt",
        "Sub-Saharan Africa"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + Monthly Living Stipend + Free On-Campus Student Housing + Medical Coverage",
      "details": "AUC African Graduate Fellowships fully cover tuition fees, housing in AUC New Cairo campus residences, monthly stipends, and medical services.",
      "tuitionCoverage": "100% full tuition exemption for duration of degree",
      "livingStipend": "Monthly living allowance + on-campus furnished accommodation"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + Monthly Living Stipend + Free On-Campus Student Housing + Medical Coverage",
      "details": "AUC African Graduate Fellowships fully cover tuition fees, housing in AUC New Cairo campus residences, monthly stipends, and medical services."
    },
    "applicationFees": {
      "status": "Fee Waiver Available",
      "details": "Online graduate fellowship applicants may request an application fee waiver through the Office of Graduate Studies.",
      "amount": "$50 or $0 with Waiver"
    },
    "applicationFee": {
      "status": "Fee Waiver Available",
      "details": "Online graduate fellowship applicants may request an application fee waiver through the Office of Graduate Studies."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "GRE is waived for most engineering and humanities departments. Admissions decisions are based on academic performance and letters of recommendation.",
      "satPolicy": "SAT optional for undergraduate; GRE waived for STEM MSc fellowships.",
      "englishProficiencyPolicy": "IELTS 6.5 / TOEFL 79-80; waived for graduates of recognized English-medium universities.",
      "wassceExemptionDetails": "English-medium university transcript fulfills language criteria."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "GRE is waived for most engineering and humanities departments."
    },
    "deadlines": {
      "term": "Fall 2027 Academic Semester",
      "deadlineText": "Fellowships & Financial Aid: February 1, 2027 · Regular: April 1, 2027",
      "deadlineDate": "2027-02-01",
      "cycleStatus": "open",
      "statusNotice": "Application portal actively open for Fall 2027 admissions and African Graduate Fellowships.",
      "isRolling": false
    },
    "deadline": "Fellowships & Financial Aid: February 1, 2027 · Regular: April 1, 2027",
    "deadlineDate": "2027-02-01",
    "admissionsRequirements": {
      "academic": "Bachelor of Science or Arts degree with minimum overall GPA of 3.2 on a 4.0 scale (or very good / upper second class honours).",
      "language": "IELTS 6.5 or TOEFL iBT 79; or official certificate of English instruction.",
      "documents": [
        "AUC Online Graduate Application",
        "Official University Transcripts and Degree Certificate",
        "Statement of Purpose and Research Interest",
        "Two Confidential Letters of Academic Recommendation"
      ],
      "standardizedTests": "Waived for fellowship applicants."
    },
    "studyFields": [
      "Robotics & Autonomous Systems",
      "Sustainable Development & Environmental Engineering",
      "Computer Science",
      "Global Public Health",
      "Economics in International Development"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "The leading English-medium liberal arts and research university in North Africa, offering full tuition, free accommodation, and monthly stipends for talented African scholars.",
    "officialRuleSummary": "Accredited in the United States by the Middle States Commission on Higher Education and recognized by the Egyptian Ministry of Higher Education."
  },

  // 41. BELGIUM - KU Leuven
  {
    "id": "ku-leuven-belgium",
    "officialName": "KU Leuven",
    "institution": "Katholieke Universiteit Leuven",
    "shortName": "KU Leuven",
    "country": "Belgium",
    "countryCode": "BE",
    "countryFlag": "🇧🇪",
    "city": "Leuven, Flanders, Belgium",
    "officialWebsite": "https://www.kuleuven.be/english/",
    "sourceUrl": "https://www.kuleuven.be/english/admissions",
    "officialUrl": "https://www.kuleuven.be/english/admissions",
    "category": "university",
    "institutionType": "Public University",
    "title": "Master Mind Scholarships for International Students (Flemish Ministry of Education)",
    "isVerified": true,
    "verificationSource": "Flemish Ministry of Education and Training & KU Leuven International Admissions",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/ku-leuven-belgium.svg",
      "bg": "#1D8DB0",
      "text": "#FFFFFF",
      "monogram": "KUL",
      "crestColor": "#1D8DB0",
      "logoDescription": "KU Leuven Cyan Blue Wordmark",
    },
    "eligibilityCountries": [
      "Belgium",
      "Ghana",
      "Nigeria",
      "Kenya",
      "Canada",
      "United States",
      "India",
      "Brazil",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All nationalities worldwide are eligible to be nominated for the Flemish Government Master Mind Scholarship upon receiving admission to a KU Leuven Master’s program.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Americas",
        "Asia",
        "Europe"
      ]
    },
    "degreeLevels": [
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Fee Waiver (to €131.50) + €10,000 Living Grant per Academic Year",
      "details": "The Master Mind Scholarship awards students €10,000 per academic year to cover living expenses and limits tuition fees to the minimal registration fee.",
      "tuitionCoverage": "Substantial tuition fee reduction to €131.50/year",
      "livingStipend": "€10,000 annual living allowance paid in installments"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Fee Waiver (to €131.50) + €10,000 Living Grant per Academic Year",
      "details": "The Master Mind Scholarship awards students €10,000 per academic year to cover living expenses and limits tuition fees to the minimal registration fee."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "€110 application fee for non-EEA students.",
      "amount": "€110"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "€110 application fee for non-EEA students."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE required for most engineering, science, and bioscience master degrees. Evaluated on bachelor GPA and course syllabus.",
      "satPolicy": "No standardized tests required.",
      "englishProficiencyPolicy": "IELTS 7.0 / TOEFL 94; waivers available for holders of an undergraduate degree taught exclusively in English."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No GRE required for most engineering, science, and bioscience master degrees."
    },
    "deadlines": {
      "term": "2027-2028 Academic Year",
      "deadlineText": "Master Mind Candidates: February 1, 2027 · Non-EEA Standard: March 1, 2027",
      "deadlineDate": "2027-03-01",
      "cycleStatus": "open",
      "statusNotice": "Online admissions portal actively open for 2027-2028 master's degree programmes.",
      "isRolling": false
    },
    "deadline": "Master Mind Candidates: February 1, 2027 · Non-EEA Standard: March 1, 2027",
    "deadlineDate": "2027-03-01",
    "admissionsRequirements": {
      "academic": "Bachelor degree in related discipline with high academic achievement (Grade Point Average of 3.5 out of 4.0 or equivalent).",
      "language": "TOEFL iBT 94 (minimum 20 all sections) or IELTS 7.0 (minimum 6.5 all sections).",
      "documents": [
        "KU Leuven Online Application Portal",
        "Official Academic Transcripts and Diploma Supplement",
        "Curriculum Vitae and Motivation Letter",
        "Two Letters of Academic Recommendation"
      ],
      "standardizedTests": "Optional (GRE waived for engineering applicants from accredited universities)."
    },
    "studyFields": [
      "Master of Computer Science (Artificial Intelligence)",
      "Biomedical Engineering",
      "Nanoscience & Nanotechnology",
      "Sustainable Development",
      "Statistics and Data Science"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "One of Europe’s oldest and highest-ranking universities, known as a world leader in technological innovation and recipient of Flemish Government Master Mind grants.",
    "officialRuleSummary": "Accredited by the Flemish Ministry of Education and Training and the Accreditation Organisation of the Netherlands and Flanders (NVAO)."
  },

  // 42. HONG KONG - The University of Hong Kong
  {
    "id": "university-of-hong-kong-hku",
    "officialName": "The University of Hong Kong",
    "institution": "The University of Hong Kong",
    "shortName": "HKU",
    "country": "Hong Kong",
    "countryCode": "HK",
    "countryFlag": "🇭🇰",
    "city": "Pokfulam, Hong Kong",
    "officialWebsite": "https://hku.hk",
    "sourceUrl": "https://admissions.hku.hk/international",
    "officialUrl": "https://admissions.hku.hk/international",
    "category": "university",
    "institutionType": "Public University",
    "title": "Hong Kong PhD Fellowship Scheme (HKPFS) & Foundation Entrance Full Scholarships",
    "isVerified": true,
    "verificationSource": "Research Grants Council (RGC) Hong Kong & HKU International Admissions Office",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/university-of-hong-kong-hku.svg",
      "bg": "#005A36",
      "text": "#FFFFFF",
      "monogram": "HKU",
      "crestColor": "#005A36",
      "logoDescription": "HKU Emerald Green & Gold Shield",
    },
    "eligibilityCountries": [
      "Hong Kong",
      "Ghana",
      "Nigeria",
      "Kenya",
      "Canada",
      "United Kingdom",
      "United States",
      "Singapore",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All international candidates worldwide demonstrating superior academic achievement are eligible for the Hong Kong PhD Fellowship Scheme (HKPFS) and HKU Undergraduate Foundation Scholarships.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Europe",
        "North America",
        "Asia-Pacific"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + HK$331,200/year living stipend (~US$42,460) + Conference Travel Allowance",
      "details": "The HKPFS provides an annual stipend of HK$331,200 (approx. $42,460 USD) plus full tuition waiver and conference travel grant of HK$13,800/year for up to 4 years.",
      "tuitionCoverage": "100% full tuition waived by HKU",
      "livingStipend": "HK$27,600 monthly living allowance (~US$3,538/month)"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "Full Tuition Waiver + HK$331,200/year living stipend (~US$42,460) + Conference Travel Allowance",
      "details": "The HKPFS provides an annual stipend of HK$331,200 (approx. $42,460 USD) plus full tuition waiver and conference travel grant of HK$13,800/year for up to 4 years."
    },
    "applicationFees": {
      "status": "Standard Fee",
      "details": "HK$450 (~$58 USD) for undergraduate; free HKPFS initial application.",
      "amount": "HK$450 (~$58 USD)"
    },
    "applicationFee": {
      "status": "Standard Fee",
      "details": "HK$450 (~$58 USD) for undergraduate; free HKPFS initial application."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is optional. Applicants can qualify directly through Cambridge A-Levels (minimum 3 A* grades), International Baccalaureate (IB 36+), or first-class Bachelor degrees.",
      "satPolicy": "SAT/ACT optional.",
      "englishProficiencyPolicy": "IELTS 6.5 / TOEFL 93; waived for students holding an English-medium secondary or university qualification.",
      "wassceExemptionDetails": "English-medium secondary schooling fulfills English requirements."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT/ACT is optional. Evaluated via A-Levels, IB, or high school transcripts."
    },
    "deadlines": {
      "term": "2027-2028 Academic Year",
      "deadlineText": "HKPFS PhD: December 1, 2026 · International UG: February 20, 2027",
      "deadlineDate": "2027-02-20",
      "cycleStatus": "open",
      "statusNotice": "International admissions actively open on HKU admissions portal for 2027 intake.",
      "isRolling": false
    },
    "deadline": "HKPFS PhD: December 1, 2026 · International UG: February 20, 2027",
    "deadlineDate": "2027-02-20",
    "admissionsRequirements": {
      "academic": "Outstanding academic record: High School Diploma / IB (36+) / A-Levels (AAA or better) for undergraduate; First Class Honours Bachelor degree for PhD.",
      "language": "IELTS 6.5 or TOEFL 93, or recognized English-instruction credentials.",
      "documents": [
        "HKU Online International Application",
        "Official Academic Transcripts and Certificates",
        "Research Proposal (for PhD candidates)",
        "Academic Referee Reports"
      ],
      "standardizedTests": "Optional."
    },
    "studyFields": [
      "Artificial Intelligence & Data Engineering",
      "Finance and Quantitative Analysis",
      "Biomedical Sciences",
      "Civil & Structural Engineering",
      "Law and International Studies"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Hong Kong’s top-ranked comprehensive research university, 100% English-medium, offering world-leading PhD fellowships and undergraduate entrance scholarships.",
    "officialRuleSummary": "Accredited by the University Grants Committee (UGC) of Hong Kong."
  },

  // 43. MEXICO - Instituto Tecnológico y de Estudios Superiores de Monterrey
  {
    "id": "tecnologico-de-monterrey-mexico",
    "officialName": "Instituto Tecnológico y de Estudios Superiores de Monterrey",
    "institution": "Tecnológico de Monterrey",
    "shortName": "Tec de Monterrey",
    "country": "Mexico",
    "countryCode": "MX",
    "countryFlag": "🇲🇽",
    "city": "Monterrey, Nuevo León, Mexico",
    "officialWebsite": "https://tec.mx/en",
    "sourceUrl": "https://tec.mx/en/admissions-and-aid",
    "officialUrl": "https://tec.mx/en/admissions-and-aid",
    "category": "university",
    "institutionType": "Private University",
    "title": "Líderes del Mañana (Leaders of Tomorrow) 100% Full Scholarship & International Excellence",
    "isVerified": true,
    "verificationSource": "Secretariat of Public Education (SEP) Mexico & SACSCOC Accreditation",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "logoUrl": "/logos/tecnologico-de-monterrey-mexico.jpg",
      "bg": "#0039A6",
      "text": "#FFFFFF",
      "monogram": "TEC",
      "crestColor": "#0039A6",
      "logoDescription": "Tec de Monterrey Royal Blue Torch",
    },
    "eligibilityCountries": [
      "Mexico",
      "Ghana",
      "Nigeria",
      "Colombia",
      "Peru",
      "Guatemala",
      "United States",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Open to high-achieving international candidates with social impact leadership portfolios. Full tuition waivers available for students with high financial need and community transformation projects.",
      "eligibleRegions": [
        "Global International",
        "Latin America",
        "Africa",
        "North America"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Scholarship for Entire Undergraduate Degree Program",
      "details": "The Líderes del Mañana program provides a 100% full-ride tuition scholarship for the complete duration of an undergraduate degree.",
      "tuitionCoverage": "100% tuition coverage",
      "livingStipend": "Books and medical insurance subsidy included"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Scholarship for Entire Undergraduate Degree Program",
      "details": "The Líderes del Mañana program provides a 100% full-ride tuition scholarship for the complete duration of an undergraduate degree."
    },
    "applicationFees": {
      "status": "Fee Waiver Available",
      "details": "Online international application fee can be waived for candidates qualifying for need-based scholarship review ($0 fee).",
      "amount": "$70 or $0 with Waiver"
    },
    "applicationFee": {
      "status": "Fee Waiver Available",
      "details": "Online international application fee can be waived for candidates qualifying for need-based scholarship review ($0 fee)."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "Tec offers an online institutional academic assessment (PAA) or accepts SAT/ACT scores. SAT is optional.",
      "satPolicy": "SAT optional; online aptitude exam available.",
      "englishProficiencyPolicy": "IELTS 6.5 or TOEFL 80 required for English-taught degree tracks."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "SAT optional; institutional online assessment accepted."
    },
    "deadlines": {
      "term": "August 2027 Undergraduate Intake",
      "deadlineText": "Líderes del Mañana Fellowship: February 28, 2027",
      "deadlineDate": "2027-02-28",
      "cycleStatus": "open",
      "statusNotice": "Applications actively open for August 2027 international undergraduate cohort and fellowships.",
      "isRolling": false
    },
    "deadline": "Líderes del Mañana Fellowship: February 28, 2027",
    "deadlineDate": "2027-02-28",
    "admissionsRequirements": {
      "academic": "High school diploma with minimum 90/100 grade average (or equivalent high performance) and proven social entrepreneurship leadership.",
      "language": "Spanish or English proficiency depending on chosen degree medium.",
      "documents": [
        "Tec Online Admissions Form",
        "High School Transcripts and Diplomas",
        "Social Impact Leadership Portfolio and Video",
        "Letters of Endorsement"
      ],
      "standardizedTests": "Institutional PAA test or SAT."
    },
    "studyFields": [
      "Computer Science & Software Technologies",
      "Biotechnology Engineering",
      "Industrial Engineering & Logistics",
      "Global Business & Entrepreneurship",
      "Sustainable Mechatronics Engineering"
    ],
    "intakeTerm": "August 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Latin America’s highest-ranked private university renowned for entrepreneurship and STEM innovation, offering 100% full tuition scholarships for talented changemakers.",
    "officialRuleSummary": "Accredited by the Southern Association of Colleges and Schools Commission on Colleges (SACSCOC) and the Mexican Ministry of Public Education (SEP)."
  },

  // 44. TURKEY - Koç University
  {
    "id": "koc-university-turkey",
    "officialName": "Koç University",
    "institution": "Koç University",
    "shortName": "Koç",
    "country": "Turkey",
    "countryCode": "TR",
    "countryFlag": "🇹🇷",
    "city": "Sarıyer, Istanbul, Turkey",
    "officialWebsite": "https://www.ku.edu.tr/en/",
    "sourceUrl": "https://international.ku.edu.tr",
    "officialUrl": "https://international.ku.edu.tr",
    "category": "university",
    "institutionType": "Private University",
    "title": "Koç University Full Graduate Scholarship & Türkiye Bursları Bilateral Awards",
    "isVerified": true,
    "verificationSource": "Council of Higher Education (YÖK) Turkey & Koç Graduate Admissions",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "bg": "#A51818",
      "text": "#FFFFFF",
      "monogram": "KU",
      "crestColor": "#A51818",
      "logoDescription": "Koç University Crimson Emblem",
      "logoUrl": "/logos/koc-university-turkey.svg",
      "logoSourceUrl": "https://en.wikipedia.org/wiki/File:Ko%C3%A7_University_logo.svg"
    },
    "eligibilityCountries": [
      "Turkey",
      "Ghana",
      "Nigeria",
      "Kenya",
      "South Africa",
      "United States",
      "United Kingdom",
      "India",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "All international applicants applying to MSc with Thesis and PhD programs are automatically considered for 100% full tuition waivers, free housing, and monthly living stipends.",
      "eligibleRegions": [
        "Global International",
        "Africa",
        "Europe",
        "Middle East",
        "Asia",
        "Americas"
      ]
    },
    "degreeLevels": [
      "Undergraduate",
      "Master's",
      "PhD"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Waiver + Free Furnished Campus Housing + Monthly Living Stipend + Health Insurance",
      "details": "All admitted PhD and MSc Thesis students receive full tuition exemption, monthly cash stipend (approx. 20,000–30,000 TRY), private health insurance, and campus accommodation.",
      "tuitionCoverage": "100% full tuition waiver",
      "livingStipend": "Monthly living allowance + free on-campus dormitory accommodation"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "100% Full Tuition Waiver + Free Furnished Campus Housing + Monthly Living Stipend + Health Insurance",
      "details": "All admitted PhD and MSc Thesis students receive full tuition exemption, monthly cash stipend (approx. 20,000–30,000 TRY), private health insurance, and campus accommodation."
    },
    "applicationFees": {
      "status": "Free ($0 Fee)",
      "details": "Koç University online graduate applications are completely free ($0 application fee).",
      "amount": "$0 for All Applicants"
    },
    "applicationFee": {
      "status": "Free ($0 Fee)",
      "details": "Koç University online graduate applications are completely free ($0 application fee)."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "GRE requirement is waived for many STEM departments for students holding degrees from reputable international institutions with strong GPAs.",
      "satPolicy": "SAT optional for undergraduate; GRE waived for qualifying graduate departments.",
      "englishProficiencyPolicy": "100% of instruction is in English. TOEFL iBT 80+ required or institutional English exam."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No application fee and GRE waiver available for qualified applicants."
    },
    "deadlines": {
      "term": "Fall 2027 Academic Year",
      "deadlineText": "Early Round: February 20, 2027 · Regular Graduate: June 15, 2027",
      "deadlineDate": "2027-06-15",
      "cycleStatus": "open",
      "statusNotice": "Online application system actively open for Fall 2027 programs and tuition scholarships.",
      "isRolling": false
    },
    "deadline": "Early Round: February 20, 2027 · Regular Graduate: June 15, 2027",
    "deadlineDate": "2027-06-15",
    "admissionsRequirements": {
      "academic": "Bachelor degree in relevant STEM or Social Science discipline with minimum GPA of 3.0/4.0.",
      "language": "TOEFL iBT 80 or higher (IELTS not accepted under Turkish Higher Education Council rules for university admission).",
      "documents": [
        "Koç University Online Application Portal",
        "Official Academic Transcripts and Diplomas",
        "Statement of Purpose and Research Focus",
        "Three Letters of Academic Recommendation"
      ],
      "standardizedTests": "GRE (waived for select programs) or institutional evaluation."
    },
    "studyFields": [
      "Computer Science and Engineering",
      "Artificial Intelligence & Robotics",
      "Biomedical Sciences and Engineering",
      "Molecular Biology and Genetics",
      "Economics and Financial Analytics"
    ],
    "intakeTerm": "September 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Turkey’s premier research university, taught entirely in English, automatically granting 100% tuition waivers, campus housing, and monthly cash stipends to all admitted graduate researchers.",
    "officialRuleSummary": "Accredited by the Council of Higher Education (YÖK) of Turkey."
  },

  // 45. ARGENTINA - Universidad de Buenos Aires
  {
    "id": "universidad-de-buenos-aires-argentina",
    "officialName": "Universidad de Buenos Aires",
    "institution": "Universidad de Buenos Aires",
    "shortName": "UBA",
    "country": "Argentina",
    "countryCode": "AR",
    "countryFlag": "🇦🇷",
    "city": "Buenos Aires, Argentina",
    "officialWebsite": "https://www.uba.ar",
    "sourceUrl": "https://www.uba.ar/internacionales",
    "officialUrl": "https://www.uba.ar/internacionales",
    "category": "university",
    "institutionType": "Public University",
    "title": "Tuition-Free ($0 Tuition) Undergraduate Higher Education for All Nationalities",
    "isVerified": true,
    "verificationSource": "Argentine Ministry of Education & National Commission for University Evaluation (CONEAU)",
    "verifiedAt": "October 2026 Academic Audit",
    "logo": {
      "bg": "#002B49",
      "text": "#FFFFFF",
      "monogram": "UBA",
      "crestColor": "#002B49",
      "logoDescription": "UBA Classical Seal & Academic Torch",
      "logoUrl": "/logos/universidad-de-buenos-aires-argentina.png",
      "logoSourceUrl": "https://commons.wikimedia.org/wiki/File:Uba_univ_bsas_logo.png"
    },
    "eligibilityCountries": [
      "Argentina",
      "Ghana",
      "Nigeria",
      "Brazil",
      "Chile",
      "Colombia",
      "United States",
      "All International Citizens"
    ],
    "nationalityEligibility": {
      "category": "All International Citizens",
      "details": "Under Article 1 of the Argentine Higher Education Law (Ley 24.521), undergraduate education at all public national universities in Argentina is 100% tuition-free for all students, regardless of nationality or legal residency.",
      "eligibleRegions": [
        "All Nationalities Worldwide",
        "Latin America",
        "Africa",
        "Europe",
        "Global"
      ]
    },
    "degreeLevels": [
      "Undergraduate"
    ],
    "fundingDetails": {
      "type": "Fully Funded",
      "amount": "$0 Tuition / 100% Free Public University Education for All Nationalities",
      "details": "Tuition is completely free ($0 per credit) for all undergraduate degree programs under Argentine national constitutional law.",
      "tuitionCoverage": "100% free tuition mandated by national law",
      "livingStipend": "Subsidized university dining and public transport passes available"
    },
    "funding": {
      "type": "Fully Funded",
      "amount": "$0 Tuition / 100% Free Public University Education for All Nationalities",
      "details": "Tuition is completely free ($0 per credit) for all undergraduate degree programs under Argentine national constitutional law."
    },
    "applicationFees": {
      "status": "Free ($0 Fee)",
      "details": "Enrollment in the Ciclo Básico Común (CBC) and UBA degree courses is completely free ($0 fee).",
      "amount": "$0"
    },
    "applicationFee": {
      "status": "Free ($0 Fee)",
      "details": "Enrollment in the Ciclo Básico Común (CBC) and UBA degree courses is completely free ($0 fee)."
    },
    "testWaiverRules": {
      "status": "Test-Free ($0 SAT)",
      "details": "No SAT, ACT, or entrance exams. Admission is guaranteed to all students who complete the one-year Ciclo Básico Común (CBC) foundation curriculum.",
      "satPolicy": "No entrance exams required.",
      "englishProficiencyPolicy": "Spanish language proficiency (CELU or CEI minimum level B2) required since degree instruction is in Spanish."
    },
    "testPolicy": {
      "status": "Test-Free ($0 SAT)",
      "details": "No entrance exams required; direct open entry via CBC."
    },
    "deadlines": {
      "term": "First Semester 2027 (March 2027 Intake)",
      "deadlineText": "CBC 2027 Pre-enrollment: February 15, 2027",
      "deadlineDate": "2027-02-15",
      "cycleStatus": "open",
      "statusNotice": "Pre-enrollment open for 2027 academic year with 100% tuition-free higher education.",
      "isRolling": false
    },
    "deadline": "CBC 2027 Pre-enrollment: February 15, 2027",
    "deadlineDate": "2027-02-15",
    "admissionsRequirements": {
      "academic": "High school graduation diploma convalidated by the Argentine Ministry of Education (Convalidación de Título Secundario).",
      "language": "Spanish proficiency at B2 level (CELU or DELE B2 certificate).",
      "documents": [
        "CBC Online Pre-Registration Form",
        "Convalidated High School Diploma and Transcripts (with Apostille)",
        "National Identity Document (DNI) or Valid Foreign Passport",
        "Proof of Spanish Language Proficiency"
      ],
      "standardizedTests": "None required (100% open admission through CBC)."
    },
    "studyFields": [
      "Medicine & Biomedical Sciences",
      "Computer Science",
      "Civil & Mechanical Engineering",
      "Law and Social Sciences",
      "Economics and Accounting"
    ],
    "intakeTerm": "March 2027",
    "verifiedBadge": "Verified Official Data",
    "summary": "Latin America’s highest-ranked public mega-university, educating over 300,000 students completely tuition-free regardless of nationality or country of origin.",
    "officialRuleSummary": "Regulated under Argentine National Higher Education Law Ley 24.521."
  },
];
