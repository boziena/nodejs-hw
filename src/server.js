import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
// Використовуємо саме connectMongoDB, бо так у вас у файлі
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(logger);

  app.use('/', notesRouter);

  app.use(notFoundHandler);
  app.use(errors());
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  // Викликаємо connectMongoDB()
  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => {
      console.error('Помилка підключення до БД:', err);
    });
};
