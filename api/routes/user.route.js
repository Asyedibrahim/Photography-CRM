import express from 'express';
import { signIn, signUp, signOut, getAllUsers, deleteUser, getUser, editUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/get-users', verifyToken, getAllUsers);
router.delete('/delete-user/:userId', verifyToken, deleteUser);
router.get('/get-user/:id', verifyToken, getUser);
router.put('/edit-user/:id', verifyToken, editUser);

export default router;