import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your credentials to access your account"
        >
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400 ml-1">Email Address</label>
                    <div className="relative group">
                        <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400">Password</label>
                        <Link to="/forgot-password" title="forgot-password" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</Link>
                    </div>
                    <div className="relative group">
                        <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="space-y-3">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                        {error === 'Invalid login credentials' && (
                            <p className="text-[11px] text-zinc-500 px-1 font-medium bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50">
                                <span className="text-zinc-300 font-bold">New here?</span> Make sure you've created an account first. If you just signed up, check your email for a confirmation link!
                            </p>
                        )}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-base mt-2"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Signing in...
                        </div>
                    ) : 'Sign In'}
                </Button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-[#18181b] px-4 text-xs font-bold text-zinc-500 uppercase tracking-widest transition-colors duration-300">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-3 rounded-2xl font-bold text-sm text-zinc-700 dark:text-zinc-300 transition-all">
                        <i className="fa-brands fa-google text-lg"></i>
                        Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-3 rounded-2xl font-bold text-sm text-zinc-700 dark:text-zinc-300 transition-all">
                        <i className="fa-brands fa-apple text-zinc-900 dark:text-white text-lg"></i>
                        Apple
                    </button>
                </div>

                <p className="text-center text-sm text-zinc-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-400 font-bold hover:underline">Create Account</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
