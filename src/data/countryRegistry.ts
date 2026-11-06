/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_COUNTRIES, Country } from './countries';
import type { OpportunityItem } from './opportunities';

export type VerificationStatus = 'verified' | 'in_review' | 'pending_verification';

export interface CountryVerificationRecord {
  countryName: string;
  countryCode: string;
  countryFlag: string;
  nationality: string;
  status: VerificationStatus;
  verifiedInstitutionsCount: number;
  accreditationAuthority: string;
  officialMinistryPortal: string;
  internationalAdmissionsPolicy: string;
  eligibleNationalitiesSummary: string;
  foreignCredentialsAccepted: string;
  lastAudited: string;
  verificationNotes: string;
}

// Official national accreditation bodies and international student admission frameworks
export const KNOWN_ACCREDITATION_BODIES: Record<
  string,
  {
    authority: string;
    portal: string;
    policy: string;
    credentials: string;
    nationalities: string;
    status?: VerificationStatus;
  }
> = {
  Ghana: {
    authority: 'Ghana Tertiary Education Commission (GTEC) & Ministry of Education',
    portal: 'https://gtec.edu.gh',
    policy: 'Welcomes international and regional African applicants. Direct entry via WASSCE/WAEC, Cambridge A-Levels, IB, or national high school certificates.',
    credentials: 'WASSCE (A1–C6 in 6 subjects including Core English & Math), Cambridge A-Levels, International Baccalaureate (IB), French Baccalauréat.',
    nationalities: 'Open to Ghanaian citizens, ECOWAS members, African Union (AU) nationals, and global international candidates.',
    status: 'verified',
  },
  'United States': {
    authority: 'U.S. Department of Education & SEVP (Student and Exchange Visitor Program)',
    portal: 'https://www.ed.gov',
    policy: 'F-1 / J-1 Student Visa sponsorship. Highly institutionalized need-based and merit aid with holistic admissions reviews.',
    credentials: 'High School Diploma, WASSCE (credential evaluation required at select colleges), IB Diploma, Cambridge A-Levels. SAT/ACT optional at many partner institutions.',
    nationalities: 'Institutional policies vary: select colleges offer 100% need-blind admissions to all citizens worldwide; others provide designated regional/African grants.',
    status: 'verified',
  },
  'United Kingdom': {
    authority: 'Office for Students (OfS) & UKVI Student Sponsor Register',
    portal: 'https://www.officeforstudents.org.uk',
    policy: 'Student Visa (Tier 4 / Student Route). Direct entry typically requires UK A-Levels, IB, or recognized 1-year foundation for secondary school graduates.',
    credentials: 'Cambridge A-Levels, International Baccalaureate (IB), recognized foundation diplomas. Select institutions accept WASSCE with foundation or direct entry for top grades.',
    nationalities: 'Eligibility varies by program: Commonwealth scholarships open to Commonwealth member citizens; university-funded aid open globally.',
    status: 'verified',
  },
  Canada: {
    authority: 'Immigration, Refugees and Citizenship Canada (IRCC) Designated Learning Institutions (DLI)',
    portal: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
    policy: 'Study Permit via DLI institution acceptance. Transparent entry benchmarks with post-graduation work opportunities.',
    credentials: 'Senior High School Transcript, WASSCE (scratch card verification), Cambridge A-Levels, IB, French Baccalauréat.',
    nationalities: 'Open to all international citizens worldwide holding valid DLI acceptance letter.',
    status: 'verified',
  },
  Germany: {
    authority: 'DAAD (German Academic Exchange Service) & Standing Conference (KMK / Anabin)',
    portal: 'https://www.daad.de',
    policy: 'Tuition-free or low-tuition public university system. International students require Hochschulzugangsberechtigung (HZB) or Studienkolleg.',
    credentials: 'Anabin database verification: IB, Cambridge A-Levels, or 1–2 years completed university study post-WASSCE/High School.',
    nationalities: 'All nationalities worldwide eligible for public university admission and DAAD merit scholarships.',
    status: 'verified',
  },
  Australia: {
    authority: 'CRICOS (Commonwealth Register of Institutions and Courses for Overseas Students) & TEQSA',
    portal: 'https://cricos.education.gov.au',
    policy: 'Student Visa (Subclass 500). CRICOS-registered courses ensure quality assurance and tuition protection.',
    credentials: 'ATAR equivalent: Cambridge A-Levels, IB Diploma, or recognized Foundation Year program.',
    nationalities: 'Open globally; specific bilateral scholarships for Indo-Pacific and African scholars (Australia Awards).',
    status: 'verified',
  },
  Rwanda: {
    authority: 'Higher Education Council of Rwanda (HEC) & Ministry of Education',
    portal: 'https://www.hec.gov.rw',
    policy: 'Regional pan-African higher education hub. English-medium programs with streamlined African student visa waivers.',
    credentials: 'Advanced Level National Examination, WASSCE, Cambridge A-Levels, IB, EAC national diplomas.',
    nationalities: 'Strong pan-African mission: open to citizens across all 54 African Union member nations and global international candidates.',
    status: 'verified',
  },
  Nigeria: {
    authority: 'National Universities Commission (NUC)',
    portal: 'https://www.nuc.edu.ng',
    policy: 'Federal, State, and accredited Private universities. Joint Admissions and Matriculation Board (JAMB) / Direct Entry foreign quotas.',
    credentials: 'WAEC / NECO Senior School Certificate (5 credits including English & Math), Cambridge A-Levels.',
    nationalities: 'Nigerian citizens, ECOWAS nationals, and international candidates.',
    status: 'verified',
  },
  Kenya: {
    authority: 'Commission for University Education (CUE)',
    portal: 'https://www.cue.or.ke',
    policy: 'East African Community common education area. Direct international intake via institutional admissions boards.',
    credentials: 'KCSE Mean Grade C+ or equivalent (WASSCE, Cambridge A-Levels, IB Diploma).',
    nationalities: 'Open to Kenyan citizens, East African Community (EAC) members, and international students.',
    status: 'verified',
  },
  'South Africa': {
    authority: 'Council on Higher Education (CHE) & South African Qualifications Authority (SAQA)',
    portal: 'https://www.che.ac.za',
    policy: 'Public research universities with SAQA foreign qualification matriculation exemption requirement.',
    credentials: 'SAQA evaluation of WASSCE / Cambridge A-Levels / IB with Matriculation Board endorsement.',
    nationalities: 'SADC member states, African Union citizens, and international applicants.',
    status: 'verified',
  },
  France: {
    authority: 'Campus France & Ministère de l\'Enseignement Supérieur et de la Recherche',
    portal: 'https://www.campusfrance.org',
    policy: 'EEF (Études en France) procedure. Moderate tuition fees with Eiffel Excellence and institutional scholarships.',
    credentials: 'French Baccalauréat equivalent: IB, Cambridge A-Levels, high school completion with university entrance certificate.',
    nationalities: 'All international students worldwide; specific mobility frameworks for Francophone and African nations.',
    status: 'verified',
  },
  Japan: {
    authority: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    portal: 'https://www.mext.go.jp',
    policy: 'Global 30 initiatives with English-medium degree offerings. MEXT Government Scholarships provide full funding.',
    credentials: '12 years of completed formal education: High School Diploma, WASSCE, IB, A-Levels.',
    nationalities: 'Open to all international citizens from countries with diplomatic relations with Japan.',
    status: 'verified',
  },
  'South Korea': {
    authority: 'National Institute for International Education (NIIED) & Ministry of Education',
    portal: 'https://www.studyinkorea.go.kr',
    policy: 'Study in Korea framework with Global Korea Scholarship (GKS) full coverage awards.',
    credentials: 'High School Diploma (12 years of schooling), IB, Cambridge A-Levels, national graduation certificate.',
    nationalities: 'Citizens of designated GKS partner nations across Africa, Asia, Europe, and Americas.',
    status: 'verified',
  },
  Netherlands: {
    authority: 'Nuffic (Dutch Organisation for Internationalisation in Education)',
    portal: 'https://www.studyinnl.org',
    policy: 'High concentration of English-taught programs. Student residence permit coordinated through admitting university.',
    credentials: 'VWO equivalent: Cambridge A-Levels (3 subjects), IB Diploma, or 1 year university study post-high school.',
    nationalities: 'Open to non-EU/EEA international students worldwide with institutional tuition waiver programs.',
    status: 'verified',
  },
  Switzerland: {
    authority: 'Swissuniversities & State Secretariat for Education, Research and Innovation (SERI)',
    portal: 'https://www.swissuniversities.ch',
    policy: 'World-renowned federal institutes of technology with high academic selectivity and modest tuition.',
    credentials: 'Maturité equivalent: IB Diploma with specific HL subjects, Cambridge A-Levels, or entrance examination.',
    nationalities: 'All nationalities worldwide eligible for admissions and excellence fellowships.',
    status: 'verified',
  },
  Sweden: {
    authority: 'Swedish Higher Education Authority (UKÄ) & Study in Sweden',
    portal: 'https://studyinsweden.se',
    policy: 'Centralized universityadmissions.se platform. Swedish Institute scholarships for global professionals.',
    credentials: 'General entry requirement + specific subject mathematics/English level 6 equivalents.',
    nationalities: 'Open worldwide; specific Swedish Institute awards targeted to select emerging economies.',
    status: 'verified',
  },
  Singapore: {
    authority: 'Ministry of Education (MOE) Singapore',
    portal: 'https://www.moe.gov.sg',
    policy: 'Autonomous national universities offering MOE Tuition Grant scheme for international students in exchange for a 3-year service bond.',
    credentials: 'Singapore-Cambridge A-Levels equivalent: Cambridge A-Levels, IB Diploma (38+), High School Diploma with APs, or WASSCE with university foundation.',
    nationalities: 'Open to all international students worldwide meeting merit admissions criteria.',
    status: 'verified',
  },
  China: {
    authority: 'Ministry of Education of the PRC & China Scholarship Council (CSC)',
    portal: 'http://en.moe.gov.cn',
    policy: 'Chinese Government Scholarship (CSC) and Belt and Road bilateral scholarships supporting full tuition, living stipend, and accommodation.',
    credentials: 'High School graduation diploma or Bachelor’s degree transcript with English or Chinese certified translations.',
    nationalities: 'Open to non-Chinese international citizens from bilateral partner countries across Africa, Asia, Europe, and the Americas.',
    status: 'verified',
  },
  'United Arab Emirates': {
    authority: 'Commission for Academic Accreditation (CAA) & Ministry of Education',
    portal: 'https://www.caa.ae',
    policy: 'Global branch campuses and federal institutions offering merit scholarships and need-based financial aid for international cohorts.',
    credentials: 'High School completion certificate equivalent to UAE Thanaweya Amma (IB, A-Levels, US High School Diploma).',
    nationalities: 'Open to all international citizens worldwide regardless of citizenship.',
    status: 'verified',
  },
  Qatar: {
    authority: 'Ministry of Education and Higher Education & Qatar Foundation',
    portal: 'https://www.edu.gov.qa',
    policy: 'Education City partner universities providing Qatar Foundation need-based zero-interest loans and merit fellowships.',
    credentials: 'Secondary school completion (IB Diploma, Cambridge A-Levels, American High School Diploma).',
    nationalities: 'International students accepted globally across Education City member universities.',
    status: 'verified',
  },
  Ireland: {
    authority: 'Higher Education Authority (HEA) & Quality and Qualifications Ireland (QQI)',
    portal: 'https://hea.ie',
    policy: 'Government of Ireland International Education Scholarships (GOI-IES) and institutional merit waivers.',
    credentials: 'Irish Leaving Certificate equivalent: Cambridge A-Levels, IB Diploma, or European Baccalaureate.',
    nationalities: 'Open to all non-EU/EEA international candidates worldwide.',
    status: 'verified',
  },
  Italy: {
    authority: 'Ministry of University and Research (MUR) & Uni-Italia',
    portal: 'https://www.universitaly.it',
    policy: 'Universitaly pre-enrolment platform. Regional DSU need-based scholarships cover tuition, housing, and meals.',
    credentials: 'Minimum 12 years of formal education: High School Diploma + Declaration of Value (DOV) or CIMEA Statement of Comparability.',
    nationalities: 'Open to all international applicants worldwide; regional DSU aid calculated on parental ISEE parity.',
    status: 'verified',
  },
  Spain: {
    authority: 'Ministry of Science, Innovation and Universities & SEPIE',
    portal: 'http://sepie.es',
    policy: 'UNEDasiss foreign credential accreditation with low public tuition rates and regional grants.',
    credentials: 'Bachillerato homologation: IB Diploma, European Baccalaureate, or UNEDasiss-evaluated national certificates.',
    nationalities: 'All international applicants eligible; specific cooperation agreements with Latin American and African partners.',
    status: 'verified',
  },
  Belgium: {
    authority: 'Flemish Ministry of Education and Training / Wallonia-Brussels Federation',
    portal: 'https://www.studyinbelgium.be',
    policy: 'High concentration of English-language Master programs with VLIR-UOS development cooperation scholarships.',
    credentials: 'Recognized secondary or university degree transcript evaluated under Flemish or French Community NARIC equivalency.',
    nationalities: 'Worldwide candidates eligible; VLIR-UOS grants specifically designated for students from 29 developing nations.',
    status: 'verified',
  },
  Austria: {
    authority: 'Federal Ministry of Education, Science and Research (BMBWF) & OeAD',
    portal: 'https://oead.at',
    policy: 'Low public tuition fee structure (€726.72/semester for non-EU students). Ernst Mach and OeAD international mobility grants.',
    credentials: 'Reifeprüfung (Matura) equivalence: IB Diploma, Cambridge A-Levels, or recognized university entrance credential.',
    nationalities: 'All nationalities worldwide eligible for admissions and OeAD bilateral grants.',
    status: 'verified',
  },
  Norway: {
    authority: 'Directorate for Higher Education and Skills (HK-dir)',
    portal: 'https://hkdir.no',
    policy: 'GSU-list (Higher Education Entrance Qualification for Foreign Applicants) criteria for international admissions.',
    credentials: 'Country-specific requirements via HK-dir GSU-list (e.g. High school diploma + 1 year higher education for West Africa).',
    nationalities: 'Open to international applicants worldwide; quota schemes for developing nations managed under NORPART.',
    status: 'verified',
  },
  Finland: {
    authority: 'Finnish National Agency for Education (EDUFI) & Study in Finland',
    portal: 'https://www.studyinfinland.fi',
    policy: 'Joint Application system (Opintopolku). Finland Scholarship covers 100% first-year tuition plus €5,000 relocation stipend.',
    credentials: 'Ylioppilastutkinto equivalent: Upper secondary qualification giving access to higher education in awarding country.',
    nationalities: 'Open to all non-EU/EEA international students worldwide.',
    status: 'verified',
  },
  'New Zealand': {
    authority: 'New Zealand Qualifications Authority (NZQA) & Education New Zealand',
    portal: 'https://www.nzqa.govt.nz',
    policy: 'Fee-paying international student visa with Manaaki New Zealand Government Scholarships for specific developing partner nations.',
    credentials: 'New Zealand University Entrance (UE) standard: Cambridge International, IB Diploma, or Foundation Studies Certificate.',
    nationalities: 'Admissions open globally; Manaaki Scholarships reserved for eligible African, Pacific, Asian, and Latin American citizens.',
    status: 'verified',
  },
  Egypt: {
    authority: 'Ministry of Higher Education and Scientific Research (MOHESR)',
    portal: 'https://mohesr.gov.eg',
    policy: 'Study in Egypt initiative with Egyptian government scholarship quotas for African and Arab League students.',
    credentials: 'Thanaweya Amma equivalent: WASSCE, Cambridge IGCSE/A-Levels, American High School Diploma (SAT/ACT verified).',
    nationalities: 'Open to Egyptian citizens, African Union member nationals, Arab League citizens, and international candidates.',
    status: 'verified',
  },
  Morocco: {
    authority: 'Ministry of Higher Education, Scientific Research and Innovation',
    portal: 'https://www.enssup.gov.ma',
    policy: 'AMCI (Moroccan Agency for International Cooperation) scholarships supporting thousands of African students yearly.',
    credentials: 'Baccalauréat equivalent: WASSCE, French Bac, IB, or national secondary completion certificate.',
    nationalities: 'All nationalities welcome; priority AMCI full-ride quotas designated for African partner states.',
    status: 'verified',
  },
  Uganda: {
    authority: 'National Council for Higher Education (NCHE)',
    portal: 'https://unche.or.ug',
    policy: 'East African Community common educational integration with direct admissions for international candidates.',
    credentials: 'Uganda Advanced Certificate of Education (UACE) with at least 2 principal passes, WASSCE, Cambridge A-Levels, or IB.',
    nationalities: 'Open to Ugandan citizens, EAC regional candidates, and international applicants.',
    status: 'verified',
  },
  Senegal: {
    authority: 'Ministry of Higher Education, Research and Innovation (MESRI)',
    portal: 'https://mesri.sec.gouv.sn',
    policy: 'Regional Francophone hub in West Africa (UEMOA/ECOWAS) with open access for African students.',
    credentials: 'Baccalauréat sénégalais or equivalent recognized by CAMES (African and Malagasy Council for Higher Education).',
    nationalities: 'Open to Senegalese citizens, ECOWAS members, CAMES member countries, and international candidates.',
    status: 'verified',
  },
  India: {
    authority: 'University Grants Commission (UGC) & Study in India (EdCIL)',
    portal: 'https://www.studyinindia.gov.in',
    policy: 'Study in India program offering fee waivers up to 100% and ICCR (Indian Council for Cultural Relations) government scholarships.',
    credentials: '10+2 system equivalent: WASSCE, Cambridge A-Levels, IB Diploma, or recognized national senior secondary certificate.',
    nationalities: 'Admissions open worldwide; ICCR scholarships distributed through bilateral diplomatic quotas across 140+ countries.',
    status: 'verified',
  },
  'Hong Kong': {
    authority: 'Education Bureau (EDB) & University Grants Committee (UGC)',
    portal: 'https://www.ugc.edu.hk',
    policy: 'Hong Kong PhD Fellowship Scheme (HKPFS) and Belt and Road Scholarships providing full funding and living stipends.',
    credentials: 'HKDSE equivalent: Cambridge A-Levels (3 subjects), IB Diploma (32+), or international high school diploma with standardized tests.',
    nationalities: 'Open to non-local international students worldwide with non-local student quota at UGC-funded universities.',
    status: 'verified',
  },
  Mexico: {
    authority: 'Secretariat of Public Education (SEP) & AMEXCID',
    portal: 'https://www.gob.mx/sep',
    policy: 'AMEXCID Excellence Scholarships for Foreigners providing full tuition, medical insurance, and monthly living grants.',
    credentials: 'Bachillerato equivalent: Senior high school certificate evaluated by SEP or admitting university.',
    nationalities: 'Admissions open to all international candidates; AMEXCID scholarships awarded to citizens of 180+ partner nations.',
    status: 'verified',
  },
  Brazil: {
    authority: 'Ministry of Education (MEC) & CAPES',
    portal: 'https://www.gov.br/mec',
    policy: 'PEC-G and PEC-PG undergraduate and graduate cooperation agreements providing free tuition at Brazilian public and federal universities.',
    credentials: 'Ensino Médio completion equivalent: CELPE-Bras Portuguese language certificate and recognized high school diploma.',
    nationalities: 'Citizens of developing nations with cultural/educational cooperation agreements with Brazil (PEC-G partner countries in Africa, Latin America).',
    status: 'verified',
  },
  Turkey: {
    authority: 'Council of Higher Education (YÖK) & Presidency for Turks Abroad (YTB)',
    portal: 'https://www.turkiyeburslari.gov.tr',
    policy: 'Türkiye Scholarships (Türkiye Bursları) fully funded government program covering tuition, accommodation, health insurance, and monthly stipend.',
    credentials: 'High school diploma with minimum 70% GPA for undergraduate (75% for STEM/Health); Bachelor degree with 75% for Master/PhD.',
    nationalities: 'Open to citizens of all countries worldwide except Turkish citizens.',
    status: 'verified',
  },
  Chile: {
    authority: 'Ministry of Education (Mineduc) & National Accreditation Commission (CNA)',
    portal: 'https://www.cnachile.cl',
    policy: 'AGCID (Chilean Agency for International Development Cooperation) Nelson Mandela and South American international scholarships.',
    credentials: 'Licencia de Educación Media equivalent: Apostilled high school transcript and recognition certificate from Mineduc.',
    nationalities: 'Open to international applicants worldwide; AGCID scholarships prioritize Latin American, Caribbean, and African scholars.',
    status: 'verified',
  },
  Argentina: {
    authority: 'Secretariat of Education & CONEAU',
    portal: 'https://www.argentina.gob.ar/educacion',
    policy: 'Free undergraduate education at national public universities for all residents regardless of nationality under the Higher Education Law.',
    credentials: 'Convalidación de título secundario: Senior high school diploma convalidated by the Argentine Ministry of Education.',
    nationalities: 'Open to all international citizens worldwide under national equal access education laws.',
    status: 'verified',
  },
};

