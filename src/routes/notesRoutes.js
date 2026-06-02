import { Router } from 'express';
import * as ctrl from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/', getAllNotesSchema, ctrl.getAllNotes);
router.post('/', createNoteSchema, ctrl.createNote);
router.get('/:noteId', noteIdSchema, ctrl.getNoteById);
router.patch('/:noteId', updateNoteSchema, ctrl.updateNote);
router.delete('/:noteId', noteIdSchema, ctrl.deleteNote);

export default router;
