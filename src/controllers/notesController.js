import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    // 1. Починаємо ланцюжок запитів (Query Chaining)
    const notesQuery = Note.find();

    // 2. Додаємо умови через ланцюжок
    notesQuery.where('userId').equals(req.user._id);

    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]);
    }

    // 3. Отримуємо умови з запиту для підрахунку (щоб отримати об'єкт-фільтр)
    const filter = notesQuery.getQuery();

    // 4. Виконуємо запит: паралельно пагіновані дані та підрахунок
    const [notes, totalNotes] = await Promise.all([
      notesQuery.skip(skip).limit(limit).exec(),
      Note.countDocuments(filter),
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

// Інші методи залишаються без змін, оскільки до них претензій не було
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { returnDocument: 'after' },
    );
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
