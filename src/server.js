import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
// ЦЕЙ ІМПОРТ МАЄ БУТИ connectMongoDB, БО САМЕ ЦЕ У ВАС ЕКСПОРТУЄТЬСЯ
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/', notesRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// ВИКЛИКАЄМО САМЕ connectMongoDB
connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
