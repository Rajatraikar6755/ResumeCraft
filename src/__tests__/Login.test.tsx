import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../lib/api';

// Mock dependencies
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../lib/api', () => ({
    login: vi.fn(),
    register: vi.fn(),
    sendOTP: vi.fn(),
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

    it('calls login api on form submission', async () => {
        (api.login as any).mockResolvedValue({
            data: {
                token: 'fake-token',
                user: { id: '1', name: 'Test User' },
            },
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith('test@example.com', 'password');
        });
    });
});
