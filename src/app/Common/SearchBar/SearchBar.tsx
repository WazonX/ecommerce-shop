import { ListFilter, Search } from "lucide-react";
import { motion as m, AnimatePresence} from 'motion/react';
import Filter from "../Filter/Filter";
import { useState } from "react";
import { Product } from "../../types/product";

interface SearchBarProps {
  onSort: (field: 'price' | 'discount' | 'rating', direction: 'asc' | 'desc') => void;
  onSearchResults: (products: Product[]) => void;
}

export default function SearchBar({ onSort, onSearchResults }: SearchBarProps) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const open = () => setFilterOpen(true);
    const close = () => setFilterOpen(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const searchResults = await response.json();
            onSearchResults(searchResults);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-3/4 max-lg:w-full mx-auto flex mb-10">
            <input
              className="font-[quantico] bg-zinc-50 rounded-sm caret-zinc-900 uppercase text-black w-full mt-10 px-5 max-sm:text-sm md:text-lg xl:text-xl"
              placeholder="Search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="w-fit h-fit mt-10 px-3 cursor-pointer">
              <Search className="size-8" />
            </button>
            <m.button
              className="w-fit h-fit mt-10 cursor-pointer"
              onClick={() => (filterOpen ? close() : open())}
            >
              <AnimatePresence>
                {filterOpen && (
                  <Filter
                    filterOpen={filterOpen}
                    handleClose={close}
                    text={close}
                    onSort={(field: 'price' | 'discount' | 'rating', direction: 'asc' | 'desc') => {
                      onSort(field, direction);
                      close();
                    }}
                  />
                )}
              </AnimatePresence>

              <ListFilter className="size-8" />
            </m.button>
        </form>
    );
}