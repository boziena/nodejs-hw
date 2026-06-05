import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

//! GET
export const getAllNotes = async (req, res) => {
  // Отримуємо параметри пагінації
  // і задаємо дефолтні значення
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції + //? Додаємо ID
  const notesQuery = Note.find({ userId: req.user._id });

  // Фільтр по Тегу
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Фільтр-пошук по слову в title або content $regex
  if (search) {
    notesQuery.or([
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]);
  }

  // Пагінація (клонований + оригінальний потім налаштування (клонів скільки завгодно!))
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

//! GET /:ID
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  //? змінили з findById на findOne + додали ID
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

//! POST
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    //? додали для ID («привʼязувати кожну нотатку для певного користувача»)
    userId: req.user._id,
  });
  res.status(201).json(note);
};

//! DELETE
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  //? додали для ID
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

//! PATCH
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  //? додали для ID
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
