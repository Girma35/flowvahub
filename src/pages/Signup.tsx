import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                    },
                },
            });

            if (error) throw error;

            setSuccess(true);
            setEmail('');
            setPassword('');
            setFullname('');

            // Redirect after showing the message for a few seconds
            setTimeout(() => navigate('/login'), 6000);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Club"
            subtitle="Start your journey with Flowva today"
        >
            <form onSubmit={handleSignup} className="space-y-5">
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-4 rounded-2xl text-sm font-bold flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-circle-check text-lg"></i>
                            Success! Account created.
                        </div>
                        <p className="text-xs text-green-500/80 ml-7 font-medium leading-relaxed">
                            A confirmation link has been sent to your email. <span className="text-white">Please check your inbox (and spam)</span> to verify your account before logging in.
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400 ml-1">Full Name</label>
                    <div className="relative group">
                        <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="text"
                            required
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            placeholder="Alex Rivera"
                        />
                    </div>
                </div>

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
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400 ml-1">Password</label>
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
                    <p className="text-[10px] text-zinc-600 font-bold px-1 uppercase tracking-wider">Must be at least 8 characters</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
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
                            Creating...
                        </div>
                    ) : 'Create Account'}
                </Button>

                <p className="text-center text-xs text-zinc-500 mt-6 leading-relaxed">
                    By signing up, you agree to our <span className="text-zinc-300 font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-zinc-300 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
                </p>

                <p className="text-center text-sm text-zinc-500 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
