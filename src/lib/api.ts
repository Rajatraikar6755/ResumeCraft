import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const sendOTP = async (email: string) => {
    return api.post('/auth/send-otp', { email });
};

export const register = async (name: string, email: string, otp: string, password: string) => {
    return api.post('/auth/register', { name, email, otp, password });
};

export const login = async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
};

export const generateContent = async (prompt: string) => {
    return api.post('/ai/generate', { prompt });
};

export const calculateATSScore = async (resumeData: any) => {
    return api.post('/ai/ats-score', { resumeData });
};

export const importFromGithub = async (url: string) => {
    return api.post('/ai/github-import', { url });
};

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
