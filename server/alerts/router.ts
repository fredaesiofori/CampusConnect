/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, Router } from 'express';
import { AlertNotificationService } from './alertService';

export interface AlertRouterOptions {
  service: AlertNotificationService;
  checkRateLimit: (ip: string) => boolean;
  cronSecret?: string;
}

export function createAlertRouter(options: AlertRouterOptions): Router {
  const router = express.Router();
  const { service, checkRateLimit } = options;

  async function extractAuthenticatedUser(req: Request): Promise<{ uid: string; email?: string } | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const idToken = authHeader.slice(7).trim();
    if (!idToken) return null;
    const store = (service as any).deps?.store;
    if (!store?.adapter?.verifyIdToken) return null;
    return store.adapter.verifyIdToken(idToken);
  }

  router.get('/api/newsletter/status', (_req: Request, res: Response) => {
    const health = service.getHealthStatus();
    res.json({
      firestoreConfigured: health.firestoreConfigured,
      emailDeliveryConfigured: health.emailDeliveryConfigured,
      testingMode: health.testingMode,
      senderIdentity: health.senderIdentity,
      provider: health.providerStatus.provider,
      missingRequirements: health.providerStatus.missingRequirements,
      envStatus: health.envStatus,
    });
  });

  router.get('/api/newsletter/subscription', async (req: Request, res: Response) => {
    const token = typeof req.query.token === 'string' ? req.query.token : undefined;
    try {
      const authUser = await extractAuthenticatedUser(req);
      const result = await service.lookupSubscription({
        manageToken: token,
        uid: authUser?.uid,
        email: authUser?.email,
      });
      res.status(result.statusCode).json(result.body);
    } catch (err) {
      console.error('[Newsletter] Subscription lookup error:', err);
      res.status(500).json({ error: 'Unable to verify subscription status right now.' });
    }
  });

  router.post('/api/newsletter/subscribe', async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.',
      });
      return;
    }

    try {
      const authUser = await extractAuthenticatedUser(req);
      const {
        email,
        preferences,
        preferredDestinations,
        intendedDegree,
        fieldOfStudy,
        frequency,
      } = req.body || {};

      const requestOrigin =
        req.headers.origin ||
        (req.headers.host ? `${req.protocol}://${req.headers.host}` : undefined);

      const result = await service.subscribe({
        email,
        preferences,
        uid: authUser?.uid,
        preferredDestinations,
        intendedDegree,
        fieldOfStudy,
        frequency,
        requestOrigin,
      });
      res.status(result.statusCode).json(result.body);
    } catch (err) {
      console.error('[Newsletter] Subscription persistence error:', err);
      res.status(500).json({
        error: 'Could not save your subscription right now. Please try again.',
      });
    }
  });

  const handleConfirm = async (req: Request, res: Response) => {
    const token =
      (typeof req.query.token === 'string' ? req.query.token : '') ||
      (typeof req.body?.token === 'string' ? req.body.token : '');

    if (!token) {
      res.status(400).json({ confirmed: false, error: 'Confirmation token is required.' });
      return;
    }

    try {
      const requestOrigin =
        req.headers.origin ||
        (req.headers.host ? `${req.protocol}://${req.headers.host}` : undefined);
      const result = await service.confirmByToken(token, requestOrigin);
      res.status(result.statusCode).json(result.body);
    } catch (err) {
      console.error('[Newsletter] Confirmation error:', err);
      res.status(500).json({ confirmed: false, error: 'Unable to confirm subscription right now.' });
    }
  };

  router.get('/api/newsletter/confirm', handleConfirm);
  router.post('/api/newsletter/confirm', handleConfirm);

  router.patch('/api/newsletter/preferences', async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
      return;
    }

    try {
      const authUser = await extractAuthenticatedUser(req);
      const {
        token,
        preferences,
        frequency,
        preferredDestinations,
        intendedDegree,
        fieldOfStudy,
      } = req.body || {};

      if (!token && !authUser?.uid) {
        res.status(401).json({ error: 'Subscription management token or authenticated session is required.' });
        return;
      }

      const result = await service.updatePreferences({
        manageToken: typeof token === 'string' ? token : undefined,
        uid: authUser?.uid,
        email: authUser?.email,
        preferences,
        frequency,
        preferredDestinations,
        intendedDegree,
        fieldOfStudy,
      });
      res.status(result.statusCode).json(result.body);
    } catch (err) {
      console.error('[Newsletter] Preference update error:', err);
      res.status(500).json({ error: 'Could not update preferences right now. Please try again.' });
    }
  });

  const handleUnsubscribe = async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
      return;
    }

    try {
      const authUser = await extractAuthenticatedUser(req);
      const token =
        (typeof req.body?.token === 'string' ? req.body.token : '') ||
        (typeof req.query.token === 'string' ? req.query.token : '');

      if (!token && !authUser?.uid) {
        res.status(400).json({ error: 'Subscription management or unsubscribe token is required.' });
        return;
      }

      const result = await service.unsubscribe({
        token: token || undefined,
        uid: authUser?.uid,
        email: authUser?.email,
      });
      res.status(result.statusCode).json(result.body);
    } catch (err) {
      console.error('[Newsletter] Unsubscribe error:', err);
      res.status(500).json({ error: 'Could not complete unsubscribe right now. Please try again.' });
    }
  };

  router.post('/api/newsletter/unsubscribe', handleUnsubscribe);
  router.get('/api/newsletter/unsubscribe', handleUnsubscribe);

  router.post('/api/alerts/cron/deadlines', async (req: Request, res: Response) => {
    const expectedSecret = (options.cronSecret ?? process.env.ALERT_CRON_SECRET)?.trim();
    if (!expectedSecret) {
      res.status(503).json({
        error: 'ALERT_CRON_SECRET is not configured on the server.',
      });
      return;
    }

    const authHeader = req.headers.authorization || '';
    const provided = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!provided || provided !== expectedSecret) {
      res.status(401).json({ error: 'Unauthorized deadline reminder trigger.' });
      return;
    }

    try {
      const dryRun = Boolean(req.body?.dryRun);
      const windowDays =
        typeof req.body?.windowDays === 'number' && req.body.windowDays >= 1 && req.body.windowDays <= 60
          ? req.body.windowDays
          : 21;

      const summary = await service.runDeadlineReminderJob({
        dryRun,
        windowDays,
      });

      res.status(summary.executed ? 200 : 503).json(summary);
    } catch (err: any) {
      console.error('[Alerts/Cron] Deadline job error:', err?.message);
      res.status(500).json({ error: 'Deadline reminder job failed.' });
    }
  });

  return router;
}
