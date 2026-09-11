import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*', // Allow local frontend and external competition testers
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/chat', chatRouter);
app.use('/api/chat', chatRouter); // Alias for flexible integration

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SickBro - SDG 3 Health Awareness API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'SickBro API',
    description: 'Personalized Health Awareness & SDG 3 Coach API',
    endpoints: {
      'POST /chat': 'Send a health message and get personalized guidance',
      'GET /health': 'Health check status',
    },
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`[SickBro Server] Running on http://localhost:${PORT}`);
  console.log(`[SickBro Server] Health endpoint: http://localhost:${PORT}/health`);
  console.log(`[SickBro Server] Chat endpoint: http://localhost:${PORT}/chat`);
});

export default app;
