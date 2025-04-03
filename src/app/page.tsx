"use client";
import { ListFilter, Search } from "lucide-react";
import { AnimatePresence, motion as m } from "motion/react";
import { useState, useEffect } from "react";
import Filter from "./Common/Filter/Filter";
import ProductList from "./Common/ProductList/ProductList";
import SearchBar from "./Common/SearchBar/SearchBar";
import { Product } from "./types/product";
import { useSearchParams } from 'next/navigation';

export default function Main() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const getFinalPrice = (product: Product) => {
    return product.discount 
      ? product.price - (product.price * product.discount / 100)
      : product.price;
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    
    const sortedProducts = [...products].sort((a, b) => {
      if (field === 'price') {
        const priceA = getFinalPrice(a);
        const priceB = getFinalPrice(b);
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      } else if (field === 'discount') {
        const discountA = a.discount || 0;
        const discountB = b.discount || 0;
        return direction === 'asc' ? discountA - discountB : discountB - discountA;
      } else if (field === 'rating') {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return direction === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl = '/api/products';
        const url = category 
          ? `${baseUrl}?category=${encodeURIComponent(category)}`
          : baseUrl;
        
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data = await res.json();
        const sortedData = data.sort((a: Product, b: Product) => {
          const priceA = getFinalPrice(a);
          const priceB = getFinalPrice(b);
          return priceA - priceB;
        });
        setProducts(sortedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, [category]);

  return (
      <div className="flex flex-col  rounded-lg @max-6xl:w-full mx-auto w-3/4 px-10 py-5 flex-grow">
        <SearchBar onSort={handleSort} />
        <ProductList products={products} onSort={handleSort} />
      </div>
  );
} 