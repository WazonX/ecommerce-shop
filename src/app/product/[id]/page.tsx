'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ProductDetails {
    id: number;
    title: string;
    description: string;
    specification: string;
    price: number;
    discount?: number;
    rating: number;
    imagesPath: string;
    images: string[];
    image?: string;
}

export default function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error || 'Product not found'}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                        <img
                            src={product.image ? `data:image/jpeg;base64,${product.image}` : '/placeholder.png'}
                            alt={product.title}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.png';
                            }}
                        />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
                                <div key={index} className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                                    <img
                                        src={`/Images/${product.imagesPath}/${image}`}
                                        alt={`${product.title} - ${index + 1}`}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    
                    <div className="flex items-center space-x-2">
                        <Star className="text-amber-500" />
                        <span>{product.rating}</span>
                    </div>

                    <div className="text-2xl font-bold">
                        {product.discount ? (
                            <div className="space-y-1">
                                <span className="line-through text-zinc-500 text-lg">
                                    {product.price.toFixed(2)} zł
                                </span>
                                <span className="text-red-500 block">
                                    {(product.price - (product.price * product.discount / 100)).toFixed(2)} zł
                                </span>
                            </div>
                        ) : (
                            <span>{product.price.toFixed(2)} zł</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-zinc-400">{product.description}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Specification</h2>
                            <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 relative">
                                <div className="grid grid-cols-2 gap-4 p-4">
                                    <div className="space-y-4">
                                        {(() => {
                                            const lines = product.specification.split('\n');
                                            const leftItems: { [key: string]: number } = {};
                                            let currentKey = '';
                                            
                                            lines.forEach(line => {
                                                if (line.includes('*')) {
                                                    currentKey = line.replace(/\*/g, '').trim();
                                                    leftItems[currentKey] = 0;
                                                } else if (line.trim() && currentKey) {
                                                    leftItems[currentKey]++;
                                                }
                                            });

                                            return Object.entries(leftItems).map(([key, count], index) => (
                                                <div key={index} className="text-zinc-300 font-medium relative" style={{ height: `${count * 2}rem` }}>
                                                    {key}
                                                    <div className="absolute bottom-0 left-0 right-0 border-b border-zinc-700"></div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    <div className="space-y-4">
                                        {(() => {
                                            const lines = product.specification.split('\n');
                                            const rightItems: { [key: string]: string[] } = {};
                                            let currentKey = '';
                                            
                                            lines.forEach(line => {
                                                if (line.includes('*')) {
                                                    currentKey = line.replace(/\*/g, '').trim();
                                                    rightItems[currentKey] = [];
                                                } else if (line.trim() && currentKey) {
                                                    rightItems[currentKey].push(line.trim());
                                                }
                                            });

                                            return Object.values(rightItems).map((values, index) => (
                                                <div key={index} className="space-y-1 relative" style={{ height: `${values.length * 2}rem` }}>
                                                    {values.map((value, valueIndex) => (
                                                        <div key={valueIndex} className="text-zinc-400">
                                                            {value}
                                                        </div>
                                                    ))}
                                                    <div className="absolute bottom-0 left-0 right-0 border-b border-zinc-700"></div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 