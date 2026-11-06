/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
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
  fundingPreference?: string;
  testPreference?: string;
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
// System Instruction for COVA Assistant
// -------------------------------------------------------------
const COVA_SYSTEM_INSTRUCTION = `You are COVA (Campus Opportunity & Virtual Assistant), the intelligent, encouraging, and highly accurate AI advisor for Campus Connect.
Campus Connect is a premier discovery and application platform dedicated to helping international students—especially ambitious scholars across Africa and the Global South—access verified universities, scholarships, application fee waivers, and funding worldwide.

YOUR IDENTITY & TONE:
- Professional, warm, empowering, highly knowledgeable, and clear.
- Speak directly to the student as their trusted educational mentor.
- Be concise yet thorough. Avoid generic filler or repetitive disclaimers.

CRITICAL ACCURACY & GROUNDING RULES:
1. STRICT TRUTHFULNESS: Only recommend real universities, legitimate scholarship programs, and accurate admissions policies. NEVER invent university names, fake scholarship amounts, made-up deadlines, or nonexistent waiver codes.
2. VERIFIED DATA USAGE: When Campus Connect verified opportunity records are provided in the context, integrate them naturally. Highlight their verified benefits (e.g. "$0 Application Fee", "SAT/GRE Optional", "Fully Funded", "WAEC English Accepted").
3. FORMATTING LINKS: Always format university and scholarship portals as clickable markdown links using their exact verified official URL, e.g. [University of Oxford - Admissions Portal](https://www.ox.ac.uk).
4. UNVERIFIED OR UNCERTAIN INFORMATION: If current deadlines, fees, or requirements cannot be verified from the provided data or authoritative knowledge, explicitly say so (e.g., "Deadlines and fee waiver policies vary annually; please confirm directly on the official portal before applying").
5. PERSONALIZATION: When the student's degree, target destination, or field of study is provided, tailor your recommendations directly to their profile.
6. APPLICATION TRACKER & PROGRESS:
   - When the student asks about their existing university or scholarship applications, reference their real records in the provided TARGET TRACKER.
   - Accurately report their actual progress stage (Saved, Preparing Application, Application Submitted, Accepted / Enrolled).
   - If they have no saved universities or want to update their progress, explain that they can confirm stage updates directly on the interactive tracker cards in the chat or in the Target Tracker board.
   - NEVER fabricate application statuses or claim an application was submitted unless confirmed.
7. APPLICATION GUIDANCE & ROADMAPS:
   - Break down actionable steps (transcripts, WES evaluation, English proficiency waivers like WAEC/NECO for West African students, letters of recommendation, statement of purpose, financial declaration).
   - When students ask for personal statement or motivation letter help, offer clear, structured outlines (Hook/Intro, Academic Background, Projects/Research, Career Vision, Why This University).
8. DEADLINE PRIORITIZATION:
   - Help students prioritize applications based on verified deadlines and cycle urgency. Never invent deadlines or claim reminders were scheduled unless actually confirmed.`;

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/cova/health', (_req: Request, res: Response) => {
  const apiKeyPresent = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    assistantName: 'COVA',
    model: 'gemini-3.8-flash',
    geminiConfigured: apiKeyPresent,
    totalVerifiedOpportunities: authenticOpportunities.length,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// COVA Chat Endpoint (Supports SSE streaming & JSON response)
// -------------------------------------------------------------
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
  studentTracker?: StudentTrackerRecord[];
  stream?: boolean;
}

