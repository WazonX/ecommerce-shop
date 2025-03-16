'use client'
import { ShoppingCart, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { motion as m} from "motion/react"




export default function Navbar() {
    return (
      <div className="font-[kumar]">
        <ul className="select-none caret-transparent flex place-content-between pt-8 w-3/4 text-2xl border-b-[0.5px] border-gray-400 mx-auto ">
          <li className=" cursor-pointer items-center text-center sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-5 w-fit h-full">
              <Link href={{pathname:"/"}}>
              <m.div
                whileHover={{y:-10,
                textShadow:'0px 10px 50px #FFF',
              }}>
                 SSW<br/>Strore
              </m.div>
               
              </Link>
          </li>
          <li className="h-fit w-fit cursor-pointer items-center">
            <Link href={{pathname:"/"}} className="h-full sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl flex items-center p-5 w-full">
              <m.div
              whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}>
                Ubrania
              </m.div>
              
            </Link>
          </li>
          <li className="h-full cursor-pointer  items-center">
          <Link href={{pathname:"/"}} className="h-full flex sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full">
              <m.div
              whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}>
                Elektronika
              </m.div>
              
            </Link>
          </li>
          <li className="h-full cursor-pointer  items-center">
          <Link href={{pathname:"/"}} className="h-full flex sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl items-center p-5 w-full">
            <m.div
            whileHover={{y:-10,
              textShadow:'0px 10px 50px #FFF',
            }}
            >
              Kontakt
            </m.div>
            </Link>
          </li>
          <li>
            <div className="h-1/2 cursor-pointer  items-center">
              <ShoppingCart/>
            </div>
            <div className="h-1/2 cursor-pointer  items-center">
              <UserRound/>
            </div>
          </li>
        </ul>
      </div>
    );
  }
  