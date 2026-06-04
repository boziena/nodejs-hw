import express from 'express';
import { errors } from 'celebrate'; // Важливо!
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Ваші роути
app.use('/', notesRouter);

// Обробка помилок (ПОРЯДОК МАЄ ЗНАЧЕННЯ)
app.use(notFoundHandler);
app.use(errors()); // <-- celebrate перехопить помилки валідації тут
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
