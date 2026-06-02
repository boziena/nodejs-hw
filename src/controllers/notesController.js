import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);

  const notesQuery = Note.find();
  const countQuery = Note.find();

  if (tag) {
    notesQuery.where('tag').equals(tag);
    countQuery.where('tag').equals(tag);
  }
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    notesQuery.or([{ title: searchRegex }, { content: searchRegex }]);
    countQuery.or([{ title: searchRegex }, { content: searchRegex }]);
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery.skip(skip).limit(Number(perPage)),
    countQuery.countDocuments(),
  ]);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages: Math.ceil(totalNotes / Number(perPage)),
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const updateNote = async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
    returnDocument: 'after',
  });
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).json(note);
};

export const deleteNote = async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.noteId);
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).json(note);
};
