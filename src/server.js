import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

// Ваші модулі (з розширенням .js)
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Маршрути
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Функція для запуску сервера, щоб асинхронний await працював коректно
const startServer = async () => {
  try {
    //! Підключення до Mongo
    await connectMongoDB();
    console.log('Database connection successful');

    //! Middleware
    app.use(helmet());
    app.use(logger);
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    //! Роути
    app.use(notesRouter);
    app.use(authRouter);
    app.use(userRoutes);

    //! Обробка помилок
    app.use(notFoundHandler); // 404
    app.use(errors()); // Celebrate
    app.use(errorHandler); // 500

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
