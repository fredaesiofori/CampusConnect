/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { authenticOpportunities, OpportunityItem } from './src/data/opportunities';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '1mb' }));

// -------------------------------------------------------------
// In-Memory Rate Limiter (Max 30 requests per minute per IP)
// -------------------------------------------------------------
const ipRequestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestTimestamps.set(ip, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  ipRequestTimestamps.set(ip, validTimestamps);
  return true;
}

// Clean up stale rate limiter entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestTimestamps.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      ipRequestTimestamps.delete(ip);
    } else {
      ipRequestTimestamps.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

// -------------------------------------------------------------
// Opportunity Grounding Engine
// Matches user query + student profile against authenticOpportunities
// -------------------------------------------------------------
interface StudentContext {
  nationality?: string;
  countryOfResidence?: string;
  preferredDestinations?: string[];
  educationLevel?: string;
  intendedDegree?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  currentSchool?: string;
  fundingPreference?: string;
  fundingTypePreference?: string;
  testPreference?: string;
  studyModePreference?: string;
  preferredFieldsOfStudy?: string[];
}

function findRelevantOpportunities(query: string, student?: StudentContext): OpportunityItem[] {
  const cleanQuery = query.toLowerCase();
  const queryTokens = cleanQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const preferredCountries = (student?.preferredDestinations || []).map((c) => c.toLowerCase());
  const degree = (student?.intendedDegree || student?.educationLevel || '').toLowerCase();
  const field = (student?.fieldOfStudy || '').toLowerCase();

  // Specific country intent flags via word boundaries
  const wantsUS = /\b(us|usa|united states|america|american)\b/i.test(query);
  const wantsUK = /\b(uk|united kingdom|britain|british|england|scotland)\b/i.test(query);
  const wantsCanada = /\b(canada|canadian)\b/i.test(query);
  const wantsGhana = /\b(ghana|ghanaian)\b/i.test(query);
  const wantsNigeria = /\b(nigeria|nigerian)\b/i.test(query);
  const wantsGermany = /\b(germany|german)\b/i.test(query);
  const wantsKenya = /\b(kenya|kenyan)\b/i.test(query);
  const wantsSouthAfrica = /\b(south africa|south african)\b/i.test(query);
  const wantsAustralia = /\b(australia|australian)\b/i.test(query);

  const scored: { item: OpportunityItem; score: number }[] = authenticOpportunities.map((item) => {
    let score = 0;
    const country = (item.country || '').toLowerCase();
    const city = (item.city || '').toLowerCase();
    const countryCode = (item.countryCode || '').toLowerCase();
    const title = (item.title || item.officialName || '').toLowerCase();
    const summary = (item.summary || item.officialRuleSummary || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const degrees = (item.degreeLevels || []).map((d: string) => d.toLowerCase());
    const fields = (item.studyFields || []).map((f: string) => f.toLowerCase());
    const feeStatus = (item.applicationFees?.status || item.applicationFees?.details || '').toLowerCase();
    const testStatus = (item.testWaiverRules?.status || item.testWaiverRules?.details || '').toLowerCase();
    const fundingType = (item.fundingDetails?.type || item.fundingDetails?.details || '').toLowerCase();

    // Matches against query tokens
    for (const token of queryTokens) {
      if (token === 'university' || token === 'universities' || token === 'find' || token === 'with') continue;
      if (title.includes(token)) score += 8;
      if (country.includes(token) || city.includes(token)) score += 6;
      if (fields.some((f: string) => f.includes(token))) score += 5;
      if (feeStatus.includes(token) || testStatus.includes(token)) score += 4;
      if (summary.includes(token)) score += 2;
    }

    // Specific country intent matches
    if (wantsUS && (country.includes('united states') || countryCode === 'us')) score += 18;
    if (wantsUK && (country.includes('united kingdom') || countryCode === 'gb')) score += 18;
    if (wantsCanada && country.includes('canada')) score += 18;
    if (wantsGhana && country.includes('ghana')) score += 18;
    if (wantsNigeria && country.includes('nigeria')) score += 18;
    if (wantsGermany && country.includes('germany')) score += 18;
    if (wantsKenya && country.includes('kenya')) score += 18;
    if (wantsSouthAfrica && country.includes('south africa')) score += 18;
    if (wantsAustralia && country.includes('australia')) score += 18;

    // Student profile destination boost
    if (preferredCountries.some((pc) => country.includes(pc) || pc.includes(country) || (pc.includes('united states') && countryCode === 'us'))) {
      score += 8;
    }

    // Degree level match
    if (degree && degrees.some((d: string) => d.includes(degree) || degree.includes(d))) {
      score += 4;
    }

    // Field of study match
    if (field && (fields.some((f: string) => f.includes(field)) || summary.includes(field) || title.includes(field))) {
      score += 4;
    }

    // Specific fee waiver intent
    if (cleanQuery.includes('fee waiver') || cleanQuery.includes('$0') || cleanQuery.includes('no fee') || cleanQuery.includes('free application')) {
      if (feeStatus.includes('free') || feeStatus.includes('$0') || feeStatus.includes('waiver')) {
        score += 10;
      }
    }

    // Specific scholarship intent
    if (cleanQuery.includes('scholarship') || cleanQuery.includes('funding') || cleanQuery.includes('fully funded')) {
      if (category.includes('scholarship') || fundingType.includes('fully') || fundingType.includes('100%')) {
        score += 10;
      }
    }

    // Specific test waiver intent (SAT / GRE / WAEC)
    if (cleanQuery.includes('sat') || cleanQuery.includes('gre') || cleanQuery.includes('test optional') || cleanQuery.includes('no sat') || cleanQuery.includes('without sat')) {
      if (testStatus.includes('optional') || testStatus.includes('free') || testStatus.includes('waiver') || testStatus.includes('waec')) {
        score += 10;
      }
    }

    return { item, score };
  });

  // Sort descending by score, take top 10 relevant matches
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, 10).map((s) => s.item);
}

function generateFollowUpSuggestions(query: string, matches: OpportunityItem[]): string[] {
  const q = query.toLowerCase();
  const suggestions: string[] = [];

  if (!q.includes('fully funded') && !q.includes('full scholarship')) {
    suggestions.push('Show fully funded options');
  }
  if (!q.includes('sat') && !q.includes('gre') && !q.includes('test optional')) {
    suggestions.push('Find universities without SAT requirements');
  }
  if (!q.includes('fee waiver') && !q.includes('$0') && !q.includes('free application')) {
    suggestions.push('Filter for $0 application fee universities');
  }
  if (!q.includes('waec') && !q.includes('wassce') && !q.includes('ielts')) {
    suggestions.push('Show universities accepting WAEC / WASSCE');
  }
  if (!q.includes('master') && !q.includes('postgraduate') && !q.includes('phd')) {
    suggestions.push('Explore Master’s & Postgraduate scholarships');
  }
  if (!q.includes('canada') && !q.includes('uk') && !q.includes('united states')) {
    suggestions.push('Find top universities in Canada & the UK');
  }

  return suggestions.slice(0, 4);
}

function buildGroundingPrompt(opportunities: OpportunityItem[]): string {
  if (opportunities.length === 0) {
    return 'No specific pre-matched opportunities found for this query in the local verified index. Rely on general verified knowledge and instruct the student to check official portals.';
  }

  const itemsText = opportunities
    .map((o, idx) => {
      const url = o.officialWebsite || o.officialUrl || o.sourceUrl || '#';
      const fees = o.applicationFees?.status ? `${o.applicationFees.status}: ${o.applicationFees.details || ''}` : 'Standard';
      const tests = o.testWaiverRules?.status ? `${o.testWaiverRules.status}: ${o.testWaiverRules.details || ''}` : 'Standard';
      const funding = o.fundingDetails?.type ? `${o.fundingDetails.type} (${o.fundingDetails.amount || 'Varies'})` : 'Standard';
      const deadline = o.deadlines?.deadlineText || o.deadlines?.term || 'Rolling';

      return `[Match ${idx + 1}]
Name: ${o.title || o.officialName}
Country: ${o.country} (${o.city})
Category: ${o.category} | Levels: ${(o.degreeLevels || []).join(', ')}
Funding: ${funding}
Application Fee Policy: ${fees}
Test Policy (SAT/GRE/IELTS): ${tests}
Deadline: ${deadline}
Official Portal Link: ${url}
Summary: ${o.summary || o.officialRuleSummary || ''}`;
    })
    .join('\n\n');

  return `VERIFIED CAMPUS CONNECT OPPORTUNITY RECORDS:\n${itemsText}`;
}

// -------------------------------------------------------------
// Gemini Model Configuration & Client Factory
// -------------------------------------------------------------
const COVA_PRIMARY_MODEL = 'gemini-4-hydrogen';
const COVA_FALLBACK_MODEL = 'gemini-3.1-flash-lite';
const STREAM_FIRST_CHUNK_TIMEOUT_MS = 18_000;
const STREAM_TOTAL_TIMEOUT_MS = 45_000;
const NON_STREAM_TIMEOUT_MS = 22_000;

function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractGeminiErrorDetails(err: any): {
  status: number;
  code: string;
  message: string;
  isFallbackEligible: boolean;
} {
  const rawMessage = err?.message ? String(err.message) : String(err || 'Unknown error');
  let parsedMessage = rawMessage;
  let parsedStatus = typeof err?.status === 'number' ? err.status : 0;
  let parsedCode = typeof err?.code === 'string' ? err.code : '';

  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed?.error) {
      parsedMessage = parsed.error.message || parsedMessage;
      parsedStatus = parsed.error.code || parsedStatus;
      parsedCode = parsed.error.status || parsedCode;
    }
  } catch {
    // Plain text error
  }

  const upper = `${parsedCode} ${parsedMessage}`.toUpperCase();

  if (err?.name === 'AbortError' || upper.includes('TIMEOUT') || upper.includes('ABORT')) {
    return {
      status: 504,
      code: 'REQUEST_TIMEOUT',
      message: 'COVA AI took too long to respond. Please try sending your message again.',
      isFallbackEligible: false,
    };
  }

  if (
    parsedStatus === 400 && upper.includes('API_KEY') ||
    parsedStatus === 401 ||
    parsedStatus === 403 ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('PERMISSION_DENIED')
  ) {
    return {
      status: 503,
      code: 'GEMINI_AUTH_ERROR',
      message: 'COVA AI could not authenticate with Gemini. Please verify GEMINI_API_KEY in Settings > Secrets.',
      isFallbackEligible: false,
    };
  }

  if (parsedStatus === 429 || upper.includes('RESOURCE_EXHAUSTED') || upper.includes('QUOTA')) {
    return {
      status: 429,
      code: 'RATE_LIMIT_OR_QUOTA',
      message: 'Gemini API quota or rate limit reached temporarily. Please wait a moment and try again.',
      isFallbackEligible: false,
    };
  }

  if (parsedStatus === 404 || upper.includes('NOT_FOUND')) {
    return {
      status: 502,
      code: 'MODEL_NOT_FOUND',
      message: 'The configured AI model is temporarily unavailable. Please try again shortly.',
      isFallbackEligible: true,
    };
  }

  if (parsedStatus === 503 || upper.includes('UNAVAILABLE') || upper.includes('HIGH DEMAND')) {
    return {
      status: 503,
      code: 'MODEL_UNAVAILABLE',
      message: 'Gemini AI is currently experiencing high demand. Please try again in a few moments.',
      isFallbackEligible: true,
    };
  }

  return {
    status: parsedStatus >= 400 && parsedStatus < 600 ? parsedStatus : 502,
    code: parsedCode || 'GEMINI_REQUEST_FAILED',
    message: parsedMessage || 'An unexpected error occurred while communicating with COVA. Please try again.',
    isFallbackEligible: false,
  };
}

