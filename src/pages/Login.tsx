import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuthRequest } from '@/lib/api';
import {
    firebaseRegister,
    firebaseLogin,
    firebaseGoogleSignIn,
    getIdToken,
} from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

// ── Inline Google icon (avoids extra dependencies) ──────────
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

// ── Helper: exchange Firebase user for our backend JWT ───────
const syncWithBackend = async (firebaseUser: import('firebase/auth').User) => {
    const idToken = await getIdToken(firebaseUser);
    const { data } = await firebaseAuthRequest(idToken);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
};

// ── Component ───────────────────────────────────────────────
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ── Email/Password Login ────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await firebaseLogin(email, password);
            await syncWithBackend(user);
            toast.success('Logged in successfully');
            navigate('/');
        } catch (error: any) {
            const msg = mapFirebaseError(error.code) || 'Invalid email or password';
            toast.error(msg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ── Email/Password Register ─────────────────────────────
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const user = await firebaseRegister(name, email, password);
            await syncWithBackend(user);
            toast.success('Account created successfully');
            navigate('/');
        } catch (error: any) {
            const msg = mapFirebaseError(error.code) || 'Registration failed';
            toast.error(msg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ── Google Sign-In ──────────────────────────────────────
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const user = await firebaseGoogleSignIn();
            await syncWithBackend(user);
            toast.success('Signed in with Google');
            navigate('/');
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') return;
            const msg = mapFirebaseError(error.code) || 'Google sign-in failed';
            toast.error(msg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Welcome to ResumeCraft</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account or create a new one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="register">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* ── Sign In ────────────────────────────── */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                type="button"
                            >
                                <GoogleIcon />
                                Google
                            </Button>
                        </TabsContent>

                        {/* ── Sign Up ────────────────────────────── */}
                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Create Password</Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                type="button"
                            >
                                <GoogleIcon />
                                Google
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

// ── Firebase error code → user-friendly message ─────────────
function mapFirebaseError(code: string | undefined): string | null {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Check your internet connection.';
        default:
            return null;
    }
}

export default Login;
