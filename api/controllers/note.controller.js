import db from "../config/config.js";

export const createNote = (req, res, next) => {
    const { contactId } = req.params;
    const { note } = req.body;

    // Validate input
    if (!note) {
        return res.status(400).json({ message: 'Note content is required.' });
    }

    // Insert the note into the database
    const sql = `INSERT INTO notes (contact_id, note_content, created_at) VALUES (?, ?, NOW())`;
    db.query(sql, [contactId, note], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(201).json({ message: 'Note created successfully.' });
    });
};

export const getNotes = (req, res, next) => {

    const { contactId } = req.params;

    const sql = `SELECT id, note_content, created_at FROM notes WHERE contact_id = ? ORDER BY created_at DESC`;
    db.query(sql, [contactId], (err, notes) => {
        if (err) {
            return next(err);
        }
        res.status(200).json(notes);
    });
};

export const deleteNote = (req, res, next) => {
    const { noteId } = req.params;

    const sql = `DELETE FROM notes WHERE id = ? `;
    db.query(sql, [noteId], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).json('Note has been deleted!');
    });
};