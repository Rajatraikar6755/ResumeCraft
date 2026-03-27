import { Request, Response } from 'express';
import { prisma } from '../db.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Gmail SMTP Transporter with timeouts to prevent hanging
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465', // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000,  // 15s — fail fast instead of hanging
    greetingTimeout: 15000,
    socketTimeout: 15000,
});

// Verify SMTP on startup so you see errors in Render logs immediately
transporter.verify()
    .then(() => console.log('✅ SMTP connection verified — email sending is ready'))
    .catch((err: any) => console.error('❌ SMTP verification failed (OTP emails will NOT work):', err.message));

if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('❌ SMTP_USER or SMTP_PASSWORD is missing. OTP emails will fail.');
}

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.password) {
            return res.status(400).json({ error: 'User already exists. Please login.' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`[OTP] Generated ${otp} for ${email}`);

        // Send email via Gmail SMTP
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `Resume Alchemy <${process.env.SMTP_USER}>`,
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
        });

        console.log(`[OTP] ✅ Email sent successfully to ${email}`);

        await prisma.user.upsert({
            where: { email },
            update: { otp, otpExpiry },
            create: { email, otp, otpExpiry },
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('❌ [OTP] Email send failed:', error.message);

        // Provide specific error messages based on failure type
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
            return res.status(500).json({
                error: 'Email server connection timed out. SMTP port may be blocked by the hosting provider.',
            });
        }
        if (error.code === 'EAUTH') {
            return res.status(500).json({
                error: 'SMTP authentication failed. Check SMTP_USER and SMTP_PASSWORD.',
            });
        }
        res.status(500).json({ error: 'Failed to send OTP email. Please try again later.' });
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
