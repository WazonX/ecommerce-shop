'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    isAdmin?: boolean;
    country?: string;
    city?: string;
    zipCode?: string;
    street?: string;
}

interface AuthContextType {
    userInfo: UserInfo | null;
    isLoading: boolean;
    login: (userId: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async (userId: string) => {
        try {
            // Handle admin user
            if (userId === "admin") {
                setUserInfo({
                    firstName: "Admin",
                    lastName: "User",
                    email: "admin@admin.com",
                    id: "admin",
                    isAdmin: true
                });
                return;
            }

            console.log('Fetching user data for ID:', userId);
            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Failed to fetch user data:', data.error);
                throw new Error(data.error || 'Failed to fetch user data');
            }

            // Check if user is admin based on email
            const isAdmin = data.user.email === "admin@admin.com";
            
            console.log('User data fetched successfully:', { ...data.user, isAdmin });
            setUserInfo({ ...data.user, isAdmin });
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error instanceof Error && !error.message.includes('not found')) {
                logout();
            }
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetchUserData(userId);
        }
        setIsLoading(false);
    }, []);

    const login = async (userId: string) => {
        try {
            sessionStorage.setItem('userId', userId);
            await fetchUserData(userId);
        } catch (error) {
            console.error('Login error:', error);
            logout();
        }
    };

    const logout = () => {
        sessionStorage.removeItem('userId');
        setUserInfo(null);
        router.push('/');
    };

    const checkAuth = () => {
        return !!sessionStorage.getItem('userId');
    };

    return (
        <AuthContext.Provider value={{ userInfo, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 