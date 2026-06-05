import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 1. Додайте цей імпорт
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; // 2. Імпортуйте маршрути аутентифікації
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

app.use(express.json());
// 3. Важливо: налаштуйте CORS для роботи з кукі, якщо фронтенд на іншому домені
app.use(
  cors({
    credentials: true,
    origin: true, // Або вкажіть конкретний домен вашого фронтенду
  }),
);

app.use(cookieParser()); // 4. Підключіть cookie-parser
app.use(logger);

// 5. Використовуйте маршрути
app.use('/auth', authRouter); // Маршрути аутентифікації
app.use('/', notesRouter); // Ваші маршрути нотаток

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
