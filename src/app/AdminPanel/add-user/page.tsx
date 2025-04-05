'use client'
import { motion as m } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../Common/Auth/AuthContext";

export default function AddUser() {
    const router = useRouter();
    const { checkAuth, userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!checkAuth() || !userInfo?.isAdmin) {
            router.push('/Login');
            return;
        }
        setLoading(false);
    }, [router, checkAuth, userInfo]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            const formData = new FormData(e.currentTarget);
            const userData = {
                email: formData.get('email') as string,
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                password: formData.get('password') as string
            };
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add user');
            }
            
            router.push('/AdminPanel');
        } catch (err) {
            console.error('Error adding user:', err);
            setError(err instanceof Error ? err.message : 'Failed to add user');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div title="Add User">
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div title="Add User">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl mx-auto p-4"
            >
                <div className="bg-zinc-800 p-6 rounded-lg">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-white mb-2">Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-white mb-2">Password</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="firstName" className="block text-white mb-2">First Name</label>
                                <input 
                                    type="text" 
                                    id="firstName"
                                    name="firstName" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="lastName" className="block text-white mb-2">Last Name</label>
                                <input 
                                    type="text" 
                                    id="lastName"
                                    name="lastName" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => router.push('/AdminPanel')}
                                className="bg-zinc-600 text-white px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                            >
                                {submitting ? 'Adding...' : 'Add User'}
                            </button>
                        </div>
                    </form>
                </div>
            </m.div>
        </div>
    );
} 