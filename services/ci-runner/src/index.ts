import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
import deployRouter from './routes/deploy';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(express.json());

// Routes
app.post('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/', deployRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  logger.info(`CI Runner service listening on port ${port}`);
}); 