app.post('/api/cova/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
  console.log(`[COVA] Received chat request from ${clientIp}, stream: ${req.body?.stream}`);

  // 1. Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    console.warn(`[COVA] Rate limit exceeded for ${clientIp}`);
    res.status(429).json({
      error: 'Rate limit exceeded. Please wait a few moments before sending another message.',
    });
    return;
  }

  // 2. Input Validation
  const { message, conversationHistory = [], studentProfile, studentTracker, stream = true } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (message.length > 2000) {
    res.status(400).json({ error: 'Message is too long. Please keep your question under 2,000 characters.' });
    return;
  }

  // 3. API Key Validation
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const missingKeyMessage =
      'COVA AI is currently awaiting its Gemini API key. Please add your GEMINI_API_KEY to AI Studio Secrets (or your environment variables) to enable live AI responses.';

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
    if (studentProfile.intendedDegree) parts.push(`Target Degree: ${studentProfile.intendedDegree}`);
    if (studentProfile.fieldOfStudy) parts.push(`Field of Study: ${studentProfile.fieldOfStudy}`);
    if (studentProfile.preferredDestinations?.length) {
      parts.push(`Preferred Destinations: ${studentProfile.preferredDestinations.join(', ')}`);
    }
    if (studentProfile.fundingPreference) parts.push(`Funding Need: ${studentProfile.fundingPreference}`);
    if (studentProfile.testPreference) parts.push(`Testing Preference: ${studentProfile.testPreference}`);

    if (parts.length > 0) {
      studentContextSummary = `AUTHENTICATED STUDENT PROFILE CONTEXT:\n${parts.join('\n')}\n\n`;
    }
  }

  // Student Application Tracker Context
  let studentTrackerSummary = '';
  let trackerOpportunities: OpportunityItem[] = [];

  if (studentTracker && Array.isArray(studentTracker)) {
    if (studentTracker.length > 0) {
      const lines = studentTracker.map((item, idx) => {
        return `${idx + 1}. [ID: ${item.id}] ${item.officialName} (${item.country}) | Stage: "${item.stage}" | Deadline: ${item.deadlineText || 'Rolling'} | Fee: ${item.feeStatus || 'Standard'} | Funding: ${item.fundingType || 'Standard'}`;
      });
      studentTrackerSummary = `AUTHENTICATED STUDENT TARGET TRACKER (CURRENT SAVED APPLICATIONS):\n${lines.join('\n')}\n\n`;

      const cleanLower = message.toLowerCase();
      const isTrackerQuery =
        cleanLower.includes('tracker') ||
        cleanLower.includes('my application') ||
        cleanLower.includes('my applications') ||
        cleanLower.includes('status') ||
        cleanLower.includes('preparing') ||
        cleanLower.includes('submitted') ||
        cleanLower.includes('accepted') ||
        cleanLower.includes('saved') ||
        studentTracker.some((t) => cleanLower.includes(t.officialName.toLowerCase()) || cleanLower.includes(t.id));

      if (isTrackerQuery) {
        const trackerIds = new Set(studentTracker.map((t) => t.id));
        trackerOpportunities = authenticOpportunities.filter(
          (opp) =>
            trackerIds.has(opp.id) ||
            studentTracker.some(
              (t) =>
                opp.id.includes(t.id) ||
                t.id.includes(opp.id) ||
                (opp.officialName && t.officialName && opp.officialName.toLowerCase().includes(t.officialName.toLowerCase()))
            )
        );
      }
    } else {
      studentTrackerSummary = `AUTHENTICATED STUDENT TARGET TRACKER:\nThe student currently has 0 saved or tracked universities.\n\n`;
    }
  }

  // 5. Build Gemini API Contents
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Filter and sanitize past turns (limit to last 8 turns for responsive latency)
    const recentHistory = conversationHistory.slice(-8);
    for (const turn of recentHistory) {
      if (turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.content === 'string') {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.content }],
        });
      }
    }

    // Add current user turn augmented with student profile, tracker context, and grounding
    const augmentedUserTurn = `${studentContextSummary}${studentTrackerSummary}${groundingContext}\n\nSTUDENT INQUIRY:\n${message.trim()}`;
    contents.push({
      role: 'user',
      parts: [{ text: augmentedUserTurn }],
    });

    // Helper to extract user-friendly error messages
    const extractCleanErrorMessage = (err: any): string => {
      if (!err) return 'An unexpected error occurred while communicating with COVA. Please try again.';
      const msg = err.message || String(err);
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.error?.message) {
          if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
            return 'Gemini AI is currently experiencing high demand. Please try again in a few moments.';
          }
          return parsed.error.message;
        }
      } catch {
        // Not JSON
      }
      return msg;
    };

    if (stream) {
      // 6a. SSE Streaming Response with resilient model fallback
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      let responseStream;
      try {
        responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: COVA_SYSTEM_INSTRUCTION,
            temperature: 0.65,
          },
        });
      } catch (err: any) {
        console.warn('Primary model gemini-3.8-flash unavailable, attempting fallback to gemini-3.1-flash-lite:', err?.message);
        try {
          responseStream = await ai.models.generateContentStream({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              temperature: 0.65,
            },
          });
        } catch (liteErr: any) {
          console.warn('Fallback to gemini-3.1-flash-lite failed, attempting gemini-flash-latest:', liteErr?.message);
          responseStream = await ai.models.generateContentStream({
            model: 'gemini-flash-latest',
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              temperature: 0.65,
            },
          });
        }
      }

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }

      const topMatches = relevantOpportunities.slice(0, 4);
      const followUps = generateFollowUpSuggestions(message, relevantOpportunities);

      if (topMatches.length > 0 || followUps.length > 0 || trackerOpportunities.length > 0) {
        res.write(`data: ${JSON.stringify({ matchedOpportunities: topMatches, followUps, trackerOpportunities })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // 6b. Non-Streaming JSON Response with resilient model fallback
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: COVA_SYSTEM_INSTRUCTION,
            temperature: 0.65,
          },
        });
      } catch (err: any) {
        console.warn('Primary model gemini-3.8-flash unavailable, attempting fallback to gemini-3.1-flash-lite:', err?.message);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              temperature: 0.65,
            },
          });
        } catch {
          response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents,
            config: {
              systemInstruction: COVA_SYSTEM_INSTRUCTION,
              temperature: 0.65,
            },
          });
        }
      }

      const topMatches = relevantOpportunities.slice(0, 4);
      const followUps = generateFollowUpSuggestions(message, relevantOpportunities);

      res.json({
        response: response.text || '',
        matchedOpportunities: topMatches,
        trackerOpportunities,
        followUps,
        matchedOpportunitiesCount: relevantOpportunities.length,
      });
    }
  } catch (error: any) {
    console.error('COVA Gemini generation error:', error);
    const friendlyMessage =
      (error && typeof error === 'object' && 'message' in error)
        ? (error.message.includes('high demand') || error.message.includes('503') || error.message.includes('UNAVAILABLE')
            ? 'Gemini AI is currently experiencing high demand. Please try again in a few moments.'
            : error.message)
        : 'An unexpected error occurred while communicating with COVA. Please try again.';

    if (stream && !res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`event: error\ndata: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
      res.end();
    } else if (stream && res.headersSent) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: friendlyMessage });
    }
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
