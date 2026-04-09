import express from 'express';
import { firebaseAuth, login, checkEmail } from '../controllers/authController.js';

const router = express.Router();

// Check if email already exists before registering
router.post('/check-email', checkEmail);

// Primary auth endpoint — frontend sends a Firebase ID token
router.post('/firebase', firebaseAuth);

// Legacy login for users who registered before Firebase migration
router.post('/login', login);

export default router;
