'use client'
import { motion as m } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../Common/Auth/AuthContext";


export default function AddProduct() {
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
            const imageFile = formData.get('image') as File;
            let imageBase64 = '';

            // Convert image to base64 if it exists
            if (imageFile && imageFile.size > 0) {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve(base64String.split(',')[1]); // Remove data URL prefix
                    };
                    reader.onerror = () => reject(new Error('Failed to read file'));
                    reader.readAsDataURL(imageFile);
                });
            }

            const productData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                specification: formData.get('specification') as string,
                price: Number(formData.get('price')),
                discount: Number(formData.get('discount')) || 0,
                rating: Number(formData.get('rating')) || 0,
                category: Number(formData.get('category')),
                subcategory: Number(formData.get('subcategory')),
                image: imageBase64 || null
            };
            
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add product');
            }
            
            router.push('/AdminPanel');
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err instanceof Error ? err.message : 'Failed to add product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div title="Add Product">
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div title="Add Product">
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
                                <label htmlFor="title" className="block text-white mb-2">Title</label>
                                <input 
                                    type="text" 
                                    id="title"
                                    name="title" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="price" className="block text-white mb-2">Price</label>
                                <input 
                                    type="number" 
                                    id="price"
                                    name="price" 
                                    min="0" 
                                    step="0.01" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="discount" className="block text-white mb-2">Discount %</label>
                                <input 
                                    type="number" 
                                    id="discount"
                                    name="discount" 
                                    min="0" 
                                    max="100" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    defaultValue="0"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="rating" className="block text-white mb-2">Rating</label>
                                <input 
                                    type="number" 
                                    id="rating"
                                    name="rating" 
                                    min="0" 
                                    max="5" 
                                    step="0.1" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    defaultValue="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-white mb-2">Category</label>
                                <select 
                                    id="category"
                                    name="category" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required
                                >
                                    <option value="0">0-Audio</option>
                                    <option value="1">1-PC Components</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="subcategory" className="block text-white mb-2">Subcategory</label>
                                <select 
                                    id="subcategory"
                                    name="subcategory" 
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                    required
                                >
                                    <option value="0">0-RAM disc</option>
                                    <option value="1">1-GPU</option>
                                    <option value="2">2-Headphones</option>
                                    <option value="3">3-Speakers</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-white mb-2">Description</label>
                            <textarea 
                                id="description"
                                name="description" 
                                rows={4} 
                                className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                required
                            ></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="specification" className="block text-white mb-2">Specification</label>
                            <textarea 
                                id="specification"
                                name="specification" 
                                rows={4} 
                                className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-white mb-2">Product Image</label>
                            <input 
                                type="file" 
                                id="image"
                                name="image" 
                                accept="image/*"
                                className="w-full bg-zinc-700 text-white p-3 rounded-lg"
                            />
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
                                {submitting ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </m.div>
        </div>
    );
} 