'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    title: string;
    price: number;
    image: Buffer;
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


    const getImageSrc = (buffer: Buffer | undefined): string | null => {
        if (buffer && buffer instanceof Buffer && buffer.length > 0) {
            try {
                // Convert Buffer to Uint8Array
                const uint8Array = new Uint8Array(buffer);
                // Create a Blob from Uint8Array
                const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Make sure to use the correct MIME type
                return URL.createObjectURL(blob);  // Convert Blob to Object URL
            } catch (error) {
                console.error('Error creating image URL:', error);
            }
        } else {
            console.warn('No valid buffer data:', buffer);
        }
        return null;  // Return null if it's not a valid Buffer or it's empty
    };    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className=""
        >
            {products.map((product, i) => {
            console.log('image:', product.image);
            console.log(getImageSrc(product.image)) 
                return(
                <motion.div
                    key={i}
                    variants={itemVariants}
                    className=""
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    
                    <h2>{product.title}</h2>
                    <p>Price: ${product.price}</p>
                    <img src={getImageSrc(product.image) || ''}/>
                </motion.div>
                
)})}
        </motion.div>
        
    );
};

export default ProductList;