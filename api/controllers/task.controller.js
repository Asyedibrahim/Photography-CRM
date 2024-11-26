import db from '../config/config.js'

export const createTask = (req, res, next) => {
    const { contactId } = req.params;
    const { notes, time } = req.body;

    if (!notes || !time) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const sql = "INSERT INTO tasks (contact_id, notes, time) VALUES (?, ?, ?)";

    db.query(sql, [contactId, notes, time], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            id: result.insertId,
            contactId,
            notes,
            time,
        });
    });  
}

export const getTasks = (req, res, next) => {
    const { contactId } = req.params;

    const sql = "SELECT * FROM tasks WHERE contact_id = ? ORDER BY createdAt DESC";
    db.query(sql, [contactId], (err, tasks) => {
    if (err) {
        return next(err);
    }
    res.status(200).json(tasks);
    });
}

export const deleteTask = (req, res, next) => {
    const { taskId } = req.params;

    const sql = `DELETE FROM tasks WHERE id = ? `;
    db.query(sql, [taskId], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).json('Task has been deleted!');
    });
}