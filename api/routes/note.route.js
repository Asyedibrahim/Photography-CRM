import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/note.controller.js';

const router = express.Router();

router.post('/createNote/:contactId', createNote);
router.get('/getNotes/:contactId', getNotes);
router.delete('/deleteNote/:noteId', deleteNote);

export default router;