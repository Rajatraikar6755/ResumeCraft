import { Request, Response } from 'express';
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';

/**
 * POST /api/auth/firebase
 *
 * Accepts a Firebase ID token from the frontend, verifies it with the
 * Firebase Admin SDK, upserts the user in Prisma, and returns a JWT +
 * user object exactly like the old login/register endpoints did.
 *
 * Body: { idToken: string }
 */
export const firebaseAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'Firebase ID token is required' });
    }

    try {
        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        if (!email) {
            return res.status(400).json({ error: 'Email is required in Firebase token' });
        }

        // Upsert user in DB — creates on first sign-in, updates name on subsequent ones
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name: name || undefined,
                firebaseUid: uid,
            },
            create: {
                email,
                name: name || email.split('@')[0],
                firebaseUid: uid,
            },
        });

        // Issue our own JWT (keeps the rest of the app — resume routes etc. — unchanged)
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error: any) {
        console.error('❌ Firebase auth verification failed:', error.message);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Firebase token has expired. Please sign in again.' });
        }
        if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ error: 'Invalid Firebase token.' });
        }

        res.status(500).json({ error: 'Authentication failed. Please try again.' });
    }
};

/**
 * Legacy login endpoint — kept for backward compatibility.
 * Existing users who registered with email+password (bcrypt) can still log in.
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Dynamic import so bcrypt is only loaded when this legacy path is hit
        const bcrypt = await import('bcryptjs');

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

/**
 * Validates whether an email already exists in the database.
 * Used by the frontend during registration to prevent duplicate accounts.
 */
export const checkEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        res.json({ exists: !!user });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Failed to check email' });
    }
};
