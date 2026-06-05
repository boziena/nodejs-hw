import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// celebrate(validator)
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
// Errors
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
// routes
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

//! старт
const app = express();
const PORT = process.env.PORT || 3000;

//! Mongo
await connectMongoDB();

//! Middleware
app.use(helmet());
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//! Роутc
app.use(notesRouter);
app.use(authRouter);
app.use(userRoutes);

//! Errors
// middleware 404
app.use(notFoundHandler);
// celebrate(validator)
app.use(errors());
// error 500
app.use(errorHandler);

//! взлітаємо
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
