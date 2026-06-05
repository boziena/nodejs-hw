import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as ctrl from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { ctrlWrapper } from '../middleware/errorHandler.js';

const router = Router();
router.use(authenticate);

router.get('/', celebrate(getAllNotesSchema), ctrlWrapper(ctrl.getAllNotes));
router.post('/', celebrate(createNoteSchema), ctrlWrapper(ctrl.createNote));
router.get('/:noteId', celebrate(noteIdSchema), ctrlWrapper(ctrl.getNoteById));
router.patch(
  '/:noteId',
  celebrate(updateNoteSchema),
  ctrlWrapper(ctrl.updateNote),
);
router.delete(
  '/:noteId',
  celebrate(noteIdSchema),
  ctrlWrapper(ctrl.deleteNote),
);

export default router;
