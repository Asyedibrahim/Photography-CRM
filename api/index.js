import express from 'express';
import db from './config/config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import contactRoutes from './routes/contact.route.js';
import noteRoutes from './routes/note.route.js';
import taskRoutes from './routes/task.route.js';

dotenv.config();

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    } else {
        console.log('Connected to MySQL database!!');
    };
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/task', taskRoutes);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MiddleWare function
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});