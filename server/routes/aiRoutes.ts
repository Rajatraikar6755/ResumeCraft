import express from 'express';
import multer from 'multer';
import { generateContent, calculateATSScore, importFromGithub, parseResume } from '../controllers/aiController';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/generate', generateContent);
router.post('/ats-score', calculateATSScore);
router.post('/github-import', importFromGithub);
router.post('/parse-resume', upload.single('file'), parseResume);

export default router;
