'use client'
import { UserRound } from "lucide-react";
import { motion as m, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Common/Auth/AuthContext";
import AuthLayout from "../Common/Layout/AuthLayout";

export default function Login() {
    const router = useRouter();
    const { userInfo, login } = useAuth();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [showSignUp, setShowSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'email' | 'password' | 'confirmPassword') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'email') {
                passwordRef.current?.focus();
            } else if (field === 'password') {
                if (showSignUp) {
                    confirmPasswordRef.current?.focus();
                } else {
                    handleLogin();
                }
            } else if (field === 'confirmPassword') {
                handleSignUp();
            }
        }
    };

    const handleLogin = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Handle admin login
            if (email === "admin@admin.com" && password === "admin") {
                login("admin");
                router.push('/');
                return;
            }

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            if (data.user) {
                login(data.user.Id);
            }

            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            // Login the newly registered user
            if (data.user) {
                login(data.user.id);
                router.push('/');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    if (userInfo) {
        return (
            <AuthLayout title="Welcome Back">
                <div className="text-white text-3xl text-center">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {userInfo.firstName} {userInfo.lastName}
                    </m.div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center my-5">
            <div className="h-[75vh] bg-zinc-900 w-3/4 rounded-lg flex items-center justify-center">
                <div className="rounded-lg h-2/3 w-full px-10 grid grid-cols-1">
                    <div className="text-white text-7xl font-bold w-full font-[quantico] text-center">
                        Login
                    </div>
                    <div className="flex items-center justify-center">
                        <UserRound className="size-50" />
                    </div>
                    <div className="flex items-center text-3xl justify-center">
                        <input 
                            ref={emailRef}
                            type="text" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'email')}
                            className="bg-zinc-50 caret-zinc-950 text-zinc-900 px-5 py-2 rounded-md w-full max-w-md"
                        />
                    </div>
                    <div className="flex items-center text-3xl justify-center">
                        <input 
                            ref={passwordRef}
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'password')}
                            className="bg-zinc-50 caret-zinc-950 text-zinc-900 px-5 py-2 rounded-md w-full max-w-md"
                        />
                    </div>
                    <AnimatePresence>
                        {showSignUp && (
                            <m.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 80, y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ 
                                    height: { duration: 0.3, ease: "easeInOut" },
                                    opacity: { duration: 0.2 },
                                    y: { duration: 0.2 }
                                }}
                                className="flex items-center text-3xl justify-center overflow-hidden"
                            >
                                <input 
                                    ref={confirmPasswordRef}
                                    type="password" 
                                    placeholder="Confirm Password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
                                    className="bg-zinc-50 caret-zinc-950 text-zinc-900 px-5 py-2 rounded-md w-full max-w-md"
                                />
                            </m.div>
                        )}
                    </AnimatePresence>
                    {error && (
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xl text-center"
                        >
                            {error}
                        </m.div>
                    )}
                    <div className="flex items-center text-3xl justify-center">
                        <m.button 
                            className="bg-zinc-50 cursor-pointer text-zinc-900 px-5 py-2 rounded-md w-full max-w-md"
                            animate={{
                                opacity: showSignUp ? 0.5 : 1
                            }}
                            whileHover={{
                                opacity: 1,
                                transition: {
                                    duration: "0.3",
                                },
                            }}
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </m.button>
                    </div>
                    <div className="flex items-center text-3xl justify-center">
                        <m.button 
                            className="bg-zinc-50 cursor-pointer text-zinc-900 px-5 py-2 rounded-md w-full max-w-md"
                            animate={{
                                opacity: showSignUp ? 1 : 0.5
                            }}
                            whileHover={{
                                opacity: 1,
                                transition: {
                                    duration: "0.3",
                                },
                            }}
                            onClick={() => {
                                if (showSignUp) {
                                    handleSignUp();
                                } else {
                                    setShowSignUp(true);
                                    setError('');
                                }
                            }}
                        >
                            Sign Up
                        </m.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