// -------------------------------------------------------------
// System Instruction for COVA Assistant
// -------------------------------------------------------------
const COVA_SYSTEM_INSTRUCTION = `You are COVA (Campus Opportunity & Virtual Assistant), the intelligent, encouraging, and accurate AI advisor for Campus Connect.
Campus Connect is a global university, admissions, and educational opportunities platform helping international students—especially ambitious scholars across Africa and the Global South—discover verified universities, scholarships, application fee waivers, and test-optional pathways worldwide.

YOUR IDENTITY & TONE:
- Professional, warm, empowering, accurate, and clear.
- Speak directly to the student as their trusted educational mentor.
- Be concise yet thorough. Avoid generic filler or repetitive disclaimers.

CRITICAL ACCURACY & GROUNDING RULES:
1. STRICT TRUTHFULNESS: Only recommend real universities, legitimate scholarship programs, and accurate admissions policies. NEVER invent university names, fake scholarship amounts, made-up deadlines, or nonexistent waiver codes.
2. VERIFIED DATA USAGE: When Campus Connect verified opportunity records are provided in the context, integrate them naturally. Highlight verified benefits (e.g. "$0 Application Fee", "SAT/GRE Optional", "Fully Funded", "WAEC English Accepted").
3. FORMATTING LINKS: Format university and scholarship portals as clickable markdown links using their exact verified official URL, e.g. [University of Oxford - Admissions Portal](https://www.ox.ac.uk).
4. UNVERIFIED OR UNCERTAIN INFORMATION: If current deadlines, fees, or requirements cannot be verified from the provided data, explicitly say so and advise checking the official admissions portal.
5. PERSONALIZATION (MY PROFILE): Tailor recommendations to the student's nationality, residence, education level, intended degree, field of study, destinations, funding preference, and testing preference.
6. FOUR DISTINCT STUDENT DASHBOARD FUNCTIONS — NEVER CONFLATE THEM:
   The student's dashboard separates opportunities into three strictly independent lists plus their profile:
   - SAVED OPPORTUNITIES (Personal Bookmarks): Universities or scholarships bookmarked for future reading. Saving an opportunity does NOT mean the student is targeting it or has started applying.
   - TARGET LIST (Future Study Goals): Planned programs the student intends to pursue, with Priority (High/Medium/Low), Target Intake Year, and Personal Goal notes. These are plans, not started applications.
   - ACTIVE APPLICATIONS (Started Applications): Applications the student has explicitly started, with Stage ("preparing", "submitted", or "accepted") and checklist task progress (out of 6 preparation tasks).
   - Always report each list accurately! If an item is only in Saved Opportunities, never say it is in Active Applications or Target List. If the student has 0 Active Applications, state that clearly while mentioning any Target List goals or Saved bookmarks they actually have.
   - Explain that students can manage stages or start applications from the interactive cards or their Applications / Target List sections. NEVER fabricate statuses or claim an application was submitted unless recorded as "submitted" or "accepted".
7. APPLICATION GUIDANCE & ROADMAPS:
   - Break down actionable steps (transcripts, WES evaluation, English proficiency waivers like WAEC/NECO for West African students, letters of recommendation, statement of purpose, financial declaration).
   - When students ask for personal statement or motivation letter help, offer clear, structured outlines (Hook/Intro, Academic Background, Projects/Research, Career Vision, Why This University).
8. DEADLINE PRIORITIZATION:
   - Help students prioritize based on verified deadlines, Active Application stage, and Target List priority. Never invent deadlines or claim automated reminders were sent.`;

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/cova/health', (_req: Request, res: Response) => {
  const apiKeyPresent = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    assistantName: 'COVA',
    model: COVA_PRIMARY_MODEL,
    fallbackModel: COVA_FALLBACK_MODEL,
    geminiConfigured: apiKeyPresent,
    totalVerifiedOpportunities: authenticOpportunities.length,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// COVA Chat Endpoint (Supports SSE streaming & JSON response)
