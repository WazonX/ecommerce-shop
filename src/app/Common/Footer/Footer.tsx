'use client'
import { Heart, ShoppingCart, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { motion as m} from "motion/react"




export default function Navbar() {
    return (
    <div className="font-[quantico] grid grid-cols-4 @container border-t-[0.5px] py-5 border-zinc-500 w-3/4 mx-auto mt-15">
        <div
        className="mx-auto my-auto"
        >
            <span 
            className="font-[kumar] cursor-default text-5xl items-center"
            >
                SSW <br/> Store
            </span>
        </div>
        <div>
            <ul
            className="leading-7 text-center"
            >
                <li
                className="text-2xl cursor-default pb-4"
                >
                    Links
                </li>
                <li>
                    <Link href="/"
                    className="hover:underline"
                    >
                        Ubrania
                    </Link>
                </li>
                <li>
                    <Link href="/"
                    className="hover:underline"
                    >
                        Elektronika
                    </Link>
                </li>
                <li>
                    <Link href="/"
                    className="hover:underline"
                    >
                        Kontakt
                    </Link>
                </li>
            </ul>
        </div>
        <div
        className="text-center"
        >
            Contact:
            <ul>
                <li
                className="cursor-default"
                >
                    <span
                    className="text-zinc-500"
                    >
                    Street: <br/>
                    </span>
                    Kasztanowa 1/15a
                </li>
                <li>
                    <span
                    className="text-zinc-500 cursor-default"
                    >
                        Phone: <br/>
                    </span>
                    <a
                    href="tel:+48513203843"
                    className="hover:underline"
                    >
                         513203843
                    </a>
                </li>
                <li>
                    <span
                    className="text-zinc-500 cursor-default"
                    >
                        e-mail<br/>
                    </span>
                    <a
                    href="mailto:s33464@pjwstk.edu.pl"
                    className="hover:underline"
                    >
                        s33464@pjwstk.edu.pl
                    </a>
                </li>
            </ul>
        </div>
        <div
        className="place-content-between "
        >
            <div className="h-fit cursor-pointer flex items-center w-fit mx-auto">
              <ShoppingCart className="@max-lg:size-4 max-sm:size-auto size-8"/>
            </div>
            <div className="h-fitcursor-pointer flex items-center w-fit my-5 mx-auto">
              <UserRound className="@max-lg:size-4 max-sm:size-auto size-8"/>
            </div>
            <div className="cursor-pointer flex items-center w-fit h-fit mx-auto">
              <Heart className="@max-lg:size-4 max-sm:size-auto size-8"/>
        </div>
        </div>
    </div>
    );
  }
  