'use client'
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Common/Auth/AuthContext";
import AuthLayout from "../Common/Layout/AuthLayout";

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
}

export default function Profile() {
    const router = useRouter();
    const { checkAuth } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!checkAuth()) {
            router.push('/Login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    router.push('/Login');
                    return;
                }

                const response = await fetch(`/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserInfo(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/Login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router, checkAuth]);

    if (isLoading) {
        return (
            <AuthLayout title="Profile">
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
            </AuthLayout>
        );
    }

    if (!userInfo) {
        return null;
    }

    return (
        <AuthLayout title="Profile">
            <div className="text-white text-3xl text-center">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Welcome, {userInfo.firstName} {userInfo.lastName}!
                </m.div>
            </div>
        </AuthLayout>
    );
} 