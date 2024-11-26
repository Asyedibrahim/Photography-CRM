import db from '../config/config.js';
import { errorHandler } from '../utils/error.js';

export const addContact = async (req, res, next) => {
    
    const { name, phone, email, address, stage, status } = req.body;

    // Start the transaction
    db.beginTransaction((err) => {
        if (err) {
            return next(errorHandler(500, 'Error starting transaction'));
        };

        // Insert contact data
        const contactQuery = 'INSERT INTO contacts (name, phone, email, address, stage, status) VALUES (?,?,?,?,?,?)';
        db.query(contactQuery, [name, phone, email, address, stage, status], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    next(errorHandler(500, 'Error adding contact'));
                });
            };

            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        next(errorHandler(500, 'Error committing transaction'));
                    });
                };

                const newContact = { id: result.insertId, name, phone, email, address, stage, status };
                res.status(200).json({
                    message: 'Contact added successfully!',
                    contact: newContact
                });
            });
        });
    });
};

export const getAllContacts = async (req, res, next) => {
    db.query('SELECT * FROM contacts', (err, contacts) => {
        if (err) {
            return next(err);
        }

        if (contacts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(contacts);
    });
};


export const deleteContact = async (req, res, next) => {

    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to delete the contact'));
    }

    db.query('DELETE FROM contacts WHERE id = ?', [req.params.cusId], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json('Contact has been deleted!')
        }
    });
};

export const getContact = async (req, res, next) => {

    db.query('SELECT * FROM contacts WHERE id = ?', [req.params.cusId], (err, contacts) => {
        if (err) {
            return next(err)
        }

        if (contacts.length === 0) {
            return res.status(404).json({ message: 'Contact not found!' });
        }
        res.status(200).json(contacts);
    });
};

export const updateContact = async (req, res, next) => {
    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to update the contact'));
    }

    const { name, phone, email, address, stage, status } = req.body;

    try {
        // Fetch existing contact data
        const [contacts] = await db.promise().query('SELECT * FROM contacts WHERE id = ?', [req.params.cusId]);

        if (contacts.length === 0) {
            return res.status(404).json({ message: 'Contact not found!' });
        }

        const existingContact = contacts[0];

        // Update contact details or keep existing values if not provided
        const updatedName = name || existingContact.name;
        const updatedPhone = phone || existingContact.phone;
        const updatedEmail = email || existingContact.email;
        const updatedAddress = address || existingContact.address;
        const updatedStage = stage || existingContact.stage;
        const updatedStatus = status || existingContact.status;

        // Update contact query
        const updateContactQuery = `
            UPDATE contacts 
            SET name = ?, phone = ?, email = ?, address = ?, stage = ?, status = ?
            WHERE id = ?`;

        await db.promise().query(updateContactQuery, [updatedName, updatedPhone, updatedEmail, updatedAddress, updatedStage, updatedStatus, req.params.cusId]);

        res.status(200).json('Contact details updated successfully');
    } catch (err) {
        return next(err);
    }
};

