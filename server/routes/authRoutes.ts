import express from 'express';
import { firebaseAuth, login } from '../controllers/authController.js';

const router = express.Router();

// Primary auth endpoint — frontend sends a Firebase ID token
router.post('/firebase', firebaseAuth);

// Legacy login for users who registered before Firebase migration
router.post('/login', login);

export default router;
