import { create } from 'zustand';
import { createResume, updateResume, getResume, getResumes, deleteResume as deleteResumeApi } from '@/lib/api';
import { toast } from 'sonner';

// ... (existing imports)

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeData {
  id: string;
  title?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  atsScore?: number;
  createdAt?: string;
}

interface ResumeState {
  resume: ResumeData;
  savedResumes: any[]; // You might want to define a stricter type here
  isGenerating: boolean;
  activeSection: string | null;
  setResume: (resume: Partial<ResumeData>) => void;
  setPersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  setSummary: (summary: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSkills: (skills: string[]) => void;
  setTemplate: (template: ResumeData['template']) => void;
  setIsGenerating: (generating: boolean) => void;
  setActiveSection: (section: string | null) => void;
  resetResume: () => void;
  setAtsScore: (score: number) => void;
  saveResume: (token: string, title?: string) => Promise<void>;
  loadResume: (id: string, token: string) => Promise<void>;
  fetchResumes: (token: string) => Promise<void>;
  deleteResume: (id: string, token: string) => Promise<void>;
}

const initialResume: ResumeData = {
  id: crypto.randomUUID(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  template: 'modern',
};

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: initialResume,
  isGenerating: false,
  activeSection: null,

  setResume: (resume) =>
    set((state) => ({ resume: { ...state.resume, ...resume } })),

  setPersonalInfo: (info) =>
    set((state) => ({
      resume: {
        ...state.resume,
        personalInfo: { ...state.resume.personalInfo, ...info },
      },
    })),

  setSummary: (summary) =>
    set((state) => ({ resume: { ...state.resume, summary } })),

  addExperience: (exp) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: [...state.resume.experiences, exp],
      },
    })),

  updateExperience: (id, exp) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.filter((e) => e.id !== id),
      },
    })),

  reorderExperiences: (experiences) =>
    set((state) => ({
      resume: { ...state.resume, experiences },
    })),

  addEducation: (edu) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: [...state.resume.education, edu],
      },
    })),

  updateEducation: (id, edu) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.map((e) =>
          e.id === id ? { ...e, ...edu } : e
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((e) => e.id !== id),
      },
    })),

  addProject: (project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: [...state.resume.projects, project],
      },
    })),

  updateProject: (id, project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((p) => p.id !== id),
      },
    })),

  setSkills: (skills) =>
    set((state) => ({ resume: { ...state.resume, skills } })),

  setTemplate: (template) =>
    set((state) => ({ resume: { ...state.resume, template } })),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setActiveSection: (activeSection) => set({ activeSection }),

  resetResume: () => set({
    resume: {
      ...initialResume,
      id: crypto.randomUUID(),
      createdAt: undefined // Ensure it's treated as a new resume
    }
  }),

  setAtsScore: (score) => set((state) => ({ resume: { ...state.resume, atsScore: score } })),

  saveResume: async (token, title) => {
    const { resume } = get();
    set({ isGenerating: true });
    try {
      const resumeData = {
        ...resume,
        title: title || resume.title || 'Untitled Resume',
      };

      let response;
      if (resume.createdAt) {
        // Update existing
        response = await updateResume(resume.id, {
          name: resumeData.title,
          content: resumeData,
          atsScore: resume.atsScore
        }, token);
      } else {
        // Create new
        response = await createResume({
          name: resumeData.title,
          content: resumeData,
          atsScore: resume.atsScore
        }, token);
      }

      set((state) => ({
        resume: {
          ...state.resume,
          id: response.data.id,
          createdAt: response.data.createdAt,
          title: response.data.name
        }
      }));
      toast.success('Resume saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save resume');
    } finally {
      set({ isGenerating: false });
    }
  },

  loadResume: async (id, token) => {
    set({ isGenerating: true });
    try {
      const { data } = await getResume(id, token);
      const content = data.content as ResumeData;
      set({
        resume: {
          ...content,
          id: data.id,
          title: data.name,
          atsScore: data.atsScore,
          createdAt: data.createdAt
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load resume');
    } finally {
      set({ isGenerating: false });
    }
  },
  savedResumes: [],
  fetchResumes: async (token) => {
    set({ isGenerating: true });
    try {
      const { data } = await getResumes(token);
      set({ savedResumes: data });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch resumes');
    } finally {
      set({ isGenerating: false });
    }
  },
  deleteResume: async (id, token) => {
    try {
      await deleteResumeApi(id, token);
      set((state) => ({
        savedResumes: state.savedResumes.filter((r) => r.id !== id),
      }));
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete resume');
    }
  },
}));
