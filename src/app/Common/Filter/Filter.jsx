"use client";
import { motion as m } from "motion/react";
import { useState, useEffect } from "react";

const dropIn = {
  hide: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: {},
  },
  visible: {
    opacity: 1,
    height: "fit-content",
    y: -10,
    transition: {
      staggerChildren: 0.06,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
      duration: 0.6,
      delay: 0.7,
    },
  },
};

const itemVariants = {
  hide: {
    y: "-5vh",
    opacity: 0,
    transition: {
      type: "spring",
      bouce: 1,
      stiffness: 1000,
      damping: 150,
      velocity: 100,
      duration: 0.3,
    },
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 1000,
      damping: 150,
      velocity: 100,
      duration: 0.3,
    },
  },
  exit: {
    y: "-1vh",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 1000,
      damping: 150,
      velocity: 100,
      duration: 0.3,
    },
  },
};

const Filter = ({ handleClose, text, filterOpen, onSort }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterElement = document.getElementById('filter-container');
      const filterButton = document.getElementById('filter-button');
      
      // Don't close if clicking on the filter button or inside the filter menu
      if (filterButton?.contains(event.target) || filterElement?.contains(event.target)) {
        return;
      }

      // Close if clicking outside and not already closing
      if (text && !isClosing) {
        setIsClosing(true);
        handleClose();
        // Reset closing state after animation completes
        setTimeout(() => setIsClosing(false), 600);
      }
    };

    if (text) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text, handleClose, isClosing]);

  return (
    <>
      <m.ul
        id="filter-container"
        className="w-fit h-fit px-4 font-[quantico] max-lg:top-40 max-lg:right-5 top-50 text-lg p-2 z-[1] bg-black rounded-md text-white border-[1px] border-zinc-500 border-solid absolute"
        variants={dropIn}
        animate={text ? "visible" : "hide"}
        initial="hide"
        exit="exit"
      >
        <m.li
          variants={itemVariants}
          className="cursor-default text-zinc-500 font-bold mt-1"
        >
          Sort by Price
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('price', 'asc')}
          className="cursor-pointer"
        >
          Low to High
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('price', 'desc')}
          className="cursor-pointer"
        >
          High to Low
        </m.li>
        <m.li
          variants={itemVariants}
          className="cursor-default text-zinc-500 font-bold mt-3"
        >
          Sort by Discount
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('discount', 'desc')}
          className="cursor-pointer"
        >
          High to Low
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('discount', 'asc')}
          className="cursor-pointer"
        >
          Low to High
        </m.li>
        <m.li
          variants={itemVariants}
          className="cursor-default text-zinc-500 font-bold mt-3"
        >
          Sort by Stars
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('rating', 'desc')}
          className="cursor-pointer"
        >
          High to Low
        </m.li>
        <m.li
          variants={itemVariants}
          whileHover={{
            backgroundColor: "#666",
            boxShadow: "0px 4px 10px #999",
            y: -1,
            transition: {
              duration: "0.3",
            },
          }}
          onClick={() => onSort('rating', 'asc')}
          className="cursor-pointer"
        >
          Low to High
        </m.li>
      </m.ul>
    </>
  );
};

export default Filter;
