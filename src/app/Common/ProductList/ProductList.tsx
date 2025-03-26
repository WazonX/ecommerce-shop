'use client';

import { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string; 
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to fetch');
                const data: Product[] = await res.json();
                console.log('Fetched Data:', data); 
                setProducts(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
            <m.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="h-fit grid grid-cols-3 w-full "
                draggable={false}
                >
                {products.map((product) => {
                    return(
                    <m.li
                        key={product.id}
                        variants={itemVariants}
                        className="bg-center grid grid-cols-1 aspect-auto px-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <m.div
                        className='text-zinc-500 opacity-0 hidden bg-zinc-700 h-fit w-fit rounded-sm p-1 absolute top-0 right-0 size-5'
                        whileHover={{
                            color: 'red',
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                            }
                        }}
                        >
                            <Heart />
                        </m.div>
                        <Link 
                        href={`/`}
                        className='w-full h-fit'
                        >
                            <img
                            className='w-full h-full p-1'
                            src={getImageSrc(product.image) || ''}/>
                            <h3
                            className='w-full h-full my-3'
                            >
                                {product.title}
                            </h3>
                            <p
                            className='w-full h-full text-right'   
                            >
                                Price: {product.price} zł
                            </p>
                        </Link>
                    </m.li>
                )})}
            </m.ul>
        
    );
};

export default ProductList;