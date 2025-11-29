import { Request, Response } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { parseFile } from '../utils/fileParser';

// Initialize OpenAI (GitHub Models)
const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to handle AI generation with fallback
async function generateAIResponse(systemPrompt: string, userPrompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        console.log('Attempting to use GitHub Models (OpenAI)...');
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4o",
            temperature: 0.7,
            max_tokens: 2000,
            response_format: jsonMode ? { type: "json_object" } : undefined
        });

        return response.choices[0].message.content || '';
    } catch (error: any) {
        console.warn('GitHub Models failed, switching to Gemini fallback...', error.message);

        // Fallback to Gemini
        try {
            const prompt = `${systemPrompt}\n\n${userPrompt}`;

            // For JSON mode, we append instructions to ensure JSON output if not already explicit
            const finalPrompt = jsonMode ? `${prompt}\n\nReturn ONLY a valid JSON object.` : prompt;

            const result = await geminiModel.generateContent(finalPrompt);
            const response = await result.response;
            let text = response.text();

            // Clean up markdown code blocks if present (Gemini often wraps JSON in ```json ... ```)
            if (jsonMode) {
                text = text.replace(/```json\n?|\n?```/g, '').trim();
            }

            return text;
        } catch (geminiError: any) {
            console.error('Gemini fallback also failed:', geminiError.message);
            throw new Error('All AI services failed. Please try again later.');
        }
    }
}

export const generateContent = async (req: Request, res: Response) => {
    const { prompt, type } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const content = await generateAIResponse(
            "You are a helpful AI assistant for building resumes.",
            prompt
        );
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate content' });
    }
};

export const calculateATSScore = async (req: Request, res: Response) => {
    const { resumeData } = req.body;

    if (!resumeData) {
        return res.status(400).json({ error: 'Resume data is required' });
    }

    try {
        const prompt = `
        You are an expert ATS (Applicant Tracking System) scanner. 
        Analyze the following resume data and provide a score from 0 to 100 based on completeness, keyword usage, and formatting (implied).
        Also provide a brief feedback summary.
        
        Resume Data:
        ${JSON.stringify(resumeData)}
        
        Return ONLY a JSON object in the following format:
        {
            "score": number,
            "feedback": "string"
        }
        `;

        const content = await generateAIResponse(
            "You are a helpful AI assistant for building resumes.",
            prompt,
            true // JSON mode
        );

        const result = JSON.parse(content || '{}');
        res.json(result);
    } catch (error) {
        console.error('Error calculating ATS score:', error);
        res.status(500).json({ error: 'Failed to calculate ATS score' });
    }
};

export const importFromGithub = async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'GitHub URL is required' });
    }

    try {
        // Extract owner and repo from URL
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
            return res.status(400).json({ error: 'Invalid GitHub URL' });
        }

        const [, owner, repo] = match;

        // Fetch repo details
        const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
        const repoData = repoResponse.data;

        // Fetch README
        let readmeContent = '';
        try {
            const readmeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`);
            readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        } catch (e) {
            console.warn('README not found or inaccessible');
        }

        const prompt = `
        Analyze the following GitHub repository information and extract project details for a resume.
        
        Repo Name: ${repoData.name}
        Description: ${repoData.description}
        Topics: ${repoData.topics?.join(', ')}
        Language: ${repoData.language}
        README Content (truncated): ${readmeContent.slice(0, 5000)}
        
        Return ONLY a JSON object in the following format:
        {
            "name": "Project Name (formatted nicely)",
            "description": "A concise, impressive description for a resume (2-3 sentences, use action verbs)",
            "technologies": ["Tech 1", "Tech 2", "Tech 3"]
        }
        `;

        const content = await generateAIResponse(
            "You are a helpful AI assistant for building resumes.",
            prompt,
            true // JSON mode
        );

        const result = JSON.parse(content || '{}');

        // Merge with original URL
        res.json({ ...result, url });

    } catch (error: any) {
        console.error('Error importing from GitHub:', error);

        let errorMessage = 'Failed to import from GitHub';
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                errorMessage = 'Repository not found or private';
            } else if (error.response?.status === 403) {
                errorMessage = 'GitHub API rate limit exceeded';
            }
        }

        res.status(500).json({ error: errorMessage, details: error.message });
    }
};

export const parseResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const text = await parseFile(req.file);

        const prompt = `
        You are an expert resume parser. Extract information from the following resume text and structure it into the specified JSON format.
        
        Resume Text:
        ${text.slice(0, 15000)}
        
        Return ONLY a JSON object with the following structure:
        {
            "personalInfo": {
                "fullName": "string",
                "email": "string",
                "phone": "string",
                "location": "string",
                "linkedin": "string",
                "github": "string",
                "portfolio": "string"
            },
            "summary": "string",
            "experiences": [
                {
                    "id": "string (generate a random uuid)",
                    "jobTitle": "string",
                    "company": "string",
                    "location": "string",
                    "startDate": "string (YYYY-MM)",
                    "endDate": "string (YYYY-MM) or 'Present'",
                    "description": "string",
                    "bullets": ["string"]
                }
            ],
            "education": [
                {
                    "id": "string (generate a random uuid)",
                    "school": "string",
                    "degree": "string",
                    "location": "string",
                    "startDate": "string (YYYY-MM)",
                    "endDate": "string (YYYY-MM) or 'Present'",
                    "description": "string"
                }
            ],
            "projects": [
                {
                    "id": "string (generate a random uuid)",
                    "name": "string",
                    "description": "string",
                    "technologies": ["string"],
                    "url": "string"
                }
            ],
            "skills": [
                {
                    "id": "string (generate a random uuid)",
                    "name": "string",
                    "level": "Expert" | "Intermediate" | "Beginner"
                }
            ]
        }
        `;

        const content = await generateAIResponse(
            "You are a helpful AI assistant for parsing resumes.",
            prompt,
            true // JSON mode
        );

        const result = JSON.parse(content || '{}');
        res.json(result);

    } catch (error: any) {
        console.error('Error parsing resume:', error);
        res.status(500).json({ error: 'Failed to parse resume', details: error.message });
    }
};
