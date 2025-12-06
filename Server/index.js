import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { MONGO_URI } from './config.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = Number(process.env.PORT) || 3001;

// CORS configuration - allow multiple frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  FRONTEND_URL,
  'trabajo-integrador-r6qb4bbj3-angels-projects-9d35d66a.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// Connect to MongoDB
connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

import authRouter from './routes/auth.js';
import todosRouter from './routes/todos.js';

// mount routers (keeps the existing paths: /login, /dashboard, /add, /get, etc.)
app.use('/', authRouter);
app.use('/', todosRouter);

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});