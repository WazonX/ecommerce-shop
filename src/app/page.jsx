'use client'
import { ListFilter, Search } from "lucide-react";
import {AnimatePresence, motion as m} from 'motion/react'
import { useState } from "react";
import Filter from './Common/Filter/Filter'

export default function Home() {
  
  const [filterOpen, setFilterOpen] = useState(false);
  const open = () => setFilterOpen(true);
  const close = () => setFilterOpen(false);

  return (
    <div className="flex ">
      <div className="w-3/4 mx-auto flex">
          <input className="font-[quantico] bg-amber-50 rounded-sm uppercase text-black w-full mt-14 px-5 text-xl" placeholder="Search" type="text"/>
          <button className="w-fit h-fit mt-14 px-3 cursor-pointer">
            <Search className="size-8"/>
          </button>
          <m.button className="w-fit h-fit mt-14 cursor-pointer"
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
    </div>
  );
}
