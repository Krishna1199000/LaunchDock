import { Router, Request, Response } from 'express';
import { validateGitHubWebhook, extractBranch } from '../utils/validation';
import logger from '../utils/logger';
import { GitHubPushPayload } from '../types/github';

const router = Router();

router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const eventType = req.headers['x-github-event'] as string;

  // Validate webhook signature
  if (!validateGitHubWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.GITHUB_WEBHOOK_SECRET || ''
  )) {
    logger.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Handle push events
  if (eventType === 'push') {
    const payload = req.body as GitHubPushPayload;
    const branch = extractBranch(payload.ref);
    
    // Extract relevant information
    const eventInfo = {
      repository: payload.repository.name,
      branch,
      commitHash: payload.after,
      username: payload.pusher.name,
      commitMessage: payload.commits[0]?.message || 'No commit message',
    };

    logger.info('Received push event', eventInfo);

    try {
      // Simulate triggering CI/CD
      const ciRunnerUrl = process.env.CI_RUNNER_URL;
      if (ciRunnerUrl) {
        // In a real implementation, you would make an HTTP request to the CI runner
        logger.info(`Would trigger CI/CD at ${ciRunnerUrl}`, eventInfo);
      }

      return res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      logger.error('Error processing webhook', { error });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(400).json({ error: 'Unsupported event type' });
});

export default router; 