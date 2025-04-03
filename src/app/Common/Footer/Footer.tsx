"use client";
import { motion as m } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="font-[quantico] @container">
      <div className="w-3/4 mx-auto grid grid-cols-4 gap-8 py-8 @max-xl:grid-cols-2 @max-lg:grid-cols-1">
        <div>
          <h2 className="text-2xl mb-4">About Us</h2>
          <p className="text-zinc-400">
            SSW Store is your one-stop shop for high-quality audio systems and PC components.
            We offer the best products at competitive prices.
          </p>
        </div>
        <div>
          <h2 className="text-2xl mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('0')} className="hover:underline">
                Audio System
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('1')} className="hover:underline">
                PC Components
              </button>
            </li>
            <li>
              <Link href="/Contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-4">Contact Info</h2>
          <ul className="space-y-2 text-zinc-400">
            <li>Email: s33464@pjwstk.edu.pl</li>
            <li>Phone: +48 123 456 789</li>
            <li>Address: Warsaw, Poland</li>
          </ul>
        </div>
        <div>
          <button onClick={() => handleCategoryClick(null)}
            className="text-4xl font-[kumar] m-auto text-center @max-xl:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-5 w-fit h-full"
          >
              SSW
              <br />
              Strore
          </button>        
          </div>
      </div>
      <div className="w-3/4 mx-auto py-4 border-t border-zinc-700 text-center text-zinc-400">
        <p>&copy; 2025 SSW Store by Maksymilian Gembarzewski. All rights reserved.</p>
      </div>
    </div>
  );
}
