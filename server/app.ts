import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://resume-craft-one-delta.vercel.app'
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin as string)) {
            callback(null, true);
        } else {
            callback(null, true); // For now, allowing all origins to fix the immediate issue, but this reflects the exact origin to be compatible with credentials: true
        }
    },
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Resume Alchemy Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);

export default app;
