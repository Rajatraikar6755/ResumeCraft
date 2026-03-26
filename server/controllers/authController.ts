import { Request, Response } from 'express';
import { prisma } from '../db.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    // Extra failsafe to prevent infinite hanging
    connectionTimeout: 15000,
});

if (!process.env.SMTP_USER) {
    console.warn('Warning: SMTP_USER is not set. OTP emails will fail.');
}

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if user already exists with a password (they should login instead)
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.password) {
            return res.status(400).json({ error: 'User already exists. Please login.' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`\n================================`);
        console.log(`[DEV MODE] OTP Generated: ${otp}`);
        console.log(`[DEV MODE] Sending to: ${email}`);
        console.log(`================================\n`);

        // Send email FIRST via SMTP
        const mailOptions = {
            from: process.env.SMTP_FROM || 'ResumeCraft <noreply@resumecraft.com>',
            to: email,
            subject: 'Your Registration OTP - Resume Alchemy',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Resume Alchemy</h2>
                    <p>Your one-time verification code is:</p>
                    <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">
                        ${otp}
                    </div>
                    <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (sendError: any) {
             console.error('SMTP Send error:', sendError);
             return res.status(500).json({ error: `SMTP Error: ${sendError.message || 'Unknown network error'}` });
        }

        // Only save OTP to DB after email is confirmed sent
        await prisma.user.upsert({
            where: { email },
            update: { otp, otpExpiry },
            create: { email, otp, otpExpiry },
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
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
