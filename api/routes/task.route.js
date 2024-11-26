import express from 'express';
import { createTask, getTasks, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/createTask/:contactId', createTask);
router.get('/getTasks/:contactId', getTasks);
router.delete('/deleteTask/:taskId', deleteTask);

export default router;