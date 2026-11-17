/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Headphones,
  Layers,
  PenLine,
  Rocket,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import type { DashboardNavTab } from './DashboardSidebar';

export type ResourceCategoryId =
  | 'application-guides'
  | 'templates'
  | 'test-preparation'
  | 'study-career';

export type ResourceFormatLabel = 'Guide' | 'Template' | 'Study Plan' | 'Reference';

interface OfficialResourceLink {
  label: string;
  url: string;
  note?: string;
}

export interface AcademicResourceItem {
  id: string;
  title: string;
  category: ResourceCategoryId;
  formatLabel: ResourceFormatLabel;
  summary: string;
  keywords: string[];
  featured: boolean;
  thumbnailVariant:
    | 'sop'
    | 'resume'
    | 'visa'
    | 'ielts'
    | 'wassce'
    | 'fee-waiver'
    | 'english-waiver'
    | 'sat-toefl'
    | 'career';
  sections: {
    heading: string;
    bullets: string[];
  }[];
  copyableTemplate?: {
    title: string;
    content: string;
  };
  officialLinks?: OfficialResourceLink[];
}

const RESOURCE_CATEGORIES: {
  id: ResourceCategoryId;
  title: string;
  subtitle: string;
  cardBg: string;
  cardHoverBg: string;
  cardBorder: string;
  iconColor: string;
  iconBg: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'application-guides',
    title: 'Application Guides',
    subtitle: 'Step-by-step support',
    cardBg: 'bg-[#F4F0FF]',
    cardHoverBg: 'hover:bg-[#ECE5FF]',
    cardBorder: 'border-[#E6DCFF]',
    iconColor: 'text-[#6846F5]',
    iconBg: 'bg-white/80',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'templates',
    title: 'Templates',
    subtitle: 'Editable documents',
    cardBg: 'bg-[#FFF7E6]',
    cardHoverBg: 'hover:bg-[#FFEFD0]',
    cardBorder: 'border-[#FCE5B8]',
    iconColor: 'text-[#D99B16]',
    iconBg: 'bg-white/80',
    icon: <Layers className="w-6 h-6" />,
  },
  {
    id: 'test-preparation',
    title: 'Test Preparation',
    subtitle: 'IELTS, TOEFL, SAT & more',
    cardBg: 'bg-[#EAF4FF]',
    cardHoverBg: 'hover:bg-[#DCEEFF]',
    cardBorder: 'border-[#CFE4FF]',
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-white/80',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'study-career',
    title: 'Study & Career',
    subtitle: 'Tips for academic and career success',
    cardBg: 'bg-[#FDF0F6]',
    cardHoverBg: 'hover:bg-[#FBE2EE]',
    cardBorder: 'border-[#F7D1E4]',
    iconColor: 'text-[#EC4899]',
    iconBg: 'bg-white/80',
    icon: <Briefcase className="w-6 h-6" />,
  },
];

