import { motion as m } from "motion/react" 
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Link from "next/link";



function Shop({ items, setIndex }:{items:any,setIndex:any}) {
    return (
      <ul className='flex flex-wrap list-none w-full gap-5'>
        {items.map((image:any, i:any) => (
            <Link href={"/"} 
            key={i}
            className="grid grid-cols-4 w-full"
            >
                <m.li
                key={i}
                className="h-fit w-fit col-span-2 border-solid border-1 border-zinc-800"
                whileHover={{y:-5}}
                transition={{ duration: 0.2 }}
                >
                    <m.div
                    key={i}
                    className="bg-no-repeat w-full grow bg-cover bg-center flex-xs aspect-video "
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                    }}
                    style={{ backgroundImage: `url(`+image.src+`)` }}
                    layoutId={image}
                    >

                    </m.div>
                    {image.src}
                </m.li>
            </Link>
        ))}
      </ul>
    );
  }

  export default function App() {
    const [id, setId] = useState(-1);
    return (
      <div className="w-full">
        <Shop items={images} setIndex={setId} />
        <AnimatePresence>
          {id !== -1 && (
            <m.div
              initial={{ opacity: 0}}
              animate={{ opacity: 0.8, transition:{duration:0.3} }}
              exit={{ opacity: 0, transition:{duration:0.3}  }}
              key="overlay"
              className="overlay"
              onClick={() => setId(-1)}
            />
          )}
          
        </AnimatePresence>
      </div>
    );
  }
