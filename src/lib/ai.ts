/**
 * Client-side AI service using GitHub Models (Azure OpenAI).
 * Bypasses the backend for AI operations while Render migration is in progress.
 * 
 * ⚠️ WARNING: Exposing VITE_GITHUB_TOKEN to the frontend means anyone inspecting
 * your site's network requests can see your GitHub Personal Access Token.
 * It is highly recommended to move this back to the backend in production!
 */

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

if (!GITHUB_TOKEN) {
  console.warn('⚠️  VITE_GITHUB_TOKEN is not set. AI features will not work.');
}

async function callGitHubModels(systemPrompt: string, userPrompt: string, jsonMode: boolean = false): Promise<string> {
  const url = 'https://models.inference.ai.azure.com/chat/completions';
  
  // If JSON mode is requested, explicitly instruct the model
  const finalPrompt = jsonMode ? `${userPrompt}\n\nReturn ONLY a valid JSON object without markdown code blocks.` : userPrompt;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: jsonMode ? { type: "json_object" } : undefined
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GitHub Models API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content || '';

  if (jsonMode) {
    // Strip markdown code fences if the model still returns them despite response_format
    content = content.replace(/^```(?:json)?\n?|\n?```$/gm, '').trim();
  }

  return content;
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
  // Fetch repo metadata via GitHub API
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');

  const [, owner, repo] = match;
  
  // Use the same token for regular GitHub API to avoid rate limits
  const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) throw new Error('Repository not found or private');
  const repoData = await repoRes.json();

  // Try to fetch README
  let readmeContent = '';
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeContent = atob(readmeData.content.replace(/\n/g, '')).slice(0, 3000);
    }
  } catch { /* README optional */ }

  const systemContext = 'You are a helpful AI assistant extracting project details for a resume.';
  const prompt = `Analyze the following GitHub repository and extract project details.

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

  const content = await callGitHubModels(systemContext, prompt, true);
  const parsed = JSON.parse(content);
  return { ...parsed, url };
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
