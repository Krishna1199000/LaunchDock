import { createHmac, timingSafeEqual } from 'crypto';

export function validateGitHubWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const hmac = createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  const checksum = `sha256=${digest}`;

  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(checksum)
  );
}

export function extractBranch(ref: string): string {
  return ref.replace('refs/heads/', '');
} 