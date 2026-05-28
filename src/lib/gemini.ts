/**
 * Client-side AI service using Gemini directly from the browser.
 * This bypasses the backend for AI operations while Railway/Render migration is in progress.
 * The GEMINI_API_KEY is exposed as a VITE_ env var — safe for a personal/demo project,
 * but should be moved back to the backend once Render is live.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/** Strip markdown code fences Gemini sometimes wraps around JSON */
function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\n?|\n?```$/gm, '').trim();
}

/**
 * Generate free-form text content (e.g. resume bullet points, summaries).
 * Returns { content: string }
 */
export async function generateContentDirect(prompt: string): Promise<{ content: string }> {
  const systemContext = 'You are a helpful AI assistant for building professional resumes. Be concise, professional, and use strong action verbs.';
  const result = await model.generateContent(`${systemContext}\n\n${prompt}`);
  const content = result.response.text();
  return { content };
}

/**
 * Calculate ATS score for a resume.
 * Returns { score: number, feedback: string }
 */
export async function calculateATSScoreDirect(resumeData: unknown): Promise<{ score: number; feedback: string }> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) scanner.
Analyze the following resume data and provide a score from 0 to 100 based on completeness, keyword usage, and formatting.
Also provide a brief feedback summary.

Resume Data:
${JSON.stringify(resumeData)}

Return ONLY a valid JSON object:
{
  "score": number,
  "feedback": "string"
}`;

  const result = await model.generateContent(prompt);
  const text = stripJsonFences(result.response.text());
  return JSON.parse(text);
}

/**
 * Import project details from a GitHub URL.
 * Returns { name, description, technologies, url }
 */
export async function importFromGithubDirect(url: string): Promise<{
  name: string;
  description: string;
  technologies: string[];
  url: string;
}> {
  // Fetch repo metadata via GitHub API (no auth needed for public repos)
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');

  const [, owner, repo] = match;
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!repoRes.ok) throw new Error('Repository not found or private');
  const repoData = await repoRes.json();

  // Try to fetch README
  let readmeContent = '';
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeContent = atob(readmeData.content.replace(/\n/g, '')).slice(0, 3000);
    }
  } catch { /* README optional */ }

  const prompt = `
Analyze the following GitHub repository and extract project details for a resume.

Repo Name: ${repoData.name}
Description: ${repoData.description || 'N/A'}
Topics: ${(repoData.topics || []).join(', ') || 'N/A'}
Language: ${repoData.language || 'N/A'}
README (truncated): ${readmeContent || 'N/A'}

Return ONLY a valid JSON object:
{
  "name": "Project Name (formatted nicely)",
  "description": "A concise, impressive description for a resume (2-3 sentences, use action verbs)",
  "technologies": ["Tech 1", "Tech 2", "Tech 3"]
}`;

  const result = await model.generateContent(prompt);
  const text = stripJsonFences(result.response.text());
  const parsed = JSON.parse(text);
  return { ...parsed, url };
}

/**
 * Parse a resume from extracted text.
 * Returns structured resume data.
 */
export async function parseResumeDirect(text: string): Promise<unknown> {
  const prompt = `
You are an expert resume parser. Extract information from the following resume text.

Resume Text:
${text.slice(0, 12000)}

Return ONLY a valid JSON object with this structure:
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
  "experiences": [{
    "id": "uuid",
    "jobTitle": "string",
    "company": "string",
    "location": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM or Present",
    "description": "string",
    "bullets": ["string"]
  }],
  "education": [{
    "id": "uuid",
    "school": "string",
    "degree": "string",
    "location": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM or Present",
    "description": "string"
  }],
  "projects": [{
    "id": "uuid",
    "name": "string",
    "description": "string",
    "technologies": ["string"],
    "url": "string"
  }],
  "skills": [{
    "id": "uuid",
    "name": "string",
    "level": "Expert" | "Intermediate" | "Beginner"
  }]
}`;

  const result = await model.generateContent(prompt);
  const responseText = stripJsonFences(result.response.text());
  return JSON.parse(responseText);
}
