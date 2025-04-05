'use client'
import { motion as m } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../Common/Auth/AuthContext";
import { Product } from "../../../types/product";

interface ProductProps {
    products: Product[];
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}


export default function EditProduct() {
    const params = useParams();
    const router = useRouter();
    const { checkAuth, userInfo } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!checkAuth() || !userInfo?.isAdmin) {
            router.push('/Login');
            return;
        }
    }, [router, checkAuth, userInfo]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const id = params.id as string;
                if (!id) {
                    throw new Error('Product ID is required');
                }

                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch product');
                }

                const data = await response.json();
                if (data && typeof data.id === 'string') {
                    data.id = parseInt(data.id, 10);
                }

                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;

        setSubmitting(true);
        setError(null);
        
        try {
            const formData = new FormData(e.currentTarget);
            const updatedProduct = {
                ...product,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                specification: formData.get('specification') as string,
                price: Number(formData.get('price')),
                discount: Number(formData.get('discount')),
                rating: Number(formData.get('rating')),
                category: Number(formData.get('category'))
            };

            const response = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct)
            });

            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                throw new Error('Failed to update product');
            }

            console.log('Product updated successfully');
            router.push('/AdminPanel');
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div title="Edit Product">
                <div className="text-white text-3xl text-center">
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div title="Edit Product">
                <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="text-red-500 text-xl font-semibold mb-4">
                        Error: {error}
                    </div>
                    <div className="text-white mb-4">
                        <p>Please check the console for more details or try again.</p>
                    </div>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => router.push('/AdminPanel')}
                        className="bg-zinc-600 text-white px-4 py-2 rounded-lg"
                    >
                        Back to Admin Panel
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div title="Edit Product">
                <div className="text-red-500 text-3xl text-center">
                    Product not found
                </div>
            </div>
        );
    }

    return (
        <div title="Edit Product">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl mx-auto p-4"
            >
                <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Edit Product: {product.title}</h2>
                        {product.image && (
                            <img 
                                src={`data:image/jpeg;base64,${product.image}`}
                                alt={product.title}
                                className="h-16 w-16 object-cover rounded"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.png';
                                }}
                            />
                        )}
                    </div>
                    
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
                                    defaultValue={product.title}
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
                                    defaultValue={product.price}
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
                                    defaultValue={product.discount || 0}
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
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
                                    defaultValue={product.rating || 0}
                                    className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-white mb-2">Description</label>
                            <textarea 
                                id="description"
                                name="description" 
                                rows={4} 
                                defaultValue={product.description || ''}
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
                                defaultValue={product.specification || ''}
                                className="w-full bg-zinc-700 text-white p-3 rounded-lg" 
                                required
                            ></textarea>
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
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </m.div>
        </div>
    );
} 