// Generate base country verification registry for all 202 countries worldwide
export const GLOBAL_COUNTRY_REGISTRY: CountryVerificationRecord[] = ALL_COUNTRIES.map((country: Country) => {
  const known = KNOWN_ACCREDITATION_BODIES[country.name];

  if (known) {
    return {
      countryName: country.name,
      countryCode: country.code,
      countryFlag: country.flag,
      nationality: country.nationality,
      status: known.status || 'in_review',
      verifiedInstitutionsCount: 0, // Hydrated dynamically based on opportunities dataset
      accreditationAuthority: known.authority,
      officialMinistryPortal: known.portal,
      internationalAdmissionsPolicy: known.policy,
      eligibleNationalitiesSummary: known.nationalities,
      foreignCredentialsAccepted: known.credentials,
      lastAudited: 'Official Ministry Reference',
      verificationNotes: 'Information verified via official ministry sources.',
    };
  }

  // Country cataloged in global directory with official ministry details or clean unavailable notice
  return {
    countryName: country.name,
    countryCode: country.code,
    countryFlag: country.flag,
    nationality: country.nationality,
    status: 'pending_verification',
    verifiedInstitutionsCount: 0,
    accreditationAuthority: `National Ministry of Higher Education of ${country.name}`,
    officialMinistryPortal: `https://en.wikipedia.org/wiki/List_of_universities_in_${encodeURIComponent(country.name)}`,
    internationalAdmissionsPolicy: 'Information currently unavailable',
    eligibleNationalitiesSummary: 'Information currently unavailable',
    foreignCredentialsAccepted: 'Information currently unavailable',
    lastAudited: 'Official Directory Reference',
    verificationNotes: 'Information currently unavailable',
  };
});

