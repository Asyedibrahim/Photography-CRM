import db from "../config/config.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {

    const { email, name, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
        return next(errorHandler(400,'All fields are required'));
    };

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (email, name, password) VALUES (?, ?, ?)';

    db.query(sql, [email, name, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                next(errorHandler(409, 'Email already exists'));
            } else {
                next(err);
            };
        } else {
            res.status(201).json('User created succesfully');
        };
    });
};

export const signIn = (req, res, next) => {

    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return next(errorHandler(400, 'All fields are required'));
    };

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email.trim()], (err, result) => {
        if (err) {
            return next(err)
        };
        const validUser = result[0];
        if (!validUser) {
            return next(errorHandler(404, 'User not found!'))
        };

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401,'Invalid Credential'))
        };

        const token = jwt.sign({ id: validUser.id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { password: pass, ...rest} = validUser;

        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }).status(200).json(rest);

    });
};

export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User logged out!')
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = (req, res, next) => {
    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to see users!'));
    };

    db.query('SELECT * FROM users', (err, users) => {
        if (err) {
            return next(err)
        };
        res.status(200).json(users);
    });
};

export const deleteUser = (req, res, next) => {
    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to delete the user'));
    };

    db.query('DELETE FROM users WHERE id = ?', [req.params.userId], (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).json('User has been deleted!');
    });
};

export const getUser = (req, res, next) => {
    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to get the user'));
    };

    db.query('SELECT * FROM users WHERE id = ? ', [req.params.id], (err, result) => {
        if (err) {
            return next(err);
        }

        const user = result[0];
        if (!user) {
            return next(errorHandler(404, 'User not found!'));
        } else {
            const {password, ...rest} = user;
            res.status(200).json(rest);
        };
    });
};

export const editUser = (req, res, next) => {
    const { email, name, password, isAdmin } = req.body;

    if (!req.user || req.user.isAdmin === 0) {
        return next(errorHandler(403, 'You are not allowed to update the user'));
    };

    const sqlFetchUser = 'SELECT email, name, password, isAdmin FROM users WHERE id = ?';
    
    db.query(sqlFetchUser, [req.params.id], (err, result) => {
        if (err) {
            return next(err);
        } else if (result.length === 0) {
            return next(errorHandler(404, 'User not found'));
        }

        const existingUser = result[0];
        
        const newEmail = email ? email : existingUser.email;
        const newName = name ? name : existingUser.name;
        const newPassword = password ? bcrypt.hashSync(password, 10) : existingUser.password;
        const newIsAdmin = isAdmin !== undefined ? isAdmin : existingUser.isAdmin;

        // SQL query to update user data
        const sqlUpdate = 'UPDATE users SET email = ?, name = ?, password = ?, isAdmin = ? WHERE id = ?';

        db.query(sqlUpdate, [newEmail, newName, newPassword, newIsAdmin, req.params.id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return next(errorHandler(409, 'Email already exists'));
                } else {
                    return next(err);
                };
            } else if (result.affectedRows === 0) {
                return next(errorHandler(404, 'User not found'));
            } else {
                res.status(200).json('User updated successfully!');
            }
        });
    });
};