// -------------------------------------------------------------
interface StudentSavedOpportunityRecord {
  id: string;
  officialName: string;
  country: string;
  category?: string;
  deadlineText?: string;
  feeStatus?: string;
  testStatus?: string;
  fundingType?: string;
}

interface StudentTargetListRecord {
  id: string;
  officialName: string;
  country: string;
  priority: 'High' | 'Medium' | 'Low';
  intakeYear: string;
  personalGoal?: string;
  deadlineText?: string;
  feeStatus?: string;
  fundingType?: string;
}

interface StudentActiveApplicationRecord {
  id: string;
  officialName: string;
  country: string;
  stage: 'preparing' | 'submitted' | 'accepted';
  completedTasksCount?: number;
  totalTasksCount?: number;
  completedTasks?: string[];
  notes?: string;
  deadlineText?: string;
  feeStatus?: string;
  testStatus?: string;
  fundingType?: string;
}

interface StudentTrackerRecord {
  id: string;
  officialName: string;
  country: string;
  stage: 'saved' | 'preparing' | 'submitted' | 'accepted';
  deadlineText?: string;
  feeStatus?: string;
  testStatus?: string;
  fundingType?: string;
}

interface ChatRequestBody {
  message?: string;
  conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>;
  studentProfile?: StudentContext;
  studentSavedOpportunities?: StudentSavedOpportunityRecord[];
  studentTargetList?: StudentTargetListRecord[];
  studentActiveApplications?: StudentActiveApplicationRecord[];
  studentTracker?: StudentTrackerRecord[];
  stream?: boolean;
}

