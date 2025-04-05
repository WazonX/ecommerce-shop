'use client'
import { UserRound } from "lucide-react";
import { motion as m } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import AuthButtons from "../Buttons/AuthButtons";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/AuthContext";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}
interface FormData {
    country: string;
    city: string;
    zipCode: string;
    street: string;
    firstName: string;
    lastName: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    const router = useRouter();
    const { checkAuth, userInfo } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        country: '',
        city: '',
        zipCode: '',
        street: '',
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        if (userInfo) {
            setFormData({
                country: userInfo.country || '',
                city: userInfo.city || '',
                zipCode: userInfo.zipCode || '',
                street: userInfo.street || '',
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || ''
            });

            // Check if user is admin and redirect
            if (userInfo.isAdmin) {
                router.push('/AdminPanel');
            }
        }
        setIsLoading(false);
    }, [userInfo, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveChanges = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            if (!userId || !userInfo) return;

            const response = await fetch(`/api/users/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userInfo,
                    ...formData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const data = await response.json();
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes. Please try again.');
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center my-5">
                <div className="h-[75vh] bg-zinc-900 w-3/4 rounded-lg flex items-center justify-center flex-col">
                    <div className="rounded-lg h-2/3 w-full px-10 grid grid-cols-1">
                        <div className="text-white text-7xl font-bold w-full font-[quantico] text-center">
                            {title}
                        </div>
                        <div className="flex items-center justify-center">
                            <UserRound className="size-50" />
                        </div>
                        {children}
                    </div>
                    <div>
                        
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div
                        className="grid grid-cols-1 gap-4 mb-5 col-span-2 mx-auto"
                        >
                        <div>
                            First Name:<br/>
                            <input 
                                type="text" 
                                name="firstName"
                                placeholder={userInfo?.firstName}
                                onChange={handleInputChange}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>
                        <div>
                            Last Name:<br/>
                            <input 
                                type="text" 
                                name="lastName"
                                placeholder={userInfo?.lastName}
                                onChange={handleInputChange}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>

                        </div>
                        <div>
                            Country:<br/>
                            <input 
                                type="text" 
                                name="country"
                                placeholder={formData.country}
                                onChange={handleInputChange}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>
                        <div>
                            City:<br/>
                            <input 
                                type="text" 
                                name="city"
                                placeholder={formData.city}
                                onChange={handleInputChange}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>
                        <div>
                            Zip-Code:<br/>
                            <input 
                                type="text" 
                                name="zipCode"
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '');
                                                                        let formattedValue = digits;
                                    if (digits.length >= 2) {
                                        formattedValue = digits.slice(0, 2) + '-' + digits.slice(2, 5);
                                    }                                
                                    formattedValue = formattedValue.slice(0, 6);
                                    handleInputChange({
                                        target: {
                                            name: 'zipCode',
                                            value: formattedValue
                                        }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }}
                                maxLength={6}
                                pattern="\d{2}-\d{3}"
                                placeholder={formData.zipCode}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>
                        <div>
                            Street:<br/>
                            <input 
                                type="text" 
                                name="street"
                                placeholder={formData.street}
                                onChange={handleInputChange}
                                className="bg-zinc-800 caret-white text-white rounded-md px-2 py-1" 
                            />
                        </div>
                    </div>
                    <AuthButtons onSave={saveChanges} />
                </div>
            </div>
        </div>
    );
} 