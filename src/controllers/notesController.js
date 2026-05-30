import { Note } from '../models/note.js';
import createError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  const result = await Note.find();
  res.status(200).json({ status: 200, message: 'Success', data: result });
};

export const updateNote = async (req, res, next) => {
  const { id } = req.params;
  const result = await Note.findByIdAndUpdate(id, req.body, {
    returnDocument: 'after', // Новий стандарт Mongoose 9
  });

  if (!result) return next(createError(404, 'Note not found'));

  res.status(200).json({ status: 200, message: 'Updated', data: result });
};
