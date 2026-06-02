import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as ctrl from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/', celebrate(getAllNotesSchema), ctrl.getAllNotes);
router.post('/', celebrate(createNoteSchema), ctrl.createNote);
router.get('/:noteId', celebrate(noteIdSchema), ctrl.getNoteById);
router.patch('/:noteId', celebrate(updateNoteSchema), ctrl.updateNote);
router.delete('/:noteId', celebrate(noteIdSchema), ctrl.deleteNote);

export default router;
