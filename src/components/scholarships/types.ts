/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Scholarship {
  id: string;
  country: string;
  studyLevel: string;
  category: string;
  title: string;
  description: string;
  fundingLabel: string;
  statusLabel?: string;
  officialSourceUrl?: string;
}

export const sampleScholarship: Scholarship = {
  id: 'ashesi-mcf-scholars',
  country: 'Ghana 🇬🇭',
  studyLevel: 'Undergraduate',
  category: 'Computer Science & Engineering',
  title: 'Ashesi University — Mastercard Foundation Scholars Program',
  description: 'Comprehensive full-ride funding for ambitious African students demonstrating leadership potential and financial need.',
  fundingLabel: '100% Comprehensive Coverage (Tuition, Housing, Stipend, Laptop)',
  statusLabel: 'VERIFIED OFFICIAL UNIVERSITY PROGRAM',
  officialSourceUrl: 'https://www.ashesi.edu.gh/admissions/',
};

export const sampleScholarship2: Scholarship = {
  id: 'utoronto-pearson-scholarship',
  country: 'Canada 🇨🇦',
  studyLevel: 'Undergraduate',
  category: 'STEM & Liberal Arts',
  title: 'University of Toronto — Lester B. Pearson International Scholarship',
  description: 'Recognizing international scholars who demonstrate exceptional academic achievement and creative leadership.',
  fundingLabel: 'Full 4-Year Tuition, Books, Incidental Fees & Full Residence Support',
  statusLabel: 'VERIFIED OFFICIAL UNIVERSITY PROGRAM',
  officialSourceUrl: 'https://future.utoronto.ca/pearson/',
};

export interface ScholarshipOpportunity {
  id: string;
  title: string;
  destinationCountry: string;
  studyLevel: string;
  fieldOfStudy: string;
  fundingCoverage: string;
  deadlineNotice: string;
  eligibilitySummary: string;
  academicRequirements?: string[];
  documentChecklist?: string[];
  isSampleData: boolean;
  officialWebsite?: string;
  sourceUrl?: string;
}

export const sampleScholarships: ScholarshipOpportunity[] = [
  {
    id: 'ashesi-ug-engineering',
    title: 'Ashesi University Mastercard Foundation Scholars',
    destinationCountry: 'Ghana',
    studyLevel: 'Undergraduate Degree',
    fieldOfStudy: 'Computer Science, Electrical & Mechanical Engineering',
    fundingCoverage: '100% comprehensive coverage: tuition, campus housing, meals, laptop, and monthly stipend',
    deadlineNotice: 'Official deadline: June 25, 2026',
    eligibilitySummary: 'Open to Ghanaian citizens and Sub-Saharan African students with proven leadership and financial need.',
    academicRequirements: [
      'WASSCE passes in 6 subjects (3 core: English, Math, Integrated Science/Social Studies + 3 electives) with credit grades A1-C6',
      'High academic standing in advanced mathematics and science',
      'Demonstrated commitment to ethical leadership in Africa',
    ],
    documentChecklist: [
      'Official WASSCE / SSSCE Statement of Results',
      'High School Transcripts',
      'Personal statement on community leadership',
      'One academic reference',
    ],
    isSampleData: false,
    officialWebsite: 'https://www.ashesi.edu.gh',
    sourceUrl: 'https://www.ashesi.edu.gh/admissions/',
  },
  {
    id: 'utoronto-pearson',
    title: 'Lester B. Pearson International Scholarship',
    destinationCountry: 'Canada',
    studyLevel: 'Undergraduate Degree',
    fieldOfStudy: 'Engineering, Computer Science, Commerce, Life Sciences',
    fundingCoverage: 'Full 4-year tuition, books, incidental fees, and full on-campus residence support',
    deadlineNotice: 'School nomination deadline: November 30, 2026',
    eligibilitySummary: 'Intended for graduating international students nominated by their high school for exceptional academic and creative impact.',
    academicRequirements: [
      'High school senior with top 5% academic standing in graduating class',
      'Secondary school official nomination',
      'English proficiency or 4 years verified secondary instruction in English',
    ],
    documentChecklist: [
      'Official Secondary School Nomination Form',
      'University of Toronto International Application',
      'Pearson Scholarship Essay',
      'Two Referee Letters',
    ],
    isSampleData: false,
    officialWebsite: 'https://www.utoronto.ca',
    sourceUrl: 'https://future.utoronto.ca/pearson/',
  },
  {
    id: 'oxford-rhodes-west-africa',
    title: 'Rhodes Scholarship for West & Southern Africa',
    destinationCountry: 'United Kingdom',
    studyLevel: "Master's & Doctoral (Postgraduate)",
    fieldOfStudy: 'Public Policy, Data Science, Law, Global Health, Engineering',
    fundingCoverage: '100% university and college fees paid plus £18,180 annual living stipend, flights, and healthcare surcharge',
    deadlineNotice: 'Official annual deadline: August 1, 2026',
    eligibilitySummary: 'Open to citizens of West African nations (including Ghana and Nigeria) demonstrating academic excellence and moral leadership.',
    academicRequirements: [
      'First Class Honours degree or minimum undergraduate GPA of 3.7+ out of 4.0',
      'Demonstrated energy to use talents to the full and moral force of character',
      'Instincts to lead and interest in public good',
    ],
    documentChecklist: [
      'Official University Academic Transcript',
      'Personal Statement (maximum 1,000 words)',
      'Academic CV',
      'Four to six letters of recommendation',
      'Proof of citizenship in eligible constituency',
    ],
    isSampleData: false,
    officialWebsite: 'https://www.ox.ac.uk',
    sourceUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
  },
];
