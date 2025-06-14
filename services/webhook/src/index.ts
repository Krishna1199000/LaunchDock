import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
import webhookRouter from './routes/webhook';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());

// Routes
app.post('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/', webhookRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  logger.info(`Webhook service listening on port ${port}`);
}); 