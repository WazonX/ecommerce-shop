'use client'
import { ListFilter, Search } from "lucide-react";
import {AnimatePresence, motion as m} from 'motion/react'
import { useState } from "react";
import Filter from './Common/Filter/Filter'
import Shop from './Common/Shop/Shop'
import ProductList from "./Common/ProductList/ProductList";


export default function Main() {
  
  const [filterOpen, setFilterOpen] = useState(false);
  const open = () => setFilterOpen(true);
  const close = () => setFilterOpen(false);

  return (
    <div className="grid grid-cols-1 ">
      <div className="w-3/4 mx-auto flex mb-10">

          <input className="font-[quantico] bg-zinc-50 rounded-sm uppercase text-black w-full mt-10 px-5 max-sm:text-sm md:text-lg xl:text-xl" placeholder="Search" type="text"/>
          <button className="w-fit h-fit mt-10 px-3 cursor-pointer">
            <Search className="size-8"/>
          </button>
          <m.button className="w-fit h-fit mt-10 cursor-pointer"
            onClick={() => (filterOpen ? close() : open())}
          >
                <AnimatePresence>
                    {
                        filterOpen && <Filter onClick={Filter.handleClose} filterOpen={filterOpen} handleClose={close} text={close}/>
                    }
                </AnimatePresence>

            <ListFilter className="size-8"/>
          </m.button>
      </div>
      <div className="bg-zinc-900 rounded-lg w-3/4 mx-auto h-fit px-10 py-5">
           <ProductList/>
      </div>
    </div>
  );
}
