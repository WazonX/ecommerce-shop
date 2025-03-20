'use client'
import { Heart, ShoppingCart, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { motion as m} from "motion/react"




export default function Navbar() {
    return (
      <div className="font-[kumar] @container">
        <ul className="select-none caret-transparent grid  grid-cols-23 pt-8 @max-xl:px-0 @max-6xl:w-full @max-6xl:px-5 w-3/4 text-2xl border-b-[0.5px] border-zinc-500 mx-auto ">
          <li className="col-span-5 cursor-pointer items-center text-center @max-xl:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-5 w-fit h-full">
              <Link href={{pathname:"/"}}>
              <m.div
                whileHover={{y:-10,
                textShadow:'0px 10px 50px #FFF',
              }}>
                 SSW<br/>Strore
              </m.div>
               
              </Link>
          </li>
          <li className="cursor-pointer col-span-5 items-center">
            <Link href={{pathname:"/"}} className="h-full text-center @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl flex items-center p-5 w-full">
              <m.div
              whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}>
                Audio System
              </m.div>
            </Link>
          </li>
          <li className="cursor-pointer col-span-6 items-center">
          <Link href={{pathname:"/"}} className="h-full text-center flex @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full">
              <m.div
              whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}>
                Computer Components
              </m.div>
              
            </Link>
          </li>
          <li className="cursor-pointer col-span-5 items-center">
          <Link href={{pathname:"/"}} className="h-full text-center flex @max-xl:text-lg @max-3xl:text-base @max-4xl:text-md @max-6xl:p-0 md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full">
            <m.div
            whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}
            >
              Contact Us
            </m.div>
            </Link>
          </li>
          <li
          className=""
          >
            <div className="h-1/2 cursor-pointer flex items-center">
              <ShoppingCart className="@max-lg:size-4 @max-3xl:size-5 @max-6xl:size-6 max-sm:size-auto size-8"/>
            </div>
            <div className="h-1/2 cursor-pointer  flex items-center">
              <UserRound className="@max-lg:size-4@max-3xl:size-5  @max-6xl:size-6 max-sm:size-auto size-8"/>
            </div>
          </li>
            <li className="cursor-pointer flex items-center ">
              <Heart className="@max-lg:size-4  @max-3xl:size-5 @max-6xl:size-6 max-sm:size-auto size-8"/>
            </li>
        </ul>
      </div>
    );
  }
  