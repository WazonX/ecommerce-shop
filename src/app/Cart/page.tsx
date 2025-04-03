"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { useAuth } from "../Common/Auth/AuthContext";
import { useRouter } from "next/navigation";

interface ProductListProps {
  products: Product[];
}

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [removeQuantities, setRemoveQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isRemoving, setIsRemoving] = useState(false);
  const { userInfo, checkAuth } = useAuth();
  const router = useRouter();

  const getFinalPrice = (product: Product) => {
    if (!product || typeof product.price !== "number") return 0;
    return product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 1;
    const product = products.find((p) => p.id === productId);
    const maxQuantity = product?.quantity || 1;

    // Ensure the value is within bounds
    const validValue = Math.min(Math.max(1, numValue), maxQuantity);

    setRemoveQuantities((prev) => ({
      ...prev,
      [productId]: validValue,
    }));
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveItems = async () => {
    if (selectedItems.length === 0) return;

    try {
      setIsRemoving(true);
      if (!userInfo?.id) {
        throw new Error("User ID is not available");
      }

      // Create an array of objects with productId and quantity
      const itemsToRemove = selectedItems.map((id) => ({
        productId: Number(id),
        quantity: removeQuantities[id] || 1,
      }));

      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userInfo.id),
          items: itemsToRemove,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove items");
      }

      // First, mark items for removal to trigger animation
      const productsToRemove = new Set(selectedItems);
      
      // Update products state based on quantities
      setProducts(
        (prev) =>
          prev
            .map((product) => {
              const itemToRemove = itemsToRemove.find(
                (item) => item.productId === Number(product.id)
              );
              if (itemToRemove) {
                const newQuantity =
                  (product.quantity || 1) - itemToRemove.quantity;
                return newQuantity <= 0
                  ? null
                  : { ...product, quantity: newQuantity };
              }
              return product;
            })
            .filter(Boolean) as Product[]
      );

      // Wait for the exit animation to complete before resetting states
      setTimeout(() => {
        setSelectedItems([]);
        setRemoveQuantities({});
        setIsRemoving(false);
      }, 300); // Match the duration of the exit animation

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove items from cart"
      );
      setIsRemoving(false);
    }
  };

  const handleCheckout = async () => {
    if (!userInfo?.id) {
      router.push('/Login');
      return;
    }

    // Always redirect to payment page
    router.push('/Proceed-payment');
  };

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/Login");
      return;
    }

    async function fetchCartProducts() {
      if (!userInfo?.id) return;

      try {
        const res = await fetch(`/api/cart?userId=${userInfo.id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch");
        }
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        const quantityMap = new Map<number, number>();
        data.forEach((product: Product) => {
          const productId = parseInt(product.id);
          quantityMap.set(productId, (quantityMap.get(productId) || 0) + 1);
        });

        const uniqueProducts = data.filter(
          (product: Product, index: number, self: Product[]) =>
            index === self.findIndex((p) => p.id === product.id)
        );

        const productsWithQuantity = uniqueProducts.map((product: Product) => ({
          ...product,
          quantity: quantityMap.get(parseInt(product.id)) || 1,
        }));

        const sortedData = productsWithQuantity.sort(
          (a: Product, b: Product) => {
            const priceA = getFinalPrice(a);
            const priceB = getFinalPrice(b);
            return priceA - priceB;
          }
        );
        setProducts(sortedData);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch cart items"
        );
      }
    }
    fetchCartProducts();
  }, [userInfo, checkAuth, router]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: {
      x: -1000,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const getImageSrc = (imageData: string | undefined): string | null => {
    if (imageData) {
      try {
        if (imageData.startsWith("data:image")) {
          return imageData;
        }
        return `data:image/jpeg;base64,${imageData}`;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p className="text-xl">Please log in to view your cart</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p className="text-xl">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[75vh] p-4 flex flex-col">
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 w-full overflow-y-auto flex-1"
        draggable={false}
        layout
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.li
              key={product.id}
              variants={itemVariants}
              className="bg-center grid grid-cols-1 h-fit product-item relative my-3"
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
              layout
              exit="exit"
              initial="visible"
              animate="visible"
              transition={{
                layout: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <div className="grid grid-row-2 bg-zinc-800 rounded-md">
                <div className="flex">
                  <input
                    type="checkbox"
                    className="w-8 h-8 my-auto ml-4"
                    checked={selectedItems.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <div
                    className="w-full h-fit p-1 flex cursor-pointer "
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <img
                      className="aspect-square h-30 my-auto p-1"
                      src={getImageSrc(product.image) || ""}
                      alt={product.title || "Product image"}
                    />
                    <div className="flex-grow h-fit my-auto">
                      <p className="w-full text-sm overflow-hidden text-zinc-300 ">
                        {product.title || "Untitled Product"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" flex space-between w-full my-auto">
                  <div className="flex flex-col  items-center ">
                    <span className="text-zinc-500 text-lg ml-13 @max-sm:ml-4">
                      In cart: {product.quantity || 1}
                    </span>
                    <div className="flex grid-row items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (selectedItems.includes(product.id)) {
                            const currentValue = removeQuantities[product.id] || 1;
                            if (currentValue > 1) {
                              handleQuantityChange(product.id, (currentValue - 1).toString());
                            }
                          }
                        }}
                        className="w-8 h-8 bg-zinc-700 rounded-l flex items-center justify-center hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedItems.includes(product.id) || (removeQuantities[product.id] || 1) <= 1}
                      >
                        <span className="text-white text-lg">-</span>
                      </button>
                      <input
                        type="number"
                        id={`quantity-${product.id}`}
                        min="1"
                        max={product.quantity || 1}
                        value={
                          selectedItems.includes(product.id)
                            ? removeQuantities[product.id] || 1
                            : 0
                        }
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        onClick={handleInputClick}
                        className="w-20 bg-zinc-700 px-3 py-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={!selectedItems.includes(product.id)}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (selectedItems.includes(product.id)) {
                            const currentValue = removeQuantities[product.id] || 1;
                            const maxValue = product.quantity || 1;
                            if (currentValue < maxValue) {
                              handleQuantityChange(product.id, (currentValue + 1).toString());
                            }
                          }
                        }}
                        className="w-8 h-8 bg-zinc-700 rounded-r flex items-center justify-center hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedItems.includes(product.id) || (removeQuantities[product.id] || 1) >= (product.quantity || 1)}
                      >
                        <span className="text-white text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  <span className="price flex flex-col w-fit items-end flex-grow">
                    {product.discount ? (
                      <>
                        <span className="line-through text-zinc-500 text-md mx-3">
                          {product.price?.toFixed(2) || "0.00"} zł
                        </span>
                        <span className="text-red-500 text-xl mx-5">
                          {getFinalPrice(product).toFixed(2)} zł
                        </span>
                      </>
                    ) : (
                      <span className="text-lg mx-3">{product.price?.toFixed(2) || "0.00"} zł</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <motion.div 
        className="flex place-content-between w-full px-5 py-4 bg-zinc-900 mt-auto"
        animate={{
          y: isRemoving ? 20 : 0,
          opacity: isRemoving ? 0.5 : 1
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <button
          className="bg-red-700 rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRemoveItems}
          disabled={selectedItems.length === 0 || isRemoving}
        >
          Remove
        </button>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Cart Value:</span>
          <span className="text-white font-semibold">
            {products.reduce((total, item) => {
              const price = getFinalPrice(item);
              return total + (price * (item.quantity || 0));
            }, 0).toFixed(2)} zł
          </span>
        </div>
        <button 
          className="bg-zinc-800 rounded-md p-2 hover:bg-green-700 transition-colors"
          onClick={handleCheckout}
          disabled={isRemoving}
        >
          Checkout
        </button>
      </motion.div>
    </div>
  );
}