// Helper functions for the country registry
export function getCountryRegistryRecord(countryName: string): CountryVerificationRecord | undefined {
  if (!countryName) return undefined;
  const lower = countryName.trim().toLowerCase();
  return GLOBAL_COUNTRY_REGISTRY.find(
    (c) => c.countryName.toLowerCase() === lower || c.nationality.toLowerCase() === lower
  );
}

// Dynamically compute country records with verified institution counts from actual opportunities
export function getCountryRegistryWithCounts(opportunities: OpportunityItem[]): CountryVerificationRecord[] {
  // Count verified opportunities per country
  const countsByCountry: Record<string, number> = {};
  for (const opp of opportunities) {
    if (opp.isVerified && opp.country) {
      countsByCountry[opp.country] = (countsByCountry[opp.country] || 0) + 1;
    }
  }

  return GLOBAL_COUNTRY_REGISTRY.map((record) => {
    const verifiedCount = countsByCountry[record.countryName] || 0;
    const known = KNOWN_ACCREDITATION_BODIES[record.countryName];

    let computedStatus: VerificationStatus = record.status;
    let notes = record.verificationNotes;

    if (verifiedCount > 0) {
      computedStatus = 'verified';
      notes = `${verifiedCount} accredited institution(s) with official admissions criteria published.`;
    } else if (known) {
      computedStatus = 'in_review';
      notes = `National higher education ministry and accreditation authority documented.`;
    } else {
      computedStatus = 'pending_verification';
      notes = 'Information currently unavailable';
    }

    return {
      ...record,
      status: computedStatus,
      verifiedInstitutionsCount: verifiedCount,
      verificationNotes: notes,
    };
  });
}

export function getRegistryStats(opportunities?: OpportunityItem[]) {
  const records = opportunities ? getCountryRegistryWithCounts(opportunities) : GLOBAL_COUNTRY_REGISTRY;
  const total = records.length;
  const verified = records.filter((c) => c.status === 'verified').length;
  const inReview = records.filter((c) => c.status === 'in_review').length;
  const pending = records.filter((c) => c.status === 'pending_verification').length;

  return {
    total,
    verified,
    inReview,
    pending,
  };
}
