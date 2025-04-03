"use client";
import { Heart, ShoppingCart, UserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Wishlist from "../Wishlist/Wishlist";
import { useAuth } from "../Auth/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo } = useAuth();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedWishlist = sessionStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    const handleStorageChange = () => {
      const updatedWishlist = sessionStorage.getItem('wishlist');
      if (updatedWishlist) {
        setWishlist(JSON.parse(updatedWishlist));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleUserClick = () => {
    if (userInfo) {
      router.push('/Profile');
    } else {
      router.push('/Login');
    }
  };

  const handleCartClick = () => {
    if (userInfo) {
      router.push('/Cart');
    } else {
      router.push('/Login');
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlistOpen(!isWishlistOpen);
  };

  const handleCloseWishlist = () => {
    setIsWishlistOpen(false);
  };

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    window.location.href = `/?${params.toString()}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="font-[kumar] @container ">
      <ul className="select-none caret-transparent grid grid-rows-2 h-[20vh] pt-8 @max-xl:px-0 @max-6xl:w-full @max-6xl:px-5 w-3/4 text-2xl border-b-[0.5px] border-zinc-500 mx-auto">
        <div
        className="grid grid-cols-4 flex-grow @max-6xl:hidden"
        >
        <li className=" cursor-pointer items-center text-center @max-xl:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-5 w-fit h-full">
          <button onClick={() => handleCategoryClick(null)}>
            <motion.div whileHover={{ y: -10, textShadow: "0px 10px 50px #FFF" }}>
              SSW
              <br />
              Strore
            </motion.div>
          </button>
        </li>
        
        {/* Desktop Navigation */}
        <li className="cursor-pointer  items-center @max-6xl:hidden">
          <button
            onClick={() => handleCategoryClick('0')}
            className="h-full text-center @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl flex items-center p-5 w-full"
          >
            <motion.div whileHover={{ y: -10, textShadow: "0px 10px 50px #FFF" }}>
              Audio System
            </motion.div>
          </button>
        </li>
        <li className="cursor-pointer  items-center @max-6xl:hidden">
          <button
            onClick={() => handleCategoryClick('1')}
            className="h-full text-center flex @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full"
          >
            <motion.div whileHover={{ y: -10, textShadow: "0px 10px 50px #FFF" }}>
              PC Components
            </motion.div>
          </button>
        </li>
        <li className="cursor-pointer  items-center @max-6xl:hidden">
          <Link
            href="/Contact"
            className="h-full text-center flex @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full"
          >
            <motion.div whileHover={{ y: -10, textShadow: "0px 10px 50px #FFF" }}>
              Contact Us
            </motion.div>
          </Link>
        </li>

        </div>
        <div
        className="h-full flex"
        >
          <li className="flex @max-6xl:my-auto @max-6xl:mx-10 @max-6xl:place-content-between items-end w-full gap-7 @max-6xl:gap-6 justify-end">
          <button 
            onClick={handleCartClick}
            className="cursor-pointer flex"
          >
            <ShoppingCart className=" max-sm:size-auto size-8 @max-6xl:size-20" />
          </button>
          <button 
            onClick={handleUserClick}
            className="cursor-pointer flex items-center"
          >
            <UserRound className=" max-sm:size-auto size-8 @max-6xl:size-20" />
          </button>
          <button 
            className="cursor-pointer flex items-center"
            onClick={handleWishlistClick}
          >
            <Heart className=" max-sm:size-auto size-8 @max-6xl:size-20" />
          </button>
          <button
            onClick={toggleMenu}
            className="cursor-pointer flex items-center @min-6xl:hidden"
          >
            {isMenuOpen ? (
              <X className=" @max-6xl:size-20" />
            ) : (
              <Menu className=" @max-6xl:size-20" />
            )}
          </button>
          <Wishlist
            handleClose={handleCloseWishlist}
            isOpen={isWishlistOpen}
            wishlist={wishlist}
          />
        </li>

        </div>

      </ul>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-zinc-900 @max-6xl:block hidden"
      >
        <div className="flex flex-col p-4 gap-4">
          <button
            onClick={() => {
              handleCategoryClick('0');
              setIsMenuOpen(false);
            }}
            className="text-xl text-center py-2 hover:bg-zinc-800 rounded"
          >
            Audio System
          </button>
          <button
            onClick={() => {
              handleCategoryClick('1');
              setIsMenuOpen(false);
            }}
            className="text-xl text-center py-2 hover:bg-zinc-800 rounded"
          >
            PC Components
          </button>
          <Link
            href="/Contact"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl text-center py-2 hover:bg-zinc-800 rounded"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
