'use client'
import { motion as m } from "motion/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Common/Auth/AuthContext";
import AuthLayout from "../Common/Layout/AuthLayout";

export default function Profile() {
    const router = useRouter();
    const { checkAuth, userInfo } = useAuth();

    useEffect(() => {
        if (!checkAuth()) {
            router.push('/Login');
        }
    }, [router, checkAuth]);

    if (!userInfo) {
        return (
            <AuthLayout title="Profile">
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
            </AuthLayout>
        );
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