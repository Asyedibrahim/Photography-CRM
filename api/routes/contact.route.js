import express from 'express';
import { addContact, getAllContacts, deleteContact, getContact, updateContact } from '../controllers/contact.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add-contact', verifyToken, addContact);
router.get('/get-contacts', verifyToken, getAllContacts);
router.delete('/delete-contact/:cusId', verifyToken, deleteContact);
router.get('/getContact/:cusId', getContact);
router.put('/update-contact/:cusId', verifyToken, updateContact);

export default router;