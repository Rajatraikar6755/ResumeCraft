import { Request, Response } from 'express';
import { prisma } from '../db';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists with password (meaning they should login, not register)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.password) {
        return res.status(400).json({ error: 'User already exists. Please login.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
        await prisma.user.upsert({
            where: { email },
            update: { otp, otpExpiry },
            create: { email, otp, otpExpiry },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Resume Alchemy" <no-reply@resumealchemy.com>',
            to: email,
            subject: 'Your Registration OTP',
            text: `Your OTP for Resume Alchemy is: ${otp}`,
            html: `<p>Your OTP for Resume Alchemy is: <strong>${otp}</strong></p>`,
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
        return res.status(400).json({ error: 'Name, Email, OTP, and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user with password and clear OTP
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
                password: hashedPassword,
                otp: null,
                otpExpiry: null
            },
        });

        const token = jwt.sign({ userId: updatedUser.id, email: updatedUser.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });

        res.json({ token, user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name } });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};
