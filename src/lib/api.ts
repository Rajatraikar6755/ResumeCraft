import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ── Auth ──────────────────────────────────────────────────────

/** Send a Firebase ID token to the backend and get back our JWT + user */
export const firebaseAuthRequest = async (idToken: string) => {
    return api.post('/auth/firebase', { idToken });
};

/** Legacy email+password login (for users who registered before Firebase) */
export const login = async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
};

// ── AI ────────────────────────────────────────────────────────

export const generateContent = async (prompt: string) => {
    return api.post('/ai/generate', { prompt });
};

export const calculateATSScore = async (resumeData: any) => {
    return api.post('/ai/ats-score', { resumeData });
};

export const importFromGithub = async (url: string) => {
    return api.post('/ai/github-import', { url });
};

// ── Resume CRUD ───────────────────────────────────────────────

export const createResume = async (resumeData: any, token: string) => {
    return api.post('/resume', resumeData, { headers: { Authorization: `Bearer ${token}` } });
};

export const getResumes = async (token: string) => {
    return api.get('/resume', { headers: { Authorization: `Bearer ${token}` } });
};

export const getResume = async (id: string, token: string) => {
    return api.get(`/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateResume = async (id: string, resumeData: any, token: string) => {
    return api.put(`/resume/${id}`, resumeData, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteResume = async (id: string, token: string) => {
    return api.delete(`/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const parseResume = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/parse-resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default api;
