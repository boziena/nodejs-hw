import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';

dotenv.config();

export const setupServer = async () => {
  const app = express();
  await connectMongoDB();

  app.use(express.json());
  app.use(cors());
  app.use(logger);

  app.use('/notes', notesRouter);

  app.use(notFoundHandler);
  app.use(errors()); // Обробка помилок валідації celebrate
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

setupServer();
