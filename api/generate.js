import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured on server' });
  }

  try {
    const { action } = req.body;

    if (action === 'github_import') {
      const { url } = req.body;
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return res.status(400).json({ error: 'Invalid GitHub URL' });

      const [, owner, repo] = match;
      const headers = { Authorization: `Bearer ${token}` };
      
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!repoRes.ok) return res.status(404).json({ error: 'Repository not found or private' });
      const repoData = await repoRes.json();

      let readmeContent = '';
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8').slice(0, 3000);
        }
      } catch (e) { /* optional */ }

      const systemPrompt = 'You are a helpful AI assistant extracting project details for a resume.';
      const userPrompt = `Analyze the following GitHub repository and extract project details.\n\nRepo Name: ${repoData.name}\nDescription: ${repoData.description || 'N/A'}\nTopics: ${(repoData.topics || []).join(', ') || 'N/A'}\nLanguage: ${repoData.language || 'N/A'}\nREADME (truncated): ${readmeContent || 'N/A'}\n\nReturn ONLY a valid JSON object:\n{\n  "name": "Project Name (formatted nicely)",\n  "description": "A concise, impressive description for a resume (2-3 sentences, use action verbs)",\n  "technologies": ["Tech 1", "Tech 2", "Tech 3"]\n}`;

      return await callAI(systemPrompt, userPrompt, true, token, res, { ...JSON.parse('{}'), url }); // Placeholder merge done below
    }

    if (action === 'parse_resume') {
      const { fileType, fileBase64 } = req.body;
      const buffer = Buffer.from(fileBase64, 'base64');
      let text = '';

      if (fileType === 'application/pdf') {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } else {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      }

      const systemPrompt = 'You are an expert resume parser.';
      const userPrompt = `Extract information from the following resume text.\n\nResume Text:\n${text.slice(0, 15000)}\n\nReturn ONLY a valid JSON object with this exact structure:\n{\n  "personalInfo": {\n    "fullName": "string",\n    "email": "string",\n    "phone": "string",\n    "location": "string",\n    "linkedin": "string",\n    "github": "string",\n    "portfolio": "string"\n  },\n  "summary": "string",\n  "experiences": [{\n    "id": "uuid",\n    "jobTitle": "string",\n    "company": "string",\n    "location": "string",\n    "startDate": "YYYY-MM",\n    "endDate": "YYYY-MM or Present",\n    "description": "string",\n    "bullets": ["string"]\n  }],\n  "education": [{\n    "id": "uuid",\n    "school": "string",\n    "degree": "string",\n    "location": "string",\n    "startDate": "YYYY-MM",\n    "endDate": "YYYY-MM or Present",\n    "description": "string"\n  }],\n  "projects": [{\n    "id": "uuid",\n    "name": "string",\n    "description": "string",\n    "technologies": ["string"],\n    "url": "string"\n  }],\n  "skills": [{\n    "id": "uuid",\n    "name": "string",\n    "level": "Expert" | "Intermediate" | "Beginner"\n  }]\n}`;

      return await callAI(systemPrompt, userPrompt, true, token, res);
    }

    // Default action (generate text / ATS score)
    const { systemPrompt, userPrompt, jsonMode } = req.body;
    return await callAI(systemPrompt, userPrompt, jsonMode, token, res);

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

async function callAI(systemPrompt, userPrompt, jsonMode, token, res, mergeData = null) {
  const finalPrompt = jsonMode ? `${userPrompt}\n\nReturn ONLY a valid JSON object without markdown code blocks.` : userPrompt;

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
    return res.status(response.status).json({ error: `GitHub Models API error: ${err}` });
  }

  const data = await response.json();
  let content = data.choices[0].message.content || '';

  if (jsonMode) {
    content = content.replace(/^```(?:json)?\n?|\n?```$/gm, '').trim();
    if (mergeData) {
       const parsed = JSON.parse(content);
       return res.status(200).json({ content: { ...parsed, ...mergeData } });
    }
  }

  return res.status(200).json({ content });
}