const ACADEMIC_RESOURCES: AcademicResourceItem[] = [
  {
    id: 'sop-guide',
    title: 'Statement of Purpose (SOP) Guide',
    category: 'application-guides',
    formatLabel: 'Guide',
    summary:
      'A clear 5-paragraph blueprint for explaining your academic journey, research fit, and long-term career impact.',
    keywords: ['sop', 'statement of purpose', 'essay', 'admissions', 'motivation letter', 'graduate'],
    featured: true,
    thumbnailVariant: 'sop',
    sections: [
      {
        heading: 'Recommended 5-Paragraph Structure (750–1,000 words)',
        bullets: [
          'Hook & Academic Motivation: Start with a concrete moment, project, or problem that sparked your passion for the field.',
          'Academic & Research Foundation: Highlight relevant coursework, capstone projects, lab experience, or honours — show evidence rather than adjectives.',
          'Practical / Leadership Experience: Connect internships, teaching, community impact, or work roles to the analytical skills needed for this degree.',
          'Why This Specific University & Program: Name 2–3 exact courses, labs, faculty members, or regional centres and explain how you will contribute.',
          'Post-Graduation Goals: Close with measurable short-term (1–3 years) and long-term goals and why this degree bridges the gap.',
        ],
      },
      {
        heading: 'Reviewer Checklist Before Submitting',
        bullets: [
          'Tailor the university name and faculty paragraph separately for every single application.',
          'Keep formatting crisp (11–12 pt clean serif/sans font, 1.15 spacing, clear file name).',
          'Avoid repeating line-by-line what already appears in your CV; use the SOP to explain "why" and "how".',
        ],
      },
    ],
    officialLinks: [
      {
        label: 'EducationUSA: Writing Admissions Essays',
        url: 'https://educationusa.state.gov/',
        note: 'Official U.S. Department of State advising network',
      },
      {
        label: 'UCAS Personal Statement Guidance (UK)',
        url: 'https://www.ucas.com/applying/applying-to-university/writing-your-personal-statement',
        note: 'Official UK university admissions guidance',
      },
    ],
  },
  {
    id: 'resume-cv-template',
    title: 'Resume/CV Template',
    category: 'templates',
    formatLabel: 'Template',
    summary:
      'An admissions-ready single-page academic CV format with reverse-chronological layout and action-oriented bullet starters.',
    keywords: ['resume', 'cv', 'template', 'curriculum vitae', 'editable', 'admissions'],
    featured: true,
    thumbnailVariant: 'resume',
    sections: [
      {
        heading: 'Formatting Rules Admissions Teams Prefer',
        bullets: [
          'Use clean ATS-friendly text without multi-column tables, decorative bars, or headshots (unless specifically requested in Europe/Asia).',
          'Start every achievement bullet with a strong action verb + measurable outcome (e.g., "Designed...", "Led a 6-member team...", "Analyzed 1,200 records...").',
          'Keep undergraduate & early-career applications to 1 page; graduate research CVs may run 2 pages if publishing/research warrants it.',
        ],
      },
    ],
    copyableTemplate: {
      title: 'Copyable Academic Resume / CV Structure',
      content: `[FULL NAME]
[City, Country] | [Professional Email] | [Phone Number] | [LinkedIn / Portfolio URL]

EDUCATION
[University or Secondary School Name] — [City, Country]
[Degree / Program Title, e.g., BSc Computer Science or WASSCE] | [Month Year – Expected/Completed Month Year]
• GPA / Standing: [e.g., 3.82/4.00 or First Class Honours / 6 As WASSCE]
• Relevant Coursework: [Course 1], [Course 2], [Course 3], [Course 4]
• Academic Honours: [Dean's List / National Olympiad / Merit Scholarship]

RESEARCH & ACADEMIC PROJECTS
[Project Title] — [Role, e.g., Lead Researcher / Capstone Author] | [Month Year – Month Year]
• Investigated [problem/topic] using [methods/tools], achieving [quantifiable result].
• Presented findings to [audience/faculty panel] and documented reproducible methodology.

EXPERIENCE & LEADERSHIP
[Organization / Society Name] — [Role Title] | [City, Country] | [Month Year – Month Year]
• Led [initiative or workflow] serving [number] peers/community members, improving [metric] by [%].
• Collaborated across [teams] to deliver [specific output] ahead of deadline.

SKILLS, LANGUAGES & CERTIFICATIONS
• Technical & Analytical: [e.g., Python, R, Excel, GIS, Academic Writing]
• Languages: [e.g., English (Fluent), French (Intermediate), Twi (Native)]
• Certifications: [e.g., Coursera Data Analytics Certificate, First Aid]`,
    },
  },
  {
    id: 'student-visa-guide',
    title: 'Student Visa Guide',
    category: 'application-guides',
    formatLabel: 'Guide',
    summary:
      'Essential document checklists, financial proof requirements, and official government visa portals for major study destinations.',
    keywords: ['visa', 'immigration', 'f1', 'study permit', 'cas', 'passport', 'embassy'],
    featured: true,
    thumbnailVariant: 'visa',
    sections: [
      {
        heading: 'Universal Documents to Prepare Early',
        bullets: [
          'Valid international passport (ensure at least 6–12 months validity beyond your planned arrival date).',
          'Official admission package: US I-20, UK CAS number, Canadian LOA + PAL (if applicable), or German blocked-account confirmation.',
          'Verifiable financial proof: Scholarship award letters, official bank statements, or approved education loan letters.',
          'English test certificate & certified original academic transcripts/WASSCE certificates.',
        ],
      },
      {
        heading: 'Timing & Interview Principles',
        bullets: [
          'Check current embassy wait times right after accepting your admission offer — visa slots can fill 2–4 months before September/January intakes.',
          'Answer visa officer questions truthfully, concisely, and connect your chosen degree to concrete career opportunities after graduation.',
        ],
      },
    ],
    officialLinks: [
      {
        label: 'USA: F-1 Student Visa (Travel.State.Gov)',
        url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
      },
      {
        label: 'UK: GOV.UK Student Visa Requirements',
        url: 'https://www.gov.uk/student-visa',
      },
      {
        label: 'Canada: IRCC Study Permit Portal',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
      },
      {
        label: 'Germany: Federal Foreign Office & DAAD Visa Guide',
        url: 'https://www.daad.de/en/studying-in-germany/living-in-germany/visa/',
      },
    ],
  },
  {
    id: 'ielts-prep-plan',
    title: 'IELTS Preparation Plan',
    category: 'test-preparation',
    formatLabel: 'Study Plan',
    summary:
      'A structured 4-week study plan across Listening, Reading, Writing, and Speaking using free official IELTS resources.',
    keywords: ['ielts', 'test prep', 'english', 'band score', 'listening', 'reading', 'writing', 'speaking'],
    featured: true,
    thumbnailVariant: 'ielts',
    sections: [
      {
        heading: '4-Week Study Schedule',
        bullets: [
          'Week 1 — Diagnostic & Format Mastery: Take one timed official sample test to benchmark your score across all four modules.',
          'Week 2 — Listening & Reading Speed: Drill Academic Reading (True/False/Not Given, matching headings) and note-taking during recordings.',
          'Week 3 — Writing Task 1 & Task 2: Practice describing charts/trends (150 words) in 20 mins and structured essays (250+ words) in 40 mins.',
          'Week 4 — Speaking Fluency & Full Mocks: Record 2-minute Part 2 cue-card answers daily and complete two full timed mock exams.',
        ],
      },
    ],
    officialLinks: [
      {
        label: 'Official IELTS Free Preparation Materials',
        url: 'https://ielts.org/take-a-test/preparation-materials',
        note: 'Official sample questions and practice sheets',
      },
      {
        label: 'British Council: Free IELTS Prep Resources',
        url: 'https://takeielts.britishcouncil.org/take-ielts/prepare',
        note: 'Practice tests and skill workshops',
      },
    ],
  },
  {
    id: 'wassce-equivalency',
    title: 'WASSCE to US/UK Equivalency',
    category: 'application-guides',
    formatLabel: 'Reference',
    summary:
      'Official guidance on submitting WASSCE A1–C6 grades and West African credentials to North American, UK, and European universities.',
    keywords: ['wassce', 'waec', 'ghana', 'nigeria', 'transcript', 'equivalency', 'wes', 'a1', 'c6'],
    featured: false,
    thumbnailVariant: 'wassce',
    sections: [
      {
        heading: 'How Universities Evaluate WASSCE Results',
        bullets: [
          'Most US, Canadian, and UK admissions offices recognize WASSCE A1–C6 credits directly for first-year entry or foundation pathways.',
          'Always verify whether the target institution accepts direct scratch-card/PIN verification via WAEC or requires a NACES/WES credential evaluation.',
          'Submit official school-certified transcripts for Senior High School Years 1–3 alongside your final WASSCE statement of results.',
        ],
      },
    ],
    officialLinks: [
      {
        label: 'World Education Services (WES) Required Documents',
        url: 'https://www.wes.org/required-documents/',
        note: 'Check official transcript & WAEC verification instructions',
      },
      {
        label: 'UK ENIC (International Qualifications Overview)',
        url: 'https://www.enic.org.uk/',
        note: 'Official UK national agency for international qualification comparability',
      },
    ],
  },
  {
    id: 'fee-waiver-letter',
    title: 'Application Fee Waiver Letter',
    category: 'templates',
    formatLabel: 'Template',
    summary:
      'Polite, formal email template to request an institutional or financial-need application fee waiver directly from admissions offices.',
    keywords: ['fee waiver', 'application fee', 'template', 'letter', 'email', 'financial need', 'free'],
    featured: false,
    thumbnailVariant: 'fee-waiver',
    sections: [
      {
        heading: 'When & How to Request a Waiver',
        bullets: [
          'Check the university admissions FAQ first — many institutions grant automatic waivers when you attend a virtual info session or apply through designated portals.',
          'Send your request at least 2–3 weeks before the application deadline so admissions staff have time to issue a waiver code.',
        ],
      },
    ],
    copyableTemplate: {
      title: 'Copyable Fee Waiver Request Email',
      content: `Subject: Application Fee Waiver Request — [Your Full Name] ([Intended Program / Term])

Dear [Admissions Office / Program Coordinator Name],

I hope this email finds you well. My name is [Your Full Name], and I am writing from [City, Country] to express my strong interest in applying to the [Program Name, e.g., BSc in Data Science / MSc in Public Health] for the [Fall 2027] intake.

Having thoroughly researched your curriculum and [specific faculty/program highlight], I am eager to submit a complete application. However, the [currency & fee amount] application fee currently presents a significant financial barrier for me and my family due to exchange-rate constraints and limited household income.

I would be sincerely grateful if the admissions committee could consider granting an application fee waiver—or share any virtual information sessions or partner fee-waiver codes I may be eligible for. I am happy to provide my unofficial transcripts or supporting academic documents upon request.

Thank you very much for your time, consideration, and support for international applicants.

Warm regards,
[Your Full Name]
[Phone Number]
[Applicant Portal ID, if already started]`,
    },
  },
  {
    id: 'english-proficiency-waivers',
    title: 'English Proficiency Waivers',
    category: 'application-guides',
    formatLabel: 'Reference',
    summary:
      'How students educated in English-speaking nations can qualify for IELTS/TOEFL exemptions using Medium of Instruction or WASSCE English.',
    keywords: ['english waiver', 'ielts waiver', 'toefl waiver', 'moi', 'medium of instruction', 'wassce english'],
    featured: false,
    thumbnailVariant: 'english-waiver',
    sections: [
      {
        heading: 'Common Ways to Qualify for an Exemption',
        bullets: [
          'Medium of Instruction (MOI) Letter: Obtain an official signed letter on university/school letterhead confirming that all instruction and examinations were conducted exclusively in English.',
          'WASSCE / O-Level English Credit: Many UK, Irish, and select North American institutions waive IELTS when applicants hold WASSCE English Language grades A1–C6.',
          'National Exemptions: Check each admissions English-language policy page directly before paying for an external language test.',
        ],
      },
    ],
  },
  {
    id: 'sat-toefl-study-guide',
    title: 'SAT & TOEFL iBT Prep Checklist',
    category: 'test-preparation',
    formatLabel: 'Study Plan',
    summary:
      'High-yield test-day strategies, official Digital SAT practice links, and score-reporting timelines for university scholarships.',
    keywords: ['sat', 'toefl', 'digital sat', 'college board', 'ets', 'score', 'test optional'],
    featured: false,
    thumbnailVariant: 'sat-toefl',
    sections: [
      {
        heading: 'Smart Testing Strategy',
        bullets: [
          'Verify first whether your target universities are Test-Optional or Test-Required — focus test prep only where scores strengthen admissions or merit scholarship eligibility.',
          'Use the official Bluebook™ app alongside Khan Academy for adaptive Digital SAT practice tests.',
          'Budget 4–6 weeks before priority scholarship deadlines so official scores arrive on time.',
        ],
      },
    ],
    officialLinks: [
      {
        label: 'College Board: Official Digital SAT Practice',
        url: 'https://satsuite.collegeboard.org/sat/practice-preparation',
      },
      {
        label: 'ETS: Official TOEFL iBT Test Prep',
        url: 'https://www.ets.org/toefl/test-takers/ibt/prepare.html',
      },
    ],
  },
  {
    id: 'scholarship-interview-career',
    title: 'Scholarship Essay & Interview Strategy',
    category: 'study-career',
    formatLabel: 'Guide',
    summary:
      'Master leadership essays, community-impact storytelling, and live scholarship panel interviews using the STAR method.',
    keywords: ['scholarship', 'interview', 'career', 'leadership', 'star method', 'chevening', 'mastercard'],
    featured: false,
    thumbnailVariant: 'career',
    sections: [
      {
        heading: 'Answering Behavioral & Leadership Prompts',
        bullets: [
          'Structure stories with STAR: Situation (15%), Task (15%), Action (50% — focus on what YOU did), and Result (20% — measurable impact + lesson learned).',
          'Tie your academic plan directly to concrete societal, technical, or institutional challenges in your community or region.',
          'Prepare 2–3 thoughtful questions for your interviewers about mentorship, research communities, or alumni impact.',
        ],
      },
    ],
  },
];

