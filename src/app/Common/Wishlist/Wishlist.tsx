"use client";
import { motion as m } from "motion/react";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";

const dropIn = {
  hide: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: {},
  },
  visible: {
    opacity: 1,
    height: "400px",
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hide: {
    y: -20,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 1000,
      damping: 150,
      velocity: 100,
      duration: 0.3,
    },
  },
  visible: {
    y: 0,
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
    y: -10,
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

interface WishlistProps {
  handleClose: () => void;
  isOpen: boolean;
  wishlist: any[];
}

const Wishlist = ({ handleClose, isOpen, wishlist }: WishlistProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleRemoveFromWishlist = (itemId: number) => {
    const currentWishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]');
    const updatedWishlist = currentWishlist.filter((item: any) => item.id !== itemId);
    sessionStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const wishlistElement = document.getElementById('wishlist-container');
      if (isOpen && wishlistElement && !wishlistElement.contains(event.target as Node) && !isClosing) {
        setIsClosing(true);
        handleClose();
        setTimeout(() => setIsClosing(false), 300);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose, isClosing]);

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


  return (
    <>
      <m.div
        id="wishlist-container"
        className="absolute font-[quantico] right-0 top-0 mt-2 w-96 bg-black rounded-md text-white border-[1px] border-zinc-500 z-30 overflow-hidden"
        variants={dropIn}
        animate={isOpen ? "visible" : "hide"}
        initial="hide"
        exit="exit"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <m.div
              variants={itemVariants}
              className="cursor-default text-zinc-500 font-bold"
            >
              Wishlist
            </m.div>
            <button 
              onClick={handleClose}
              className="text-zinc-500 hover:text-white transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[350px]">
            {wishlist.length === 0 ? (
              <m.div
                variants={itemVariants}
                className="text-zinc-500 text-center py-4"
              >
                No items in wishlist
              </m.div>
            ) : (
              wishlist.map((item) => (
                <m.div
                  key={item.id}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-2 hover:bg-zinc-800 rounded-md cursor-pointer mb-2"
                  whileHover={{
                    backgroundColor: "#27272a",
                    transition: {
                      duration: 0.3,
                    },
                  }}
                >
                  <img
                    src={getImageSrc(item.image) || ''}
                    alt={item.title}
                    className="aspect-video h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="text-xs text-balance truncate">{item.title}</h3>
                    <p className="text-zinc-400">{(item.price - (item.price * item.discount / 100)).toFixed(2)} zł</p>
                  </div>
                  <Heart 
                    className="text-red-500 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.id);
                    }}
                  />
                </m.div>
              ))
            )}
          </div>
        </div>
      </m.div>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-20"
        />
      )}
    </>
  );
};

export default Wishlist; 