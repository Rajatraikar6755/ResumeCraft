export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the token from the environment securely on the server
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

      const aiRes = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${userPrompt}\n\nReturn ONLY a valid JSON object without markdown code blocks.` }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        })
      });

      if (!aiRes.ok) {
        const err = await aiRes.text();
        return res.status(aiRes.status).json({ error: `GitHub Models API error: ${err}` });
      }

      const data = await aiRes.json();
      let content = data.choices[0].message.content || '';
      content = content.replace(/^```(?:json)?\n?|\n?```$/gm, '').trim();

      const parsed = JSON.parse(content);
      return res.status(200).json({ content: { ...parsed, url } });
    }

    // Default AI action
    const { systemPrompt, userPrompt, jsonMode } = req.body;
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
    }

    return res.status(200).json({ content });

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