const SCHOLARSHIP_ESSAY_PROMPTS = [
  {
    program: 'Global Merit & Need-Based Scholarships',
    prompt:
      'Describe a problem in your school or local community that you took initiative to address. What did you learn about leadership and collaboration?',
    outline: [
      'Paragraph 1: Define the specific community challenge concisely with real context.',
      'Paragraph 2: Detail the exact steps you initiated, obstacles you navigated, and peers you mobilized.',
      'Paragraph 3: Share tangible outcomes and how this mindset shapes your future university contributions.',
    ],
  },
  {
    program: 'Graduate & Postgraduate Fellowships (e.g., Chevening / Commonwealth / Mastercard)',
    prompt:
      'Outline your career plan upon completing this degree. How does your chosen university specialization accelerate measurable impact in your home country or region?',
    outline: [
      'Paragraph 1: State your immediate 1–2 year career role and target sector post-graduation.',
      'Paragraph 2: Connect 2–3 technical skills or courses from the program to that sector’s current gap.',
      'Paragraph 3: Articulate your 5–10 year institutional or community impact vision.',
    ],
  },
  {
    program: 'Personal Resilience & Academic Curiosity',
    prompt:
      'Reflect on a setback, resource limitation, or academic challenge you overcame, and explain how it prepared you to thrive in an international classroom.',
    outline: [
      'Paragraph 1: Introduce the turning point honestly without over-dramatizing.',
      'Paragraph 2: Emphasize resourcefulness, disciplined habits, or mentorship sought.',
      'Paragraph 3: Highlight the transferable strength you bring to a diverse university cohort.',
    ],
  },
];

