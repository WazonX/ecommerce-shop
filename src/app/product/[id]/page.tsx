'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Product } from '../../types/product';

export default function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(-1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const id = params.id as string;
                if (!id) {
                    throw new Error('Product ID is required');
                }

                console.log('Fetching product with ID:', id);
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch product');
                }

                console.log('Received product data:', data);
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

    // Get current image source
    const getCurrentImageSrc = () => {
        if (currentImageIndex === -1) {
            return product.image ? `data:image/jpeg;base64,${product.image}` : null;
        }
        if (product.images && product.images[currentImageIndex]) {
            return `/Images/${product.imagesPath}/${product.images[currentImageIndex]}`;
        }
        return null;
    };

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
                        {getCurrentImageSrc() ? (
                            <img
                                src={getCurrentImageSrc()!}
                                alt={product.title}
                                className="w-full h-full object-contain p-4"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                No image available
                            </div>
                        )}
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image: string, index: number) => (
                                <div 
                                    key={index} 
                                    className={`aspect-square bg-zinc-800 rounded-lg overflow-hidden cursor-pointer ${
                                        currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img
                                        src={`/Images/${product.imagesPath}/${image}`}
                                        alt={`${product.title} - ${index + 1}`}
                                        className="w-full h-full object-contain p-2"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.parentElement?.classList.add('hidden');
                                        }}
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
                        {product.discount > 0 ? (
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