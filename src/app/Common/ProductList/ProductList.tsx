'use client';

import { motion as m, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Heart, Pen, Star, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Product } from '../../types/product';
import router from 'next/router';

interface ProductListProps {
    products: Product[];
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}

const ProductList = ({ products, onSort }: ProductListProps) => {
    const { userInfo } = useAuth();
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
    const [wishlistItems, setWishlistItems] = useState<number[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [isAddingToCart, setIsAddingToCart] = useState<{ [key: string]: boolean }>({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1150);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const savedWishlist = sessionStorage.getItem('wishlist');
        if (savedWishlist) {
            const wishlistData = JSON.parse(savedWishlist);
            setWishlistItems(wishlistData.map((item: Product) => Number(item.id)));
        }
    }, []);

    const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number(product.id);
        const isInWishlist = wishlistItems.includes(productId);
        let newWishlist: number[];

        if (isInWishlist) {
            newWishlist = wishlistItems.filter(id => id !== productId);
        } else {
            newWishlist = [...wishlistItems, productId];
        }

        setWishlistItems(newWishlist);

        const wishlistData = products.filter(p => newWishlist.includes(Number(p.id)));
        sessionStorage.setItem('wishlist', JSON.stringify(wishlistData));

        window.dispatchEvent(new Event('storage'));
    };

    const handleQuantityChange = (productId: string, value: string) => {
        const numValue = parseInt(value) || 1;
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, numValue)
        }));
    };

    const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!userInfo?.id) {
            router.push('/Login');
            return;
        }

        const productId = product.id;
        setIsAddingToCart(prev => ({ ...prev, [productId]: true }));

        try {
            const quantity = quantities[productId] || 1;
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo.id,
                    productId: Number(productId),
                    quantity: quantity
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            // Reset quantity after successful add
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        } finally {
            setIsAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y:50 },
        visible: {
            opacity: 1,
            y:0,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const getImageSrc = (imageData: string | undefined): string | null => {
        if (!imageData) return null;
        
        try {
            // If it's already a data URL, return it
            if (imageData.startsWith('data:image')) {
                return imageData;
            }
            
            // If it's a base64 string, add the data URL prefix
            if (/^[A-Za-z0-9+/=]+$/.test(imageData)) {
                return `data:image/jpeg;base64,${imageData}`;
            }
            
            // If it's a URL, return it as is
            if (imageData.startsWith('http')) {
                return imageData;
            }
            
            return null;
        } catch (error) {
            console.error('Error processing image data:', error);
            return null;
        }
    };

    if (!products.length) return <p>Loading...</p>;

    return (
        <div
        className='@container'
        >
        <m.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-5 @max-xl:flex @max-xl:flex-wrap grid-cols-3 max-sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 w-full"
            draggable={false}
            layout
        >
            <AnimatePresence>
                {products.map((product) => (
                    <m.li
                        key={product.id}
                        variants={itemVariants}
                        className="bg-center grid grid-cols-1 max-sm:grid-rows-1 h-full relative"
                        whileHover={!isMobile ? { y:-10 } : undefined}
                        whileTap={{ scale: 0.95 }}
                        layout
                        transition={{
                            layout: { duration: 0.3, ease: "easeInOut" }
                        }}
                        onHoverStart={() => !isMobile && setHoveredProductId(Number(product.id))}
                        onHoverEnd={() => !isMobile && setHoveredProductId(null)}
                    >
                        <div className="relative w-full h-full ">
                            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between px-2 pt-2">
                                {userInfo?.isAdmin && (
                                    <m.div
                                        className='text-zinc-500 bg-zinc-800 h-fit transition-colors hover:text-amber-200 w-fit rounded-sm p-1 size-5'
                                        animate={{
                                            opacity: hoveredProductId === Number(product.id) ? 1 : 0
                                        }}
                                        transition={{
                                            duration: 0.3
                                        }}
                                    >
                                        <Pen/>
                                    </m.div>
                                )}
                                <m.div
                                    className='text-zinc-500 bg-zinc-800 h-fit transition-colors hover:text-red-500 w-fit rounded-sm p-1 size-5 '
                                    animate={{
                                        opacity: hoveredProductId === Number(product.id) ? 1 : 0
                                    }}
                                    transition={{
                                        duration: 0.3
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWishlistClick(e, product);
                                    }}
                                >
                                    <Heart className={wishlistItems.includes(Number(product.id)) ? "text-red-500" : ""} />
                                </m.div>
                            </div>
                            <Link 
                                href={`/product/${product.id}`}
                                className='w-full flex h-full bg-zinc-800 p-3 rounded-md sm:flex-col max-sm:flex-row max-sm:mb-40'
                            >
                                <div className='max-sm:flex-row max-sm:w-full flex-grow'>
                                    <div className="flex max-sm:flex-row items-center gap-4">
                                        <div className="relative h-fit w-fit mx-auto">
                                            <img
                                                className='p-1 aspect-square rounded-md w-60'
                                                src={getImageSrc(product.image) || '/placeholder.png'}
                                                alt={product.title}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder.png';
                                                }}
                                            />
                                        </div>
                                        <div className="w-[300px] max-sm:block hidden">
                                            <h3 className='text-lg max-sm:text-xl'>
                                                {product.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 mt-4 max-sm:mb-0 max-lg:mb-20 lg:mb-20'>
                                        <div className='flex justify-between items-center'>
                                            <span className='flex flex-row items-center'>
                                                <Star className='size-5 text-amber-500 mx-1' /> 
                                                <span>{product.rating || 0}</span>
                                            </span>
                                            <span className='flex flex-col items-end'>
                                                {product.discount ? (
                                                    <>
                                                        <span className="line-through text-zinc-500 text-sm">
                                                            {product.price.toFixed(2)} zł
                                                        </span>
                                                        <span className="text-red-500 text-lg">
                                                            {(product.price - (product.price * product.discount / 100)).toFixed(2)} zł
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg">{product.price.toFixed(2)} zł</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <m.div
                                className="absolute border-zinc-800 border-2 flex-col-1 justify-between grid-cols-2 bottom-0 left-0 right-0 bg-zinc-900 p-2 flex md:items-center gap-2 rounded-sm opacity-100 translate-y-0"
                                animate={!isMobile ? {
                                    opacity: hoveredProductId === Number(product.id) ? 1 : 0,
                                    y: hoveredProductId === Number(product.id) ? 0 : 20
                                } : undefined}
                                transition={{
                                    duration: 0.3
                                }}
                            >
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                    className="w-16 aspect-square bg-zinc-800 text-white rounded px-2 py-1"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    disabled={isAddingToCart[product.id]}
                                    className="w-16 flex aspect-square items-center gap-2 border-1 transition-all duration-300 border-green-500 hover:border-transparent hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                >
                                    {isAddingToCart[product.id] ? 'Adding...' : <ShoppingCart className="size-4" />}
                                </button>
                            </m.div>
                        </div>
                    </m.li>
                ))}
            </AnimatePresence>
        </m.ul>

        </div>
    );
};

export default ProductList;