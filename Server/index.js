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

app.use(
  cors({
    origin: DEV_URL,
    methods: ["POST", "GET", "PUT", "DELETE","UPDATE"],
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// Connect to MongoDB
connect("mongodb+srv://root:root@clustertest1.93hj08z.mongodb.net/TodoApp" )
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