/* Crisp bespoke artwork for the Study Resources Hub banner */
const StudyDeskBannerArtwork: React.FC = () => (
  <svg
    viewBox="0 0 380 175"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="w-full h-full max-w-[360px] select-none pointer-events-none"
  >
    <defs>
      <radialGradient id="bannerDeskGlow" cx="55%" cy="42%" r="55%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.48" />
        <stop offset="65%" stopColor="#6D28D9" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#240C64" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="laptopScreenGrad" x1="175" y1="26" x2="295" y2="115" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4338CA" />
        <stop offset="55%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>
      <linearGradient id="laptopBaseGrad" x1="145" y1="120" x2="295" y2="148" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="deskSurfaceGrad" x1="0" y1="132" x2="380" y2="175" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B21B6" stopOpacity="0.35" />
        <stop offset="50%" stopColor="#9D75C9" stopOpacity="0.48" />
        <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="bookTopCover" x1="25" y1="90" x2="128" y2="108" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="bookBottomCover" x1="18" y1="110" x2="132" y2="132" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9A8D4" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
    </defs>

    {/* Warm Desk Ambient Glow */}
    <ellipse cx="220" cy="78" rx="145" ry="72" fill="url(#bannerDeskGlow)" />

    {/* Soft background potted plant silhouette on far right */}
    <g opacity="0.78">
      <path d="M322 46C312 28 318 10 330 2C338 15 335 34 328 48" fill="#65A30D" />
      <path d="M334 50C336 28 352 14 366 10C362 28 349 42 338 52" fill="#84CC16" />
      <path d="M316 54C298 40 294 22 300 12C314 22 320 38 322 54" fill="#4D7C0F" />
      <path d="M314 50H350L344 86H320L314 50Z" fill="#B45309" opacity="0.65" />
    </g>

    {/* Illuminated Desk Surface */}
    <path d="M0 130C95 123 265 123 380 130V175H0V130Z" fill="url(#deskSurfaceGrad)" />

    {/* Stacked Hardcover Books (Left) */}
    <g>
      {/* Bottom rose book */}
      <rect x="18" y="114" width="110" height="22" rx="4" fill="url(#bookBottomCover)" />
      <rect x="24" y="120" width="98" height="10" rx="2" fill="#FDF2F8" opacity="0.92" />
      {/* Top violet book */}
      <rect x="26" y="92" width="100" height="22" rx="4" fill="url(#bookTopCover)" />
      <rect x="32" y="98" width="88" height="10" rx="2" fill="#F5F3FF" opacity="0.92" />
      <rect x="26" y="92" width="14" height="22" rx="3" fill="#4C1D95" />
      {/* Desk shadow under books */}
      <ellipse cx="74" cy="138" rx="60" ry="4" fill="#1E084E" opacity="0.4" />
    </g>

    {/* Bronze Pencil Cup & Stationery */}
    <g>
      {/* Pencils & highlighters sticking up */}
      <rect x="139" y="42" width="5" height="45" rx="1.5" transform="rotate(-12 139 42)" fill="#FBBF24" />
      <polygon points="139,42 141.5,35 144,42" transform="rotate(-12 139 42)" fill="#FDE68A" />
      <rect x="150" y="38" width="5" height="48" rx="1.5" transform="rotate(4 150 38)" fill="#60A5FA" />
      <rect x="160" y="45" width="5" height="42" rx="1.5" transform="rotate(14 160 45)" fill="#F472B6" />
      {/* Bronze holder cylinder */}
      <rect x="138" y="78" width="28" height="46" rx="4" fill="#92400E" />
      <rect x="142" y="80" width="8" height="42" rx="2" fill="#B45309" opacity="0.65" />
      <ellipse cx="152" cy="78" rx="14" ry="3.5" fill="#78350F" />
    </g>

    {/* Open Metallic Laptop */}
    <g>
      {/* Screen lid angled slightly */}
      <path
        d="M180 28C180 24.686 182.686 22 186 22H292C295.314 22 298 24.686 298 28L285 118H169L180 28Z"
        fill="#0F172A"
        stroke="#475569"
        strokeWidth="2"
      />
      <path
        d="M185 28H291L280 112H175L185 28Z"
        fill="url(#laptopScreenGrad)"
      />
      {/* Subtle UI lines inside laptop screen */}
      <rect x="192" y="40" width="46" height="6" rx="3" fill="#C4B5FD" opacity="0.8" />
      <rect x="190" y="53" width="74" height="4" rx="2" fill="#A78BFA" opacity="0.45" />
      <rect x="188" y="63" width="60" height="4" rx="2" fill="#A78BFA" opacity="0.35" />
      <rect x="186" y="76" width="80" height="24" rx="5" fill="#FFFFFF" opacity="0.09" />
      {/* Keyboard deck */}
      <path d="M168 118H285L265 138H132L168 118Z" fill="url(#laptopBaseGrad)" />
      <path d="M132 138H265V142C265 143.657 263.657 145 262 145H135C133.343 145 132 143.657 132 142V138Z" fill="#64748B" />
      <path d="M172 122H268L256 131H154L172 122Z" fill="#334155" opacity="0.7" />
      <ellipse cx="204" cy="147" rx="74" ry="4.5" fill="#1E084E" opacity="0.42" />
    </g>

    {/* Ceramic White Coffee Mug */}
    <g>
      <path
        d="M322 104C328 104 331 108 331 114C331 120 328 124 322 124"
        stroke="#F1F5F9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect x="292" y="96" width="32" height="40" rx="5" fill="#F8FAFC" />
      <rect x="312" y="96" width="12" height="40" rx="4" fill="#E2E8F0" opacity="0.7" />
      <ellipse cx="308" cy="96" rx="16" ry="3.5" fill="#E2E8F0" />
      <ellipse cx="308" cy="96" rx="12" ry="2.2" fill="#78350F" opacity="0.75" />
      <ellipse cx="308" cy="138" rx="18" ry="3.5" fill="#1E084E" opacity="0.36" />
    </g>
  </svg>
);

