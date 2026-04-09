import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../lib/api', () => ({
    firebaseAuthRequest: vi.fn(),
    login: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    firebaseLogin: vi.fn(),
    firebaseRegister: vi.fn(),
    firebaseGoogleSignIn: vi.fn(),
    firebaseSignOut: vi.fn(),
    getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form by default', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByRole('heading', { name: /welcome to resumecraft/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('switches to register tab', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const registerTab = screen.getByRole('tab', { name: /sign up/i });
        fireEvent.click(registerTab);

        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('renders Google sign-in button', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });
});
