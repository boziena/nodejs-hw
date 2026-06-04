import 'dotenv/config'; // Завантажує змінні середовища першим
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
// Імпорт відповідно до структури папок на скриншоті:
import { connectMongoDB } from './db/connectMongoDB.js';

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

  // Спочатку підключаємось до БД, лише потім слухаємо порт
  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed', err);
      process.exit(1); // Це виправляє "Application exited early"
    });
};
