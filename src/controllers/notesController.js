import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);

  const query = {};
  if (tag) query.tag = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const notes = await Note.find(query).skip(skip).limit(Number(perPage));
  const totalNotes = await Note.countDocuments(query);

  res.json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages: Math.ceil(totalNotes / Number(perPage)),
    notes,
  });
};
// Решта контролерів (getOne, create, patch, delete) залишаються без змін
