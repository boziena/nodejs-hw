import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    // 1. Формуємо ЧИСТИЙ об'єкт фільтра
    const filter = { userId: req.user._id };
    if (tag) filter.tag = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Використовуємо цей же об'єкт для обох операцій
    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(limit).exec(),
      Note.countDocuments(filter), // Тепер тут передається об'єкт, а не query
    ]);

    res.status(200).json({
      page: parseInt(page),
      perPage: limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      notes: notes,
    });
  } catch (err) {
    next(err);
  }
};

