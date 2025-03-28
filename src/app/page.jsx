"use client";
import { ListFilter, Search } from "lucide-react";
import { AnimatePresence, motion as m } from "motion/react";
import { useState, useEffect } from "react";
import Filter from "./Common/Filter/Filter";
import ProductList from "./Common/ProductList/ProductList";

export default function Main() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const open = () => setFilterOpen(true);
  const close = () => setFilterOpen(false);

  const getFinalPrice = (product) => {
    return product.discount 
      ? product.price - (product.price * product.discount / 100)
      : product.price;
  };

  const handleSort = (field, direction) => {
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
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const sortedData = data.sort((a, b) => {
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-3/4 mx-auto flex mb-10">
        <input
          className="font-[quantico] bg-zinc-50 rounded-sm caret-zinc-900 uppercase text-black w-full mt-10 px-5 max-sm:text-sm md:text-lg xl:text-xl"
          placeholder="Search"
          type="text"
        />
        <button className="w-fit h-fit mt-10 px-3 cursor-pointer">
          <Search className="size-8" />
        </button>
        <m.button
          className="w-fit h-fit mt-10 cursor-pointer"
          onClick={() => (filterOpen ? close() : open())}
        >
          <AnimatePresence>
            {filterOpen && (
              <Filter
                onClick={Filter.handleClose}
                filterOpen={filterOpen}
                handleClose={close}
                text={close}
                onSort={(field, direction) => {
                  handleSort(field, direction);
                  close();
                }}
              />
            )}
          </AnimatePresence>

          <ListFilter className="size-8" />
        </m.button>
      </div>
      <div className="bg-zinc-900 rounded-lg mx-auto w-3/4 px-10 py-5 flex-grow">
        <ProductList products={products} onSort={handleSort} />
      </div>
    </div>
  );
}
