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
 * Parse a resume from an uploaded file (PDF or DOCX).
 * Returns structured resume data.
 */
export async function parseResumeDirect(file: File): Promise<unknown> {
  // Convert File to Base64
  const fileBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      action: 'parse_resume', 
      fileType: file.type, 
      fileBase64 
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.content);
}
