/**
 * Client-side AI service that securely calls our Vercel Serverless Function (/api/generate).
 * This completely hides the GitHub token from the browser.
 */

async function callGitHubModels(systemPrompt: string, userPrompt: string, jsonMode: boolean = false): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ systemPrompt, userPrompt, jsonMode })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.content;
}

/**
 * Generate free-form text content (e.g. resume bullet points, summaries).
 * Returns { content: string }
 */
export async function generateContentDirect(prompt: string): Promise<{ content: string }> {
  const systemContext = 'You are a helpful AI assistant for building professional resumes. Be concise, professional, and use strong action verbs.';
  const content = await callGitHubModels(systemContext, prompt, false);
  return { content };
}

/**
 * Calculate ATS score for a resume.
 * Returns { score: number, feedback: string }
 */
export async function calculateATSScoreDirect(resumeData: unknown): Promise<{ score: number; feedback: string }> {
  const systemContext = 'You are an expert ATS (Applicant Tracking System) scanner.';
  const prompt = `Analyze the following resume data and provide a score from 0 to 100 based on completeness, keyword usage, and formatting. Also provide a brief feedback summary.
  
Resume Data:
${JSON.stringify(resumeData)}

Return ONLY a valid JSON object in this format:
{
  "score": number,
  "feedback": "string"
}`;

  const content = await callGitHubModels(systemContext, prompt, true);
  return JSON.parse(content);
}

export async function importFromGithubDirect(url: string): Promise<{
  name: string;
  description: string;
  technologies: string[];
  url: string;
}> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'github_import', url })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.content;
}

/**
 * Parse a resume from extracted text.
 * Returns structured resume data.
 */
export async function parseResumeDirect(text: string): Promise<unknown> {
  const systemContext = 'You are an expert resume parser.';
  const prompt = `Extract information from the following resume text.

Resume Text:
${text.slice(0, 12000)}

Return ONLY a valid JSON object with this exact structure:
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

  const content = await callGitHubModels(systemContext, prompt, true);
  return JSON.parse(content);
}