/* Crisp editorial card thumbnails matching each Popular Resource topic */
const ResourceThumbnail: React.FC<{ variant: AcademicResourceItem['thumbnailVariant'] }> = ({
  variant,
}) => {
  switch (variant) {
    case 'sop':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#F3E8D9] via-[#E8D5BC] to-[#D6BC9B] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="22" y="10" width="136" height="76" rx="8" fill="#FFFFFF" opacity="0.96" />
            <rect x="36" y="22" width="54" height="5" rx="2.5" fill="#6846F5" opacity="0.85" />
            <rect x="36" y="34" width="102" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="36" y="42" width="92" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="36" y="50" width="98" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="36" y="58" width="76" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="36" y="68" width="44" height="4" rx="2" fill="#E2E8F0" />
            {/* Fountain pen */}
            <g transform="translate(116 40) rotate(-32)">
              <rect x="0" y="0" width="40" height="7" rx="3" fill="#1E293B" />
              <polygon points="0,0 -9,3.5 0,7" fill="#F59E0B" />
            </g>
          </svg>
        </div>
      );
    case 'resume':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#DCEEFF] via-[#EAF4FF] to-[#CBE2FC] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="38" y="8" width="104" height="82" rx="6" fill="#FFFFFF" />
            <text
              x="90"
              y="24"
              textAnchor="middle"
              fill="#1E293B"
              fontSize="10"
              fontWeight="800"
              letterSpacing="1.2"
            >
              RÉSUMÉ
            </text>
            <rect x="52" y="31" width="76" height="2" rx="1" fill="#6846F5" opacity="0.45" />
            <rect x="52" y="39" width="32" height="4" rx="2" fill="#334155" opacity="0.7" />
            <rect x="52" y="47" width="74" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="52" y="53" width="66" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="52" y="63" width="38" height="4" rx="2" fill="#334155" opacity="0.7" />
            <rect x="52" y="71" width="72" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="52" y="77" width="54" height="3" rx="1.5" fill="#CBD5E1" />
          </svg>
        </div>
      );
    case 'visa':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#DBEAFE] via-[#E0E7FF] to-[#C7D2FE] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            {/* Visa sticker document */}
            <rect x="20" y="14" width="94" height="62" rx="6" fill="#FFFFFF" opacity="0.96" />
            <text x="34" y="36" fill="#1D4ED8" fontSize="14" fontWeight="900" letterSpacing="1.5">
              VISA
            </text>
            <rect x="34" y="44" width="52" height="3.5" rx="1.5" fill="#93C5FD" />
            <rect x="34" y="52" width="40" height="3.5" rx="1.5" fill="#CBD5E1" />
            <rect x="34" y="60" width="46" height="3.5" rx="1.5" fill="#CBD5E1" />
            {/* Passport book */}
            <g transform="translate(96 24) rotate(8)">
              <rect x="0" y="0" width="56" height="72" rx="6" fill="#7F1D1D" />
              <rect x="4" y="4" width="48" height="64" rx="4" fill="none" stroke="#FBBF24" strokeOpacity="0.45" strokeWidth="1" />
              <circle cx="28" cy="28" r="10" stroke="#FCD34D" strokeWidth="1.5" fill="none" />
              <text x="28" y="50" textAnchor="middle" fill="#FDE68A" fontSize="6.5" fontWeight="700" letterSpacing="0.8">
                PASSPORT
              </text>
            </g>
          </svg>
        </div>
      );
    case 'ielts':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#FDE68A] via-[#FEF3C7] to-[#FCD34D] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            {/* Open study notebook */}
            <rect x="28" y="12" width="124" height="74" rx="6" fill="#FFFFFF" />
            <line x1="90" y1="12" x2="90" y2="86" stroke="#E2E8F0" strokeWidth="2" />
            {/* Left page lines */}
            <rect x="40" y="24" width="38" height="4" rx="2" fill="#2563EB" opacity="0.75" />
            <rect x="40" y="34" width="40" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="40" y="41" width="35" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="40" y="48" width="38" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="40" y="55" width="32" height="3" rx="1.5" fill="#CBD5E1" />
            {/* Right page lines + pink sticky note */}
            <rect x="100" y="24" width="38" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="100" y="31" width="34" height="3" rx="1.5" fill="#CBD5E1" />
            <rect x="108" y="44" width="34" height="26" rx="3" fill="#F472B6" opacity="0.85" />
            <rect x="113" y="51" width="22" height="3" rx="1.5" fill="#FFFFFF" />
            <rect x="113" y="58" width="16" height="3" rx="1.5" fill="#FFFFFF" opacity="0.85" />
            {/* Highlighter */}
            <rect x="20" y="26" width="6" height="42" rx="3" fill="#F59E0B" />
          </svg>
        </div>
      );
    case 'wassce':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#F3E8FF] via-[#EDE9FE] to-[#DDD6FE] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="34" y="14" width="112" height="68" rx="8" fill="#FFFFFF" />
            <circle cx="58" cy="36" r="11" fill="#6846F5" opacity="0.16" />
            <text x="58" y="40" textAnchor="middle" fill="#6846F5" fontSize="11" fontWeight="800">
              A1
            </text>
            <rect x="78" y="28" width="54" height="5" rx="2.5" fill="#1E293B" opacity="0.75" />
            <rect x="78" y="38" width="44" height="3.5" rx="1.75" fill="#94A3B8" />
            <rect x="46" y="56" width="88" height="14" rx="4" fill="#F5F3FF" />
            <text x="90" y="66" textAnchor="middle" fill="#5B21B6" fontSize="8" fontWeight="700">
              WASSCE ↔ GPA / UK
            </text>
          </svg>
        </div>
      );
    case 'fee-waiver':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#DCFCE7] via-[#ECFDF5] to-[#D1FAE5] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="30" y="16" width="120" height="64" rx="8" fill="#FFFFFF" />
            <rect x="44" y="28" width="60" height="5" rx="2.5" fill="#059669" />
            <rect x="44" y="40" width="90" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="44" y="48" width="76" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="44" y="58" width="56" height="12" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
            <text x="72" y="67" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="800">
              $0 FEE WAIVER
            </text>
          </svg>
        </div>
      );
    case 'english-waiver':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#BAE6FD] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="32" y="14" width="116" height="68" rx="8" fill="#FFFFFF" />
            <rect x="46" y="26" width="88" height="16" rx="4" fill="#EFF6FF" />
            <text x="90" y="37" textAnchor="middle" fill="#1D4ED8" fontSize="8.5" fontWeight="800">
              MOI &amp; WAIVER GUIDE
            </text>
            <rect x="46" y="50" width="78" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="46" y="58" width="64" height="3.5" rx="1.75" fill="#CBD5E1" />
            <rect x="46" y="66" width="48" height="3.5" rx="1.75" fill="#93C5FD" />
          </svg>
        </div>
      );
    case 'sat-toefl':
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#E0E7FF] via-[#EEF2FF] to-[#C7D2FE] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="30" y="14" width="120" height="68" rx="8" fill="#FFFFFF" />
            <rect x="44" y="25" width="38" height="16" rx="4" fill="#EEF2FF" />
            <text x="63" y="36" textAnchor="middle" fill="#4338CA" fontSize="8.5" fontWeight="800">
              SAT
            </text>
            <rect x="88" y="25" width="48" height="16" rx="4" fill="#EFF6FF" />
            <text x="112" y="36" textAnchor="middle" fill="#1D4ED8" fontSize="8.5" fontWeight="800">
              TOEFL
            </text>
            <rect x="44" y="50" width="90" height="4" rx="2" fill="#CBD5E1" />
            <rect x="44" y="59" width="72" height="4" rx="2" fill="#CBD5E1" />
            <rect x="44" y="68" width="54" height="4" rx="2" fill="#818CF8" opacity="0.7" />
          </svg>
        </div>
      );
    case 'career':
    default:
      return (
        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#FCE7F3] via-[#FDF2F8] to-[#FBCFE8] flex items-center justify-center">
          <svg viewBox="0 0 180 96" className="w-full h-full" aria-hidden="true">
            <rect x="30" y="14" width="120" height="68" rx="8" fill="#FFFFFF" />
            <circle cx="56" cy="40" r="12" fill="#FDF2F8" stroke="#EC4899" strokeWidth="1.5" />
            <polygon points="53,35 61,40 53,45" fill="#EC4899" />
            <rect x="76" y="31" width="58" height="5" rx="2.5" fill="#1E293B" opacity="0.8" />
            <rect x="76" y="41" width="44" height="3.5" rx="1.75" fill="#94A3B8" />
            <rect x="44" y="60" width="92" height="10" rx="5" fill="#FDF2F8" />
            <text x="90" y="67.5" textAnchor="middle" fill="#BE185D" fontSize="7.5" fontWeight="800">
              STAR INTERVIEW &amp; ESSAY
            </text>
          </svg>
        </div>
      );
  }
};

export interface ResourcesViewProps {
  onNavigateToTab?: (tab: DashboardNavTab) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigateToTab }) => {
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategoryId | 'all'>('all');
  const [showAllResources, setShowAllResources] = useState(false);
  const [activeResource, setActiveResource] = useState<AcademicResourceItem | null>(null);
  const [showEssayPromptsModal, setShowEssayPromptsModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const effectiveSearch = (submittedSearch || searchInput).trim().toLowerCase();

  const filteredResources = useMemo(() => {
    const matches = ACADEMIC_RESOURCES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!effectiveSearch) return true;
      const haystack = [item.title, item.summary, item.formatLabel, ...item.keywords]
        .join(' ')
        .toLowerCase();
      return haystack.includes(effectiveSearch);
    });

    if (!effectiveSearch && selectedCategory === 'all' && !showAllResources) {
      return matches.filter((item) => item.featured);
    }

    return matches;
  }, [effectiveSearch, selectedCategory, showAllResources]);

  const isFiltered = effectiveSearch.length > 0 || selectedCategory !== 'all';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSubmittedSearch('');
    setSelectedCategory('all');
    setShowAllResources(false);
  };

  const handleCategoryClick = (categoryId: ResourceCategoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? 'all' : categoryId));
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2200);
    } catch {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2200);
    }
  };

  const activeCategoryLabel =
    selectedCategory === 'all'
      ? null
      : RESOURCE_CATEGORIES.find((cat) => cat.id === selectedCategory)?.title || null;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Page Heading */}
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-[#10132D] tracking-tight leading-tight">
          Resources
        </h2>
        <p className="text-xs sm:text-[13px] text-[#475569]">
          Essential tools, guides and materials to support your study journey.
        </p>
      </div>

      {/* 2. Student Resources Hub Hero Banner */}
      <section
        aria-label="Student Resources Hub"
        className="relative overflow-hidden rounded-[18px] sm:rounded-[20px] bg-gradient-to-r from-[#240B63] via-[#461FB8] to-[#6846F5] text-white shadow-[0_12px_28px_rgba(67,24,184,0.22)]"
      >
        {/* Warm gold decorative bottom-right curve matching reference */}
        <svg
          viewBox="0 0 600 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M360 180C465 168 545 128 600 68V180H360Z"
            fill="#F4B844"
          />
          <path
            d="M395 180C488 166 560 128 600 84V180H395Z"
            fill="#321182"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="md:col-span-7 space-y-1.5 max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold font-display tracking-tight leading-[1.15]">
              Student{' '}
              <span className="text-[#F8C555] italic">Resources</span>{' '}
              Hub
            </h3>
            <p className="text-xs sm:text-[13.5px] text-white/90 leading-relaxed max-w-md">
              Guides, templates, test prep and practical tools for scholarships, admissions and studying abroad.
            </p>
          </div>

          <div className="md:col-span-5 flex justify-center md:justify-end items-end -mb-3 md:-mb-5">
            <StudyDeskBannerArtwork />
          </div>
        </div>
      </section>

      {/* 3. Full-Width Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        aria-label="Search student resources"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-1.5 pl-4 flex items-center gap-2 focus-within:border-[#6846F5] focus-within:ring-2 focus-within:ring-[#6846F5]/15 transition-all"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (!e.target.value.trim()) {
              setSubmittedSearch('');
            }
          }}
          placeholder="Search resources (e.g., SOP, CV, Visa, IELTS, WASSCE...)"
          aria-label="Search resources"
          className="flex-1 min-w-0 bg-transparent text-sm text-[#10132D] placeholder:text-slate-400 focus:outline-none py-2"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setSubmittedSearch('');
            }}
            aria-label="Clear search query"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="px-5 sm:px-7 py-2.5 rounded-xl bg-[#6846F5] hover:bg-[#5734E6] active:scale-[0.985] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer shrink-0"
        >
          Search
        </button>
      </form>

      {/* 4. Four Horizontal Category Cards */}
      <section aria-label="Resource categories" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RESOURCE_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              aria-pressed={isSelected}
              className={`group text-left rounded-2xl border px-3.5 py-3 flex items-center gap-3 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5] ${
                category.cardBg
              } ${category.cardHoverBg} ${
                isSelected
                  ? 'border-[#6846F5] ring-2 ring-[#6846F5]/30 shadow-sm'
                  : category.cardBorder
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
              >
                {category.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold text-[#10132D] leading-snug">
                  {category.title}
                </h3>
                <p className="text-[11.5px] text-[#475569] leading-snug mt-0.5">
                  {category.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {/* 5. Two-Column Section: Popular Resources (Left) + Useful Tools (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Popular Resources Card (~66%) */}
        <section
          aria-label="Popular Resources"
          className="lg:col-span-8 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#FDE68A] shrink-0" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D] truncate">
                {activeCategoryLabel ? activeCategoryLabel : isFiltered ? 'Matching Resources' : 'Popular Resources'}
              </h3>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4F0FF] text-[#6846F5] text-[11px] font-semibold hover:bg-[#EAE2FF] transition-colors cursor-pointer"
                >
                  <span>Reset filter</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {!isFiltered && (
              <button
                type="button"
                onClick={() => setShowAllResources((prev) => !prev)}
                className="text-xs sm:text-sm font-semibold text-[#6846F5] hover:text-[#4E2AD6] transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <span>{showAllResources ? 'Show Top 4' : 'View All →'}</span>
              </button>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {filteredResources.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveResource(item)}
                  className="group text-left bg-white rounded-xl border border-[#E6EAF2] p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer hover:border-[#C4B5FD] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(104,70,245,0.08)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6846F5]"
                >
                  <div className="space-y-2.5">
                    <ResourceThumbnail variant={item.thumbnailVariant} />
                    <h4 className="text-[13px] sm:text-sm font-bold text-[#10132D] leading-snug group-hover:text-[#6846F5] transition-colors px-0.5">
                      {item.title}
                    </h4>
                  </div>

                  <div className="pt-3 px-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
                    {item.formatLabel === 'Study Plan' ? (
                      <GraduationCap className="w-3.5 h-3.5 text-[#6846F5] shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#6846F5] shrink-0" />
                    )}
                    <span>{item.formatLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center space-y-2.5">
              <p className="text-sm font-semibold text-[#10132D]">
                No resources matched your search
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for SOP, CV, Visa, IELTS, WASSCE, or Application Fee Waiver, or reset filters to browse all student guides.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6846F5] text-white text-xs font-semibold hover:bg-[#5734E6] transition-colors cursor-pointer"
              >
                Show All Resources
              </button>
            </div>
          )}
        </section>

        {/* Right: Useful Tools Card (~34%) */}
        <aside
          aria-label="Useful Tools"
          className="lg:col-span-4 bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#6846F5] shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-bold font-display text-[#10132D]">
              Useful Tools
            </h3>
          </div>

          <div className="divide-y divide-[#EEF1F7]">
            <a
              href="https://ielts.org/take-a-test/preparation-materials"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-3 px-1.5 -mx-1.5 rounded-xl hover:bg-[#F7F5FF] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Headphones className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-sm font-semibold text-[#1E293B] group-hover:text-[#6846F5] transition-colors truncate">
                  IELTS Practice
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6846F5] opacity-80 group-hover:opacity-100 shrink-0" />
            </a>

            <a
              href="https://www.ets.org/toefl/test-takers/ibt/prepare.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-3 px-1.5 -mx-1.5 rounded-xl hover:bg-[#F7F5FF] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-sm font-semibold text-[#1E293B] group-hover:text-[#6846F5] transition-colors truncate">
                  TOEFL Resources
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6846F5] opacity-80 group-hover:opacity-100 shrink-0" />
            </a>

            <a
              href="https://satsuite.collegeboard.org/sat/practice-preparation"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-3 px-1.5 -mx-1.5 rounded-xl hover:bg-[#F7F5FF] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <GraduationCap className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-sm font-semibold text-[#1E293B] group-hover:text-[#6846F5] transition-colors truncate">
                  SAT Preparation
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6846F5] opacity-80 group-hover:opacity-100 shrink-0" />
            </a>

            <button
              type="button"
              onClick={() => setShowEssayPromptsModal(true)}
              className="w-full group flex items-center justify-between py-3 px-1.5 -mx-1.5 rounded-xl hover:bg-[#F7F5FF] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <PenLine className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-sm font-semibold text-[#1E293B] group-hover:text-[#6846F5] transition-colors truncate">
                  Scholarship Essay Prompts
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6846F5] opacity-80 group-hover:opacity-100 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToTab) {
                  onNavigateToTab('scholarships');
                } else {
                  const guide = ACADEMIC_RESOURCES.find((r) => r.id === 'fee-waiver-letter');
                  if (guide) setActiveResource(guide);
                }
              }}
              className="w-full group flex items-center justify-between py-3 px-1.5 -mx-1.5 rounded-xl hover:bg-[#F7F5FF] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Award className="w-4 h-4 text-[#6846F5] shrink-0" />
                <span className="text-sm font-semibold text-[#1E293B] group-hover:text-[#6846F5] transition-colors truncate">
                  Scholarships &amp; Aid Finder
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6846F5] opacity-80 group-hover:opacity-100 shrink-0" />
            </button>
          </div>
        </aside>
      </div>

      {/* Modal 1: Resource Guide & Interactive Template Viewer */}
      {activeResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/60 backdrop-blur-xs"
          onClick={() => setActiveResource(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F0FF] text-[#6846F5] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  {activeResource.formatLabel}
                </span>
                <h3
                  id="resource-modal-title"
                  className="text-lg sm:text-xl font-bold font-display text-[#10132D]"
                >
                  {activeResource.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeResource.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveResource(null)}
                aria-label="Close resource modal"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Guidance Sections */}
            <div className="space-y-4">
              {activeResource.sections.map((section) => (
                <div key={section.heading} className="space-y-2">
                  <h4 className="text-sm font-bold text-[#10132D]">{section.heading}</h4>
                  <ul className="space-y-2">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#6846F5] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Copyable Editable Template (when resource includes template text) */}
            {activeResource.copyableTemplate && (
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#10132D]">
                    {activeResource.copyableTemplate.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        activeResource.id,
                        activeResource.copyableTemplate!.content
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6846F5] hover:bg-[#5734E6] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedId === activeResource.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Editable Text</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-3.5 max-h-60 overflow-y-auto leading-relaxed">
                  {activeResource.copyableTemplate.content}
                </pre>
              </div>
            )}

            {/* Verified Official External Links */}
            {activeResource.officialLinks && activeResource.officialLinks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Official Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeResource.officialLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 hover:border-[#6846F5] hover:bg-[#F7F5FF] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#10132D] truncate">
                          {link.label}
                        </p>
                        {link.note && (
                          <p className="text-[11px] text-slate-500 truncate">{link.note}</p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#6846F5] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Scholarship Essay Prompts Tool */}
      {showEssayPromptsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="essay-prompts-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10132D]/60 backdrop-blur-xs"
          onClick={() => setShowEssayPromptsModal(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3
                  id="essay-prompts-title"
                  className="text-lg sm:text-xl font-bold font-display text-[#10132D]"
                >
                  Scholarship Essay Prompts &amp; Outlines
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Practice with common international scholarship prompts and copy structured outlines to draft stronger applications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEssayPromptsModal(false)}
                aria-label="Close essay prompts modal"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {SCHOLARSHIP_ESSAY_PROMPTS.map((item, idx) => {
                const promptKey = `essay-prompt-${idx}`;
                const copyPayload = `${item.program}\nPrompt: ${item.prompt}\n\nOutline:\n${item.outline
                  .map((step, i) => `${i + 1}. ${step}`)
                  .join('\n')}`;
                return (
                  <div
                    key={item.program}
                    className="rounded-xl border border-[#E6EAF2] bg-[#F8FAFC] p-4 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6846F5]">
                        {item.program}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(promptKey, copyPayload)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#6846F5] text-xs font-semibold text-[#10132D] transition-colors cursor-pointer"
                      >
                        {copiedId === promptKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#6846F5]" />
                            <span>Copy Outline</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#10132D] leading-snug">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {item.outline.map((step) => (
                        <li key={step} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6846F5] shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
