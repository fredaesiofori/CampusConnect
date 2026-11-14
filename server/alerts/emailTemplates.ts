/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchedOpportunityCard } from './opportunityMatcher';
import { AlertPreferenceId, PREFERENCE_LABELS } from './types';

export interface EmailTemplateOutput {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPrefSummary(preferences: AlertPreferenceId[]): string[] {
  const withoutAll = preferences.filter((p) => p !== 'all');
  if (preferences.includes('all') && withoutAll.length >= 6) {
    return ['All Global Opportunities'];
  }
  return (preferences.length > 0 ? withoutAll : (['all'] as AlertPreferenceId[])).map(
    (id) => PREFERENCE_LABELS[id] || id
  );
}

function wrapCampusConnectLayout(params: {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  manageUrl?: string;
  unsubscribeUrl?: string;
}): string {
  const manageLinkHtml = params.manageUrl
    ? `<a href="${escapeHtml(params.manageUrl)}" style="color:#6846F5;text-decoration:underline;font-weight:600;">Update Preferences</a>`
    : '';
  const unsubscribeLinkHtml = params.unsubscribeUrl
    ? `<a href="${escapeHtml(params.unsubscribeUrl)}" style="color:#64748B;text-decoration:underline;">Unsubscribe</a>`
    : '';
  const separator = manageLinkHtml && unsubscribeLinkHtml ? ' &nbsp;&bull;&nbsp; ' : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.heading)}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .cc-container { width: 100% !important; border-radius: 0 !important; }
      .cc-pad { padding: 20px 16px !important; }
      .cc-btn { display: block !important; width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;">
    ${escapeHtml(params.preheader)}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F1F5F9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="cc-container" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 16px rgba(16,19,45,0.06);">
          <!-- Brand Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#10132D 0%,#1E214F 100%);padding:24px 28px;" class="cc-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:rgba(231,183,92,0.16);border:1px solid rgba(231,183,92,0.4);color:#E7B75C;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                      ${escapeHtml(params.eyebrow)}
                    </span>
                    <div style="margin-top:10px;font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">
                      Campus Connect
                    </div>
                    <div style="font-size:12px;color:#CBD5E1;margin-top:2px;">
                      Global University, Admissions &amp; Educational Opportunities Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:28px;" class="cc-pad">
              <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;font-weight:800;color:#10132D;">
                ${escapeHtml(params.heading)}
              </h1>
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#334155;">
                ${escapeHtml(params.intro)}
              </p>
              ${params.bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC;border-top:1px solid #E2E8F0;padding:20px 28px;font-size:12px;line-height:1.6;color:#64748B;" class="cc-pad">
              <p style="margin:0 0 8px 0;">
                You received this message because you requested Campus Connect opportunity updates. We only share verified university admissions, fee waivers, test-optional policies, scholarships, and deadlines.
              </p>
              ${
                manageLinkHtml || unsubscribeLinkHtml
                  ? `<p style="margin:0 0 8px 0;">${manageLinkHtml}${separator}${unsubscribeLinkHtml}</p>`
                  : ''
              }
              <p style="margin:0;color:#94A3B8;">
                Always verify final submission dates on official institutional admissions portals.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderOpportunityCardsHtml(cards: MatchedOpportunityCard[]): string {
  if (cards.length === 0) return '';
  return cards
    .map((card) => {
      const deadlineBadge =
        typeof card.daysUntilDeadline === 'number'
          ? `Closing in ${card.daysUntilDeadline} day${card.daysUntilDeadline === 1 ? '' : 's'} (${card.deadlineDisplay})`
          : card.deadlineDisplay;

      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;border:1px solid #E2E8F0;border-radius:12px;background-color:#F8FAFC;">
        <tr>
          <td style="padding:16px;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6846F5;margin-bottom:4px;">
              ${escapeHtml(card.country)}${card.city ? ` &bull; ${escapeHtml(card.city)}` : ''}
            </div>
            <div style="font-size:16px;font-weight:800;color:#10132D;line-height:1.35;margin-bottom:6px;">
              ${escapeHtml(card.officialName)}
            </div>
            <div style="font-size:13px;color:#334155;line-height:1.5;margin-bottom:10px;">
              <strong>Funding:</strong> ${escapeHtml(card.fundingBadge)} &nbsp;|&nbsp;
              <strong>Application Fee:</strong> ${escapeHtml(card.feeBadge)} &nbsp;|&nbsp;
              <strong>Tests:</strong> ${escapeHtml(card.testBadge)}
            </div>
            <div style="font-size:12px;font-weight:600;color:#B45309;background-color:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;padding:6px 10px;display:inline-block;margin-bottom:12px;">
              Deadline: ${escapeHtml(deadlineBadge)}
            </div>
            <div>
              <a href="${escapeHtml(card.officialUrl)}" target="_blank" rel="noopener noreferrer" class="cc-btn" style="display:inline-block;padding:10px 16px;background-color:#10132D;color:#FFFFFF;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                Visit Official Portal &rarr;
              </a>
            </div>
          </td>
        </tr>
      </table>`;
    })
    .join('');
}

export function buildConfirmationEmail(params: {
  confirmUrl: string;
  unsubscribeUrl: string;
  preferences: AlertPreferenceId[];
}): EmailTemplateOutput {
  const prefLabels = formatPrefSummary(params.preferences);
  const subject = 'Confirm your Campus Connect Opportunity Alerts subscription';

  const bodyHtml = `
    <div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">
        Selected Alert Preferences
      </div>
      <div style="font-size:14px;color:#0F172A;line-height:1.6;">
        ${prefLabels.map((l) => `&bull; ${escapeHtml(l)}`).join('<br />')}
      </div>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0;">
      <tr>
        <td>
          <a href="${escapeHtml(params.confirmUrl)}" class="cc-btn" style="display:inline-block;padding:14px 24px;background-color:#6846F5;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;">
            Confirm My Subscription
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#64748B;">
      If the button does not work, copy and paste this link into your browser:<br />
      <a href="${escapeHtml(params.confirmUrl)}" style="color:#6846F5;word-break:break-all;">${escapeHtml(params.confirmUrl)}</a>
    </p>`;

  const html = wrapCampusConnectLayout({
    preheader: 'One click to confirm your verified university admissions, waiver, and scholarship alerts.',
    eyebrow: 'Confirm Subscription',
    heading: 'Confirm your Opportunity Alerts subscription',
    intro:
      'Thank you for subscribing to Campus Connect updates. Please confirm your email address so we can send you verified university admissions, application fee waivers, test-optional options, scholarships, and upcoming deadline reminders.',
    bodyHtml,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  const text = [
    'Campus Connect — Confirm Your Opportunity Alerts Subscription',
    '',
    'Selected preferences:',
    ...prefLabels.map((l) => `- ${l}`),
    '',
    'Confirm your subscription here:',
    params.confirmUrl,
    '',
    'Did not request this? Unsubscribe immediately:',
    params.unsubscribeUrl,
  ].join('\n');

  return { subject, html, text };
}

export function buildWelcomeDigestEmail(params: {
  preferences: AlertPreferenceId[];
  opportunities: MatchedOpportunityCard[];
  manageUrl: string;
  unsubscribeUrl: string;
}): EmailTemplateOutput {
  const prefLabels = formatPrefSummary(params.preferences);
  const subject = 'You are confirmed: Your verified Campus Connect opportunities';

  const bodyHtml = `
    <div style="background-color:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#065F46;">
      <strong>Subscription Confirmed:</strong> Receiving alerts for ${escapeHtml(prefLabels.join(', '))}.
    </div>
    <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:800;color:#10132D;">
      Matched Verified Opportunities Open Right Now
    </h2>
    ${renderOpportunityCardsHtml(params.opportunities)}`;

  const html = wrapCampusConnectLayout({
    preheader: `Your Campus Connect alerts are active. Explore ${params.opportunities.length} verified matches.`,
    eyebrow: 'Alerts Active',
    heading: 'Welcome to Campus Connect Opportunity Alerts',
    intro:
      'Your email is confirmed. Below are verified universities and study opportunities currently matched to your alert preferences.',
    bodyHtml,
    manageUrl: params.manageUrl,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  const textLines = [
    'Welcome to Campus Connect Opportunity Alerts!',
    `Active preferences: ${prefLabels.join(', ')}`,
    '',
    'Matched Verified Opportunities:',
    ...params.opportunities.flatMap((o) => [
      `* ${o.officialName} (${o.country})`,
      `  Funding: ${o.fundingBadge} | Fee: ${o.feeBadge} | Tests: ${o.testBadge}`,
      `  Deadline: ${o.deadlineDisplay}`,
      `  Official Portal: ${o.officialUrl}`,
      '',
    ]),
    `Update preferences: ${params.manageUrl}`,
    `Unsubscribe: ${params.unsubscribeUrl}`,
  ];

  return { subject, html, text: textLines.join('\n') };
}

export function buildDeadlineReminderEmail(params: {
  opportunities: MatchedOpportunityCard[];
  manageUrl: string;
  unsubscribeUrl: string;
}): EmailTemplateOutput {
  const soonest = params.opportunities[0];
  const subject =
    params.opportunities.length === 1 && soonest
      ? `Deadline Reminder: ${soonest.officialName} (${soonest.deadlineDisplay})`
      : `Upcoming Application Deadlines: ${params.opportunities.length} Verified Opportunities Closing Soon`;

  const bodyHtml = `
    <div style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#92400E;">
      <strong>Verified Deadline Alert:</strong> Only open, verified programs matching your Campus Connect alert preferences are listed below.
    </div>
    ${renderOpportunityCardsHtml(params.opportunities)}`;

  const html = wrapCampusConnectLayout({
    preheader: `${params.opportunities.length} verified university or scholarship deadline${params.opportunities.length === 1 ? '' : 's'} closing soon.`,
    eyebrow: 'Deadline Reminder',
    heading: 'Upcoming Verified Application Deadlines',
    intro:
      'The verified institutions and programs below have upcoming application deadlines matching your preferences. Review requirements and submit directly on the official university portal.',
    bodyHtml,
    manageUrl: params.manageUrl,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  const textLines = [
    'Campus Connect — Upcoming Verified Deadline Reminders',
    '',
    ...params.opportunities.flatMap((o) => [
      `* ${o.officialName} (${o.country})`,
      `  Deadline: ${o.deadlineDisplay}`,
      `  Funding: ${o.fundingBadge} | Fee: ${o.feeBadge} | Tests: ${o.testBadge}`,
      `  Official Portal: ${o.officialUrl}`,
      '',
    ]),
    `Update preferences: ${params.manageUrl}`,
    `Unsubscribe: ${params.unsubscribeUrl}`,
  ];

  return { subject, html, text: textLines.join('\n') };
}

export function buildPersonalizedOpportunityEmail(params: {
  studentName?: string;
  matchedReasons?: string[];
  opportunities: MatchedOpportunityCard[];
  manageUrl: string;
  unsubscribeUrl: string;
}): EmailTemplateOutput {
  const count = params.opportunities.length;
  const first = params.opportunities[0];
  const subject =
    count === 1 && first
      ? `New Opportunity Match: ${first.officialName} (${first.country})`
      : `${count} Verified Educational Opportunities Matching Your Profile`;

  const reasonsHtml =
    params.matchedReasons && params.matchedReasons.length > 0
      ? `<div style="background-color:#F0EDFF;border:1px solid #DDD6FE;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#4338CA;">
          <strong>Matched to Your Profile:</strong> ${escapeHtml(params.matchedReasons.join(' · '))}
        </div>`
      : '';

  const bodyHtml = `
    ${reasonsHtml}
    ${renderOpportunityCardsHtml(params.opportunities)}`;

  const greetingName = params.studentName?.trim() ? `Hi ${params.studentName.trim()}, ` : '';
  const html = wrapCampusConnectLayout({
    preheader: `${count} verified program${count === 1 ? '' : 's'} matching your Campus Connect study profile and preferences.`,
    eyebrow: 'Personalized Match',
    heading: 'New & Updated Opportunities Matching Your Profile',
    intro: `${greetingName}Campus Connect found ${count} verified educational opportunit${
      count === 1 ? 'y' : 'ies'
    } aligned with your preferred study destinations, degree level, funding, or waiver goals.`,
    bodyHtml,
    manageUrl: params.manageUrl,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  const textLines = [
    'Campus Connect — Personalized Opportunity Matches',
    '',
    ...(params.matchedReasons?.length
      ? [`Matched criteria: ${params.matchedReasons.join(', ')}`, '']
      : []),
    ...params.opportunities.flatMap((o) => [
      `* ${o.officialName} (${o.country})`,
      `  Funding: ${o.fundingBadge} | Fee: ${o.feeBadge} | Tests: ${o.testBadge}`,
      `  Deadline: ${o.deadlineDisplay}`,
      `  Official Portal: ${o.officialUrl}`,
      '',
    ]),
    `Update preferences: ${params.manageUrl}`,
    `Unsubscribe: ${params.unsubscribeUrl}`,
  ];

  return { subject, html, text: textLines.join('\n') };
}

export function buildApplicationChecklistReminderEmail(params: {
  studentName?: string;
  applications: Array<{
    officialName: string;
    country: string;
    stage: string;
    completedCount: number;
    totalCount: number;
    pendingTasks: string[];
    deadlineDisplay: string;
    followUpDate?: string;
    officialUrl: string;
  }>;
  manageUrl: string;
  unsubscribeUrl: string;
}): EmailTemplateOutput {
  const count = params.applications.length;
  const first = params.applications[0];
  const subject =
    count === 1 && first
      ? `Application Checklist Reminder: ${first.officialName} (${first.pendingTasks.length} tasks remaining)`
      : `Application Progress Reminder: ${count} Active Applications Have Pending Tasks`;

  const cardsHtml = params.applications
    .map((app) => {
      const tasksHtml = app.pendingTasks
        .slice(0, 5)
        .map((t) => `<li style="margin-bottom:4px;">${escapeHtml(t)}</li>`)
        .join('');
      const followUpRow = app.followUpDate
        ? `<div style="font-size:12px;color:#4338CA;font-weight:600;margin-top:6px;">Scheduled Personal Follow-Up: ${escapeHtml(app.followUpDate)}</div>`
        : '';

      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;border:1px solid #E2E8F0;border-radius:12px;background-color:#F8FAFC;">
        <tr>
          <td style="padding:16px;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6846F5;margin-bottom:4px;">
              ${escapeHtml(app.country)} &bull; Stage: ${escapeHtml(app.stage)}
            </div>
            <div style="font-size:16px;font-weight:800;color:#10132D;line-height:1.35;margin-bottom:6px;">
              ${escapeHtml(app.officialName)}
            </div>
            <div style="font-size:13px;color:#334155;margin-bottom:8px;">
              <strong>Checklist Progress:</strong> ${app.completedCount}/${app.totalCount} completed &nbsp;|&nbsp;
              <strong>Deadline:</strong> ${escapeHtml(app.deadlineDisplay)}
            </div>
            ${followUpRow}
            <div style="font-size:12px;font-weight:700;color:#10132D;margin-top:10px;margin-bottom:4px;">
              Remaining Tasks:
            </div>
            <ul style="margin:0 0 12px 18px;padding:0;font-size:13px;color:#475569;line-height:1.5;">
              ${tasksHtml}
            </ul>
            <div>
              <a href="${escapeHtml(app.officialUrl)}" target="_blank" rel="noopener noreferrer" class="cc-btn" style="display:inline-block;padding:10px 16px;background-color:#6846F5;color:#FFFFFF;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                Review Official Portal &rarr;
              </a>
            </div>
          </td>
        </tr>
      </table>`;
    })
    .join('');

  const greetingName = params.studentName?.trim() ? `Hi ${params.studentName.trim()}, ` : '';
  const html = wrapCampusConnectLayout({
    preheader: `${count} active application${count === 1 ? '' : 's'} with pending checklist items or upcoming follow-up dates.`,
    eyebrow: 'Application Checklist',
    heading: 'Keep Your Active Applications on Track',
    intro: `${greetingName}Here is a summary of your active Campus Connect applications that still have pending document tasks or upcoming follow-up reminders.`,
    bodyHtml: cardsHtml,
    manageUrl: params.manageUrl,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  const textLines = [
    'Campus Connect — Application Checklist Reminder',
    '',
    ...params.applications.flatMap((app) => [
      `* ${app.officialName} (${app.country}) — ${app.completedCount}/${app.totalCount} completed`,
      `  Deadline: ${app.deadlineDisplay}`,
      ...(app.followUpDate ? [`  Follow-up Date: ${app.followUpDate}`] : []),
      `  Remaining: ${app.pendingTasks.join('; ')}`,
      `  Portal: ${app.officialUrl}`,
      '',
    ]),
    `Update preferences: ${params.manageUrl}`,
    `Unsubscribe: ${params.unsubscribeUrl}`,
  ];

  return { subject, html, text: textLines.join('\n') };
}

