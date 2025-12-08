import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;
const DEV_URL = 'http://localhost:5173';
const PROD_URL = process.env.FRONTEND_URL;
const PORT = Number(process.env.PORT) || 3001;

// CORS configuration - allow multiple frontend URLs
const allowedOrigins = [
  DEV_URL,
  PROD_URL,
];
app.send(DEV_URL);
app.use(
  cors({
    origin: "https://trabajo-integrador-ashen.vercel.app",
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// Connect to MongoDB
connect(MONGO_URI )
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