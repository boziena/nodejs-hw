import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import { initMongoConnection } from './db/connectMongoDB.js'; // Виправлений шлях

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(logger); // Логер підключено

  app.use('/', notesRouter);

  app.use(notFoundHandler);
  app.use(errors()); // Обробка помилок Celebrate
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  // Спочатку БД, потім сервер
  initMongoConnection().then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  });
};
