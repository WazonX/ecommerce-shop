import { ListFilter, Search } from "lucide-react";
import { motion as m, AnimatePresence} from 'motion/react';
import Filter from "../Filter/Filter";
import { useState } from "react";

interface SearchBarProps {
  onSort: (field: 'price' | 'discount' | 'rating', direction: 'asc' | 'desc') => void;
}

export default function SearchBar({ onSort }: SearchBarProps) {
    const [filterOpen, setFilterOpen] = useState(false);

    const open = () => setFilterOpen(true);
    const close = () => setFilterOpen(false);

    return (
        <div className="w-3/4 max-lg:w-full mx-auto flex mb-10">
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
        </div>
    );
}