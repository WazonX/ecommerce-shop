'use client'
import { motion as m } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/AuthContext";

interface AuthButtonsProps {
    onSave?: () => Promise<void>;
}

export default function AuthButtons({ onSave }: AuthButtonsProps) {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <div className="grid grid-cols-2  gap-4 z-50 mx-auto ">
            <m.button 
                className="bg-zinc-50 cursor-pointer text-zinc-900 px-8 py-3 rounded-md text-xl font-[quantico] shadow-lg"
                whileHover={{
                    opacity: 0.8,
                    y: -5,
                    transition: {
                        duration: "0.3",
                    },
                }}
                onClick={() => router.push('/')}
            >
                Back to Home
            </m.button>
            <m.button 
                className="bg-zinc-50 cursor-pointer text-zinc-900 px-8 py-3 rounded-md text-xl font-[quantico] shadow-lg"
                whileHover={{
                    opacity: 0.8,
                    y: -5,
                    transition: {
                        duration: "0.3",
                    },
                }}
                onClick={onSave}
            >
                Save Changes
            </m.button>
            <m.button 
                className="bg-red-500 col-span-2  mx-auto cursor-pointer text-white px-8 py-3 rounded-md text-xl font-[quantico] shadow-lg"
                whileHover={{
                    opacity: 0.8,
                    y: -5,
                    transition: {
                        duration: "0.3",
                    },
                }}
                onClick={logout}
            >
                Logout
            </m.button>
        </div>
    );
} 