app.post('/api/cova/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
  const requestStartMs = Date.now();
  console.log(`[COVA] Received chat request from ${clientIp}, stream: ${req.body?.stream}`);

  // 1. Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    console.warn(`[COVA] Rate limit exceeded for ${clientIp}`);
    res.status(429).json({
      error: 'Rate limit exceeded. Please wait a few moments before sending another message.',
      code: 'RATE_LIMITED',
    });
    return;
  }

  // 2. Input Validation
  const {
    message,
    conversationHistory = [],
    studentProfile,
    studentSavedOpportunities,
    studentTargetList,
    studentActiveApplications,
    studentTracker,
    stream = true,
  } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Message cannot be empty.', code: 'EMPTY_MESSAGE' });
    return;
  }

  if (message.length > 2000) {
    res.status(400).json({
      error: 'Message is too long. Please keep your question under 2,000 characters.',
      code: 'MESSAGE_TOO_LONG',
    });
    return;
  }

  // 3. API Key Validation
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const missingKeyMessage =
      'COVA AI is currently awaiting its Gemini API key. Please add your GEMINI_API_KEY in Settings > Secrets to enable live AI responses.';

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`event: error\ndata: ${JSON.stringify({ error: missingKeyMessage, code: 'MISSING_API_KEY' })}\n\n`);
      res.end();
      return;
    }

    res.status(503).json({
      error: missingKeyMessage,
      code: 'MISSING_API_KEY',
    });
    return;
  }

  // 4. Retrieve Context & Grounding from Campus Connect Opportunities
  const relevantOpportunities = findRelevantOpportunities(message, studentProfile);
  const groundingContext = buildGroundingPrompt(relevantOpportunities);

  let studentContextSummary = '';
  if (studentProfile) {
    const parts: string[] = [];
    if (studentProfile.nationality) parts.push(`Nationality: ${studentProfile.nationality}`);
    if (studentProfile.countryOfResidence) parts.push(`Residence: ${studentProfile.countryOfResidence}`);
    if (studentProfile.educationLevel) parts.push(`Current Education Level: ${studentProfile.educationLevel}`);
    if (studentProfile.currentSchool) parts.push(`Current Institution: ${studentProfile.currentSchool}`);
    if (studentProfile.intendedDegree) parts.push(`Target Degree: ${studentProfile.intendedDegree}`);
    if (studentProfile.fieldOfStudy) parts.push(`Field of Study: ${studentProfile.fieldOfStudy}`);
    if (studentProfile.preferredFieldsOfStudy?.length) {
      parts.push(`Additional Preferred Fields: ${studentProfile.preferredFieldsOfStudy.join(', ')}`);
    }
    if (studentProfile.graduationYear) parts.push(`Expected Graduation Year: ${studentProfile.graduationYear}`);
    if (studentProfile.preferredDestinations?.length) {
      parts.push(`Preferred Destinations: ${studentProfile.preferredDestinations.join(', ')}`);
    }
    if (studentProfile.fundingPreference) parts.push(`Funding Preference: ${studentProfile.fundingPreference}`);
    if (studentProfile.studyModePreference) parts.push(`Study Mode: ${studentProfile.studyModePreference}`);
    if (studentProfile.testPreference) parts.push(`Testing Preference: ${studentProfile.testPreference}`);

    if (parts.length > 0) {
      studentContextSummary = `AUTHENTICATED STUDENT PROFILE (MY PROFILE):\n${parts.join('\n')}\n\n`;
    }
  }

  // Normalize 3 distinct dashboard structures (falling back to legacy studentTracker only if new arrays omitted)
  const resolvedActiveApps: StudentActiveApplicationRecord[] = Array.isArray(studentActiveApplications)
    ? studentActiveApplications
    : Array.isArray(studentTracker)
    ? studentTracker
        .filter((t) => t.stage === 'preparing' || t.stage === 'submitted' || t.stage === 'accepted')
        .map((t) => ({
          id: t.id,
          officialName: t.officialName,
          country: t.country,
          stage: t.stage as 'preparing' | 'submitted' | 'accepted',
          deadlineText: t.deadlineText,
          feeStatus: t.feeStatus,
          testStatus: t.testStatus,
          fundingType: t.fundingType,
        }))
    : [];

  const resolvedTargetList: StudentTargetListRecord[] = Array.isArray(studentTargetList)
    ? studentTargetList
    : [];

  const resolvedSavedOpps: StudentSavedOpportunityRecord[] = Array.isArray(studentSavedOpportunities)
    ? studentSavedOpportunities
    : Array.isArray(studentTracker)
    ? studentTracker
        .filter((t) => t.stage === 'saved')
        .map((t) => ({
          id: t.id,
          officialName: t.officialName,
          country: t.country,
          deadlineText: t.deadlineText,
          feeStatus: t.feeStatus,
          testStatus: t.testStatus,
          fundingType: t.fundingType,
        }))
    : [];

  // Build clearly separated Student Dashboard Context Sections
  const activeAppsBlock =
    resolvedActiveApps.length > 0
      ? `ACTIVE APPLICATIONS (${resolvedActiveApps.length} started):\n${resolvedActiveApps
          .map((item, idx) => {
            const tasksInfo =
              typeof item.completedTasksCount === 'number'
                ? ` | Checklist: ${item.completedTasksCount}/${item.totalTasksCount || 6} tasks done`
                : '';
            const notesInfo = item.notes ? ` | Notes: ${item.notes}` : '';
            return `${idx + 1}. [ID: ${item.id}] ${item.officialName} (${item.country}) | Stage: "${item.stage}"${tasksInfo} | Deadline: ${item.deadlineText || 'Rolling'} | Fee: ${item.feeStatus || 'Standard'} | Funding: ${item.fundingType || 'Standard'}${notesInfo}`;
          })
          .join('\n')}\n\n`
      : `ACTIVE APPLICATIONS: None started yet (0 active applications).\n\n`;

  const targetListBlock =
    resolvedTargetList.length > 0
      ? `TARGET LIST — PLANNED FUTURE STUDY GOALS (${resolvedTargetList.length} targets):\n${resolvedTargetList
          .map((item, idx) => {
            const goalInfo = item.personalGoal ? ` | Personal Goal: ${item.personalGoal}` : '';
            return `${idx + 1}. [ID: ${item.id}] ${item.officialName} (${item.country}) | Priority: ${item.priority} | Intake Year: ${item.intakeYear}${goalInfo} | Deadline: ${item.deadlineText || 'Rolling'} | Fee: ${item.feeStatus || 'Standard'}`;
          })
          .join('\n')}\n\n`
      : `TARGET LIST: No future study targets added yet (0 targets).\n\n`;

  const savedOppsBlock =
    resolvedSavedOpps.length > 0
      ? `SAVED OPPORTUNITIES — PERSONAL BOOKMARKS ONLY (${resolvedSavedOpps.length} saved):\n${resolvedSavedOpps
          .map(
            (item, idx) =>
              `${idx + 1}. [ID: ${item.id}] ${item.officialName} (${item.country})${item.category ? ` [${item.category}]` : ''} | Deadline: ${item.deadlineText || 'Rolling'} | Funding: ${item.fundingType || 'Standard'}`
          )
          .join('\n')}\n\n`
      : `SAVED OPPORTUNITIES: 0 bookmarked opportunities.\n\n`;

  const studentDashboardContext = `${activeAppsBlock}${targetListBlock}${savedOppsBlock}`;

  // Determine which interactive tracker/application cards should be surfaced
  const cleanLower = message.toLowerCase();
  const mentionsSaved =
    cleanLower.includes('saved') || cleanLower.includes('bookmark') || cleanLower.includes('bookmarked');
  const mentionsTargets =
    cleanLower.includes('target') || cleanLower.includes('plan') || cleanLower.includes('goal');
  const mentionsApps =
    cleanLower.includes('application') ||
    cleanLower.includes('applications') ||
    cleanLower.includes('tracker') ||
    cleanLower.includes('status') ||
    cleanLower.includes('preparing') ||
    cleanLower.includes('submitted') ||
    cleanLower.includes('accepted') ||
    cleanLower.includes('deadline') ||
    cleanLower.includes('progress') ||
    cleanLower.includes('checklist');

  const allKnownIds = new Set<string>([
    ...resolvedActiveApps.map((a) => a.id),
    ...resolvedTargetList.map((t) => t.id),
    ...resolvedSavedOpps.map((s) => s.id),
  ]);

  const namesAnyTrackedItem =
    resolvedActiveApps.some((a) => cleanLower.includes(a.officialName.toLowerCase()) || cleanLower.includes(a.id)) ||
    resolvedTargetList.some((t) => cleanLower.includes(t.officialName.toLowerCase()) || cleanLower.includes(t.id)) ||
    resolvedSavedOpps.some((s) => cleanLower.includes(s.officialName.toLowerCase()) || cleanLower.includes(s.id));

  let trackerOpportunities: OpportunityItem[] = [];
  if (mentionsApps || mentionsTargets || mentionsSaved || namesAnyTrackedItem) {
    const candidateIds: string[] = [];
    if (mentionsApps || namesAnyTrackedItem || (!mentionsSaved && !mentionsTargets)) {
      candidateIds.push(...resolvedActiveApps.map((a) => a.id));
    }
    if (mentionsTargets || mentionsApps || namesAnyTrackedItem) {
      candidateIds.push(...resolvedTargetList.map((t) => t.id));
    }
    if (mentionsSaved || namesAnyTrackedItem) {
      candidateIds.push(...resolvedSavedOpps.map((s) => s.id));
    }
    const dedupedIds = Array.from(new Set(candidateIds)).filter((id) => allKnownIds.has(id));
    trackerOpportunities = dedupedIds
      .map((id) => authenticOpportunities.find((opp) => opp.id === id))
      .filter((opp): opp is OpportunityItem => Boolean(opp))
      .slice(0, 6);
  }

  // 5. Build Gemini API Contents & Timeout/Abort Controller
  const upstreamController = new AbortController();
  let clientDisconnected = false;
  let timedOut = false;

  const onResponseClose = () => {
    if (!res.writableEnded) {
      clientDisconnected = true;
      upstreamController.abort();
    }
  };
  res.on('close', onResponseClose);

  let activeTimer: NodeJS.Timeout | null = null;
  const resetTimeout = (ms: number) => {
    if (activeTimer) clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      timedOut = true;
      upstreamController.abort();
    }, ms);
  };

  try {
    const ai = createGeminiClient(apiKey);

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-10) : [];
    for (const turn of recentHistory) {
      if (
        turn &&
        (turn.role === 'user' || turn.role === 'model') &&
        typeof turn.content === 'string' &&
        turn.content.trim().length > 0
      ) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.content }],
        });
      }
    }

    const augmentedUserTurn = `${studentContextSummary}${studentDashboardContext}${groundingContext}\n\nSTUDENT INQUIRY:\n${message.trim()}`;
    contents.push({
      role: 'user',
      parts: [{ text: augmentedUserTurn }],
    });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      resetTimeout(STREAM_FIRST_CHUNK_TIMEOUT_MS);

      let responseStream;
      try {
        responseStream = await ai.models.generateContentStream({
          model: COVA_PRIMARY_MODEL,
          contents,
          config: {
            systemInstruction: COVA_SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            abortSignal: upstreamController.signal,
          },
        });
      } catch (primaryErr: any) {
        const info = extractGeminiErrorDetails(primaryErr);
        const elapsed = Date.now() - requestStartMs;
        if (info.isFallbackEligible && !clientDisconnected && !timedOut && elapsed < 10_000) {
          console.warn(
            `[COVA] Primary model ${COVA_PRIMARY_MODEL} unavailable (${info.code}), trying ${COVA_FALLBACK_MODEL}`
          );
          responseStream = await ai.models.generateContentStream({
            model: COVA_FALLBACK_MODEL,
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              abortSignal: upstreamController.signal,
            },
          });
        } else {
          throw primaryErr;
        }
      }

      // Stream chunks with a total request timeout ceiling
      resetTimeout(STREAM_TOTAL_TIMEOUT_MS);
      let emittedText = '';

      for await (const chunk of responseStream) {
        if (clientDisconnected || timedOut) break;
        const text = chunk.text;
        if (text) {
          emittedText += text;
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }

      if (clientDisconnected) {
        return;
      }

      if (timedOut) {
        throw new Error('TIMEOUT');
      }

      if (!emittedText.trim()) {
        throw new Error('COVA received an empty response from Gemini. Please retry.');
      }

      const topMatches = relevantOpportunities.slice(0, 4);
      const followUps = generateFollowUpSuggestions(message, relevantOpportunities);

      if (topMatches.length > 0 || followUps.length > 0 || trackerOpportunities.length > 0) {
        res.write(
          `data: ${JSON.stringify({ matchedOpportunities: topMatches, followUps, trackerOpportunities })}\n\n`
        );
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      resetTimeout(NON_STREAM_TIMEOUT_MS);

      let response;
      try {
        response = await ai.models.generateContent({
          model: COVA_PRIMARY_MODEL,
          contents,
          config: {
            systemInstruction: COVA_SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            abortSignal: upstreamController.signal,
          },
        });
      } catch (primaryErr: any) {
        const info = extractGeminiErrorDetails(primaryErr);
        const elapsed = Date.now() - requestStartMs;
        if (info.isFallbackEligible && !clientDisconnected && !timedOut && elapsed < 10_000) {
          console.warn(
            `[COVA] Primary model ${COVA_PRIMARY_MODEL} unavailable (${info.code}), trying ${COVA_FALLBACK_MODEL}`
          );
          response = await ai.models.generateContent({
            model: COVA_FALLBACK_MODEL,
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              abortSignal: upstreamController.signal,
            },
          });
        } else {
          throw primaryErr;
        }
      }

      if (clientDisconnected) {
        return;
      }

      const replyText = response.text || '';
      if (!replyText.trim()) {
        throw new Error('COVA received an empty response from Gemini. Please retry.');
      }

      const topMatches = relevantOpportunities.slice(0, 4);
      const followUps = generateFollowUpSuggestions(message, relevantOpportunities);

      res.json({
        response: replyText,
        model: COVA_PRIMARY_MODEL,
        matchedOpportunities: topMatches,
        trackerOpportunities,
        followUps,
        matchedOpportunitiesCount: relevantOpportunities.length,
      });
    }
  } catch (error: any) {
    if (clientDisconnected) {
      return;
    }

    const details = timedOut
      ? {
          status: 504,
          code: 'REQUEST_TIMEOUT',
          message: 'COVA AI took too long to respond. Please try sending your message again.',
        }
      : extractGeminiErrorDetails(error);

    console.error(`[COVA] Gemini generation error (${details.code}, ${details.status}):`, details.message);

    if (stream && !res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`event: error\ndata: ${JSON.stringify({ error: details.message, code: details.code })}\n\n`);
      res.end();
    } else if (stream && res.headersSent && !res.writableEnded) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: details.message, code: details.code })}\n\n`);
      res.end();
    } else if (!res.headersSent) {
      res.status(details.status).json({ error: details.message, code: details.code });
    }
  } finally {
    if (activeTimer) clearTimeout(activeTimer);
    res.off('close', onResponseClose);
  }
});

// -------------------------------------------------------------
// Scholarship Alerts Subscription Store & API
// -------------------------------------------------------------
const ALLOWED_PREFERENCE_IDS = [
  'all',
  'fully-funded',
  'fee-waiver',
  'sat-optional',
  'graduate',
] as const;

const SPECIFIC_PREFERENCE_IDS = [
  'fully-funded',
  'fee-waiver',
  'sat-optional',
  'graduate',
] as const;

type PreferenceId = (typeof ALLOWED_PREFERENCE_IDS)[number];

interface NewsletterSubscriberRecord {
  email: string;
  preferences: PreferenceId[];
  status: 'active' | 'unsubscribed';
  manageTokenHash: string;
  subscribedAt: string;
  updatedAt: string;
  unsubscribedAt?: string;
}

const NEWSLETTER_DATA_DIR = path.resolve(__dirname, '.data');
const NEWSLETTER_STORE_PATH = path.join(NEWSLETTER_DATA_DIR, 'scholarship-subscribers.json');
let newsletterWriteLock: Promise<void> = Promise.resolve();

function isEmailDeliveryConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      process.env.SENDGRID_API_KEY?.trim() ||
      (process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim())
  );
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isValidEmailAddress(email: string): boolean {
  if (!email || email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizePreferences(raw: unknown): PreferenceId[] {
  if (!Array.isArray(raw)) return [];
  const allowedSet = new Set<string>(ALLOWED_PREFERENCE_IDS);
  const filtered = Array.from(
    new Set(raw.filter((item): item is PreferenceId => typeof item === 'string' && allowedSet.has(item)))
  );

  if (filtered.includes('all')) {
    return [...ALLOWED_PREFERENCE_IDS];
  }

  const hasAllSpecific = SPECIFIC_PREFERENCE_IDS.every((id) => filtered.includes(id));
  if (hasAllSpecific) {
    return [...ALLOWED_PREFERENCE_IDS];
  }

  return filtered;
}

async function readSubscribersStore(): Promise<Record<string, NewsletterSubscriberRecord>> {
  try {
    const content = await fs.readFile(NEWSLETTER_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, NewsletterSubscriberRecord>;
    }
    return {};
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

async function writeSubscribersStore(store: Record<string, NewsletterSubscriberRecord>): Promise<void> {
  await fs.mkdir(NEWSLETTER_DATA_DIR, { recursive: true, mode: 0o700 });
  const tempPath = `${NEWSLETTER_STORE_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), { encoding: 'utf-8', mode: 0o600 });
  await fs.rename(tempPath, NEWSLETTER_STORE_PATH);
}

function withStoreLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = newsletterWriteLock.then(fn, fn);
  newsletterWriteLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function findActiveByToken(
  store: Record<string, NewsletterSubscriberRecord>,
  token: string
): NewsletterSubscriberRecord | null {
  if (!token || typeof token !== 'string' || token.length < 16) return null;
  const targetHash = hashToken(token.trim());
  for (const record of Object.values(store)) {
    if (record.status === 'active' && record.manageTokenHash && record.manageTokenHash === targetHash) {
      return record;
    }
  }
  return null;
}

app.get('/api/newsletter/status', (_req: Request, res: Response) => {
  res.json({
    emailDeliveryConfigured: isEmailDeliveryConfigured(),
  });
});

app.get('/api/newsletter/subscription', async (req: Request, res: Response) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const emailDeliveryConfigured = isEmailDeliveryConfigured();

  if (!token) {
    res.json({ subscribed: false, emailDeliveryConfigured });
    return;
  }

  try {
    const store = await readSubscribersStore();
    const match = findActiveByToken(store, token);
    if (!match) {
      res.json({ subscribed: false, emailDeliveryConfigured });
      return;
    }

    res.json({
      subscribed: true,
      emailDeliveryConfigured,
      subscription: {
        email: match.email,
        preferences: match.preferences,
        subscribedAt: match.subscribedAt,
        updatedAt: match.updatedAt,
      },
    });
  } catch (err) {
    console.error('[Newsletter] Failed to check subscription:', err);
    res.status(500).json({ error: 'Unable to verify subscription status right now.' });
  }
});

app.post('/api/newsletter/subscribe', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      error: 'Too many requests. Please wait a moment and try again.',
    });
    return;
  }

  const { email, preferences } = req.body || {};
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Please enter your email address.' });
    return;
  }

  const emailNormalized = normalizeEmail(email);
  if (!isValidEmailAddress(emailNormalized)) {
    res.status(400).json({ error: 'Please enter a valid email address (e.g., student@university.edu).' });
    return;
  }

  const normalizedPrefs = normalizePreferences(preferences);
  if (normalizedPrefs.length === 0) {
    res.status(400).json({ error: 'Please select at least one opportunity preference.' });
    return;
  }

  const emailDeliveryConfigured = isEmailDeliveryConfigured();

  try {
    const result = await withStoreLock(async () => {
      const store = await readSubscribersStore();
      const existing = store[emailNormalized];

      if (existing && existing.status === 'active') {
        return { duplicate: true as const };
      }

      const now = new Date().toISOString();
      const manageToken = crypto.randomBytes(24).toString('hex');
      const manageTokenHash = hashToken(manageToken);

      const record: NewsletterSubscriberRecord = {
        email: emailNormalized,
        preferences: normalizedPrefs,
        status: 'active',
        manageTokenHash,
        subscribedAt: existing?.subscribedAt || now,
        updatedAt: now,
      };

      store[emailNormalized] = record;
      await writeSubscribersStore(store);

      return {
        duplicate: false as const,
        reactivated: Boolean(existing),
        manageToken,
        record,
      };
    });

    if (result.duplicate) {
      res.status(409).json({
        alreadySubscribed: true,
        emailDeliveryConfigured,
        error: 'This email is already subscribed to opportunity updates. No duplicate subscription was created.',
      });
      return;
    }

    res.status(result.reactivated ? 200 : 201).json({
      success: true,
      alreadySubscribed: false,
      reactivated: result.reactivated,
      manageToken: result.manageToken,
      emailDeliveryConfigured,
      subscription: {
        email: result.record.email,
        preferences: result.record.preferences,
        subscribedAt: result.record.subscribedAt,
        updatedAt: result.record.updatedAt,
      },
      message: emailDeliveryConfigured
        ? 'Your email and opportunity preferences are saved for periodic updates.'
        : 'Your email and opportunity preferences have been saved.',
    });
  } catch (err) {
    console.error('[Newsletter] Subscription persistence error:', err);
    res.status(500).json({
      error: 'Could not save your subscription right now. Please try again.',
    });
  }
});

