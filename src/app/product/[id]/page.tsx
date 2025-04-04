'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Product } from '../../types/product';
import { useAuth } from '../../Common/Auth/AuthContext';

interface Comment {
    id: number;
    text: string;
    rating: number;
    firstName: string;
    lastName: string;
}

export default function ProductDetails() {
    const params = useParams();
    const { userInfo } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);

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

    useEffect(() => {
        const fetchComments = async () => {
            if (!product) return;
            
            try {
                // Simple fetch without any complex error handling
                const response = await fetch(`/api/comments?productId=${product.id}`);
                const data = await response.json();
                
                // Simple check for data structure
                if (data && data.comments) {
                    setComments(data.comments);
                } else {
                    setComments([]);
                }
            } catch (error) {
                // Just log the error and set empty comments
                console.error('Error fetching comments');
                setComments([]);
            }
        };
        
        fetchComments();
    }, [product]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userInfo?.id) {
            setCommentError('Please log in to leave a comment');
            return;
        }
        
        if (!commentText.trim()) {
            setCommentError('Please enter a comment');
            return;
        }
        
        setIsSubmitting(true);
        setCommentError(null);
        
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo.id,
                    productId: product?.id,
                    text: commentText,
                    rating
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit comment');
            }
            
            // Add the new comment to the list
            if (data.comment) {
                setComments(prevComments => [data.comment, ...prevComments]);
            }
            
            // Reset form
            setCommentText('');
            setRating(5);
        } catch (error) {
            console.error('Error submitting comment:', error);
            setCommentError(error instanceof Error ? error.message : 'Failed to submit comment');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                {/* Product Image */}
                <div className="space-y-4">
                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                        {product.image ? (
                            <img
                                src={`data:image/jpeg;base64,${product.image}`}
                                alt={product.title}
                                className="w-full h-full object-contain p-4"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                No image available
                            </div>
                        )}
                    </div>
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

            {/* Comments Section */}
            <div className="mt-12 space-y-8">
                <h2 className="text-2xl font-bold">Comments</h2>
                
                {/* Comment Form */}
                <div className="bg-zinc-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
                    
                    {commentError && (
                        <div className="bg-red-900 text-red-200 p-3 rounded mb-4">
                            {commentError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium mb-2">
                                Rating
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-6 h-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-600'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium mb-2">
                                Your Comment
                            </label>
                            <textarea
                                id="comment"
                                rows={4}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full bg-zinc-700 text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Share your thoughts about this product..."
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Comment'}
                        </button>
                    </form>
                </div>
                
                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-zinc-400 italic">No comments yet. Be the first to review this product!</p>
                    ) : (
                        <div>
                            <p className="text-zinc-400 mb-4">Showing {comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-zinc-800 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium">
                                            {comment.firstName} {comment.lastName}
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                                            <span>{comment.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 