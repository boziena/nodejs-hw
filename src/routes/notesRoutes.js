import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

// celebrate / joi / validator celebrate(function) + validator ID(noteID)
import { celebrate } from 'celebrate';
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
  getAllNotesSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

//! застосовуємо до всіх роутів нотаток,
//! щоб забезпечити доступ лише для авторизованих користувачів.
router.use('/notes', authenticate);

//! GET (all)
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

//! GET notes/:noteId
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

//! POST
router.post('/notes', celebrate(createNoteSchema), createNote);

//! DELETE
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

//! PATCH
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
