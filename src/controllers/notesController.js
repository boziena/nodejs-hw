import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    // Реалізуємо пагінацію прямо тут
    const { page = 1, perPage = 10, tag, search } = req.query;
    const parsedPage = Number(page);
    const parsedPerPage = Number(perPage);
    const skip = (parsedPage - 1) * parsedPerPage;

    const filter = { userId: req.user._id };
    if (tag) filter.tag = tag;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(parsedPerPage),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 200,
      message: 'Successfully found notes!',
      data: {
        data: notes,
        page: parsedPage,
        perPage: parsedPerPage,
        totalNotes,
        totalPages: Math.ceil(totalNotes / parsedPerPage),
      },
    });
  } catch (err) {
    next(err); // Обробка помилок без ctrlWrapper
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createHttpError(404, 'Note not found');
    res
      .status(200)
      .json({ status: 200, message: 'Successfully found note!', data: note });
  } catch (err) {
    next(err);
  }
};
// ... і так само для інших методів (update, create, delete)
