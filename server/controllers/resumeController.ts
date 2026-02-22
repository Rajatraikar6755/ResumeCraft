import { Request, Response } from 'express';
import { prisma } from '../db.js';

export const createResume = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { name, content, atsScore } = req.body;

        const resume = await prisma.resume.create({
            data: {
                userId,
                name,
                content,
                atsScore,
            },
        });

        res.json(resume);
    } catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({ error: 'Failed to create resume' });
    }
};

export const getResumes = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const resumes = await prisma.resume.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        res.json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
};

export const updateResume = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { id } = req.params;
        const { name, content, atsScore } = req.body;

        const resume = await prisma.resume.update({
            where: { id, userId },
            data: {
                name,
                content,
                atsScore,
            },
        });

        res.json(resume);
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ error: 'Failed to update resume' });
    }
};

export const deleteResume = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { id } = req.params;

        await prisma.resume.delete({
            where: { id, userId },
        });

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
};

export const getResume = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { id } = req.params;

        const resume = await prisma.resume.findUnique({
            where: { id, userId },
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
};