app.patch('/api/newsletter/preferences', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }

  const { token, preferences } = req.body || {};
  if (!token || typeof token !== 'string') {
    res.status(401).json({ error: 'Subscription management token is required.' });
    return;
  }

  const normalizedPrefs = normalizePreferences(preferences);
  if (normalizedPrefs.length === 0) {
    res.status(400).json({ error: 'Please select at least one opportunity preference.' });
    return;
  }

  try {
    const updated = await withStoreLock(async () => {
      const store = await readSubscribersStore();
      const match = findActiveByToken(store, token);
      if (!match) return null;

      match.preferences = normalizedPrefs;
      match.updatedAt = new Date().toISOString();
      store[match.email] = match;
      await writeSubscribersStore(store);
      return match;
    });

    if (!updated) {
      res.status(404).json({ error: 'Active subscription not found. Please subscribe again.' });
      return;
    }

    res.json({
      success: true,
      emailDeliveryConfigured: isEmailDeliveryConfigured(),
      subscription: {
        email: updated.email,
        preferences: updated.preferences,
        subscribedAt: updated.subscribedAt,
        updatedAt: updated.updatedAt,
      },
      message: 'Opportunity preferences updated.',
    });
  } catch (err) {
    console.error('[Newsletter] Preference update error:', err);
    res.status(500).json({ error: 'Could not update preferences right now. Please try again.' });
  }
});

app.post('/api/newsletter/unsubscribe', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }

  const { token } = req.body || {};
  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Subscription management token is required.' });
    return;
  }

  try {
    const unsubscribedRecord = await withStoreLock(async () => {
      const store = await readSubscribersStore();
      const match = findActiveByToken(store, token);
      if (!match) return null;

      const now = new Date().toISOString();
      match.status = 'unsubscribed';
      match.unsubscribedAt = now;
      match.updatedAt = now;
      match.manageTokenHash = '';
      store[match.email] = match;
      await writeSubscribersStore(store);
      return match;
    });

    if (!unsubscribedRecord) {
      res.status(404).json({ error: 'No active subscription found to unsubscribe.' });
      return;
    }

    res.json({
      success: true,
      emailDeliveryConfigured: isEmailDeliveryConfigured(),
      email: unsubscribedRecord.email,
      message: 'You have been unsubscribed from opportunity updates.',
    });
  } catch (err) {
    console.error('[Newsletter] Unsubscribe error:', err);
    res.status(500).json({ error: 'Could not complete unsubscribe right now. Please try again.' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Campus Connect] Server running on http://0.0.0.0:${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Campus Connect server:', err);
  process.exit(1);
});
