# GitHub Webhook Service

This service listens to GitHub webhook events and triggers CI/CD actions. It's part of the LaunchDock CI/CD platform.

## Features

- Validates GitHub webhook signatures
- Processes push events
- Extracts relevant commit information
- Triggers downstream CI/CD actions
- Production-grade logging and error handling

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=4001
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
CI_RUNNER_URL=http://localhost:4002/trigger
```

4. Build and start the service:
```bash
pnpm build
pnpm start
```

For development:
```bash
pnpm dev
```

## Testing with ngrok

To test the webhook locally:

1. Install ngrok:
```bash
npm install -g ngrok
```

2. Start the webhook service:
```bash
pnpm dev
```

3. In a new terminal, start ngrok:
```bash
ngrok http 4001
```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

5. Configure your GitHub repository webhook:
   - Go to repository settings
   - Add webhook
   - Set Payload URL to your ngrok URL + `/webhook`
   - Set Content type to `application/json`
   - Set Secret to match your `GITHUB_WEBHOOK_SECRET`
   - Select "Just the push event"
   - Save the webhook

## API Endpoints

### POST /webhook
Receives GitHub webhook events.

Headers required:
- `X-Hub-Signature-256`: GitHub webhook signature
- `X-GitHub-Event`: Event type (e.g., "push")

### POST /ping
Health check endpoint.

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-14T12:00:00.000Z"
}
```

## Development

- `src/index.ts`: Main application entry point
- `src/routes/webhook.ts`: Webhook route handler
- `src/utils/validation.ts`: Webhook signature validation
- `src/utils/logger.ts`: Winston logger configuration
- `src/types/github.ts`: TypeScript types for GitHub payloads 