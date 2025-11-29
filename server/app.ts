import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import resumeRoutes from './routes/resumeRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Resume Alchemy Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);

export default app;
