'use client';

import { motion as m, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Heart, Pen, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string; 
    rating: number;
    discount: number;
}

interface ProductListProps {
    products: Product[];
    onSort: (direction: 'asc' | 'desc') => void;
}

const ProductList = ({ products, onSort }: ProductListProps) => {
    const { userInfo } = useAuth();
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

    const [isHovered, setIsHovered] = useState(false);

    const getImageSrc = (imageData: string | undefined): string | null => {
        if (imageData) {
            try {
                if (imageData.startsWith('data:image')) {
                    return imageData;
                }
                return `data:image/jpeg;base64,${imageData}`;
            } catch (error) {
                console.error('Error processing image data:', error);
            }
        }
        return null;
    };    

    if (!products.length) return <p>Loading...</p>;

    return (
        <m.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-5 grid-cols-4 w-full"
            draggable={false}
            layout
        >
            <AnimatePresence>
                {products.map((product) => (
                    <m.li
                        key={product.id}
                        variants={itemVariants}
                        className="bg-center grid grid-cols-1 h-full product-item relative"
                        whileHover={{ y:-10 }}
                        whileTap={{ scale: 0.95 }}
                        layout
                        transition={{
                            layout: { duration: 0.3, ease: "easeInOut" }
                        }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        {userInfo?.isAdmin && (
                            <m.div
                                className='text-zinc-500 opacity-0 bg-zinc-700 h-fit hover:text-amber-200 w-fit rounded-sm p-1 absolute top-0 left-0 size-5'
                                animate={{
                                    opacity: isHovered ? 1 : 0
                                }}
                                transition={{
                                    duration: 0.3
                                }}
                            >
                                <Pen/>
                            </m.div>
                        )}
                        <m.div
                            className='text-zinc-500 opacity-0 bg-zinc-700 h-fit hover:text-red-500 w-fit rounded-sm p-1 absolute top-0 right-0 size-5'
                            animate={{
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{
                                duration: 0.3
                            }}
                        >
                            <Heart />
                        </m.div>
                        <Link 
                            href={`/`}
                            className='w-full h-full bg-zinc-800 p-3 flex flex-col'
                        >
                            <img
                                className='w-full p-1'
                                src={getImageSrc(product.image) || ''}/>
                            <h3
                                className='w-full h-fit my-3'
                            >
                                {product.title}
                            </h3>
                            <span
                                className='mt-auto self-start'
                            >
                              <Star 
                                className='size-5 text-amber-500 float-left mx-1'
                              /> {product.rating}
                            </span>
                            <span
                                className='mt-auto self-end price flex flex-col items-end'   
                            >
                                {product.discount ? (
                                    <>
                                        <span className="line-through text-zinc-500 text-sm">
                                            {product.price.toFixed(2)} zł
                                        </span>
                                        <span className="text-red-500">
                                            {(product.price - (product.price * product.discount / 100)).toFixed(2)} zł
                                        </span>
                                    </>
                                ) : (
                                    <span>{product.price.toFixed(2)} zł</span>
                                )}
                            </span>
                        </Link>
                    </m.li>
                ))}
            </AnimatePresence>
        </m.ul>
    );
};

export default ProductList;