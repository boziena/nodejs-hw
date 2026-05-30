import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/', notesController.getAllNotes); // Рядок 6 зазвичай тут
router.patch('/:id', notesController.updateNote);

export default router;
