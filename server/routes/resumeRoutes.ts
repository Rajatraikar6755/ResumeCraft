import express from 'express';
import { createResume, getResumes, updateResume, deleteResume, getResume } from '../controllers/resumeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
