import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useResumeStore } from '@/stores/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, FileText, Plus, ArrowLeft, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
    const navigate = useNavigate();
    const { savedResumes, fetchResumes, deleteResume, loadResume, resetResume } = useResumeStore();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        if (token) {
            fetchResumes(token);
        } else {
            navigate('/login');
        }
    }, [token, fetchResumes, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleEdit = async (id: string) => {
        if (token) {
            await loadResume(id, token);
            navigate('/editor');
        }
    };

    const handleDelete = async (id: string) => {
        if (token && confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(id, token);
        }
    };

    const handleCreateNew = () => {
        resetResume();
        navigate('/editor');
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline text-sm">Back to Home</span>
                        </Link>
                        <div className="h-6 w-px bg-border" />
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold hidden sm:inline">ResumeCraft</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className="relative group flex items-center gap-2 font-medium transition-all duration-300"
                        >
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                                {user ? `My Resume (${user.name})` : 'My Resume'}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Button onClick={handleCreateNew} size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Create New
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">My Resumes</h1>
                    </div>

                    {savedResumes.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
                            <p className="text-muted-foreground mb-6">Create your first AI-powered resume to get started.</p>
                            <Button onClick={handleCreateNew}>Create Resume</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedResumes.map((resume) => (
                                <Card key={resume.id} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl font-semibold truncate pr-4">
                                                {resume.name || 'Untitled Resume'}
                                            </CardTitle>
                                            {resume.atsScore !== undefined && (
                                                <div className="flex flex-col items-center">
                                                    <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border-4 ${getScoreColor(resume.atsScore).replace('text-', 'border-')}`}>
                                                        <span className={`text-xs font-bold ${getScoreColor(resume.atsScore)}`}>
                                                            {resume.atsScore}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground mt-1">ATS Score</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Last updated: {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-32 bg-secondary/30 rounded-md flex items-center justify-center border border-dashed border-border">
                                            <FileText className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(resume.id)} className="text-destructive hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" onClick={() => handleEdit(resume.id)} className="gap-2">
                                            <Edit className="w-4 h-4" /> Edit
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
