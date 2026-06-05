import createHttpError from 'http-errors';
import { Note } from '../models/note.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllNotes = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const filter = { userId: req.user._id };
  if (tag) filter.tag = tag;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const [notes, totalNotes] = await Promise.all([
    Note.find(filter).skip(skip).limit(perPage),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Successfully found notes!',
    data: {
      data: notes,
      page,
      perPage,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
    },
  });
};

export const getNoteById = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.noteId,
    userId: req.user._id,
  });
  if (!note) throw createHttpError(404, 'Note not found');
  res
    .status(200)
    .json({ status: 200, message: 'Successfully found note!', data: note });
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a note!', data: note });
};

export const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' }, // Вимога ментора
  );
  if (!note) throw createHttpError(404, 'Note not found');
  res
    .status(200)
    .json({ status: 200, message: 'Successfully patched a note!', data: note });
};

export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.noteId,
    userId: req.user._id,
  });
  if (!note) throw createHttpError(404, 'Note not found');
  // Вимога ментора: відповідь 200 з видаленою нотаткою
  res
    .status(200)
    .json({ status: 200, message: 'Successfully deleted a note!', data: note });
};
