'use client'
import { delay } from 'motion';
import {motion as m} from 'motion/react'

const dropIn = {
    hide: {
      opacity: 0,
      height: 0,
      y:-10,
      transition: {

      },
    },
    visible: {
      opacity: 1,
      height: "fit-content",
      y:-10,
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
        delay: 0.7
      },
    },
  };

  const itemVariants = {
    hide: {
      y: "-5vh",
      opacity: 0,
      transition: {
      type:"spring", bouce:1, stiffness: 1000, damping: 150, velocity: 100, duration: 0.3,
      }
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        type:"spring", stiffness: 1000, damping: 150, velocity: 100, duration: 0.3,
        }
      },
      exit: {
        y: "-1vh",
        opacity: 0,
        transition: {
          type:"spring", stiffness: 1000, damping: 150, velocity: 100, duration: 0.3,
          }
        },
  };
  
  

const Filter = ({ handleClose, text }) => {
    return(
        <>
            <m.ul 
            onClick={handleClose}
            className="w-fit h-fit px-4 font-[quantico] top-50 text-lg p-2 z-[1] bg-black rounded-md text-white border-[1px] border-zinc-500 border-solid absolute"
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
                        backgroundColor:'#666',
                        boxShadow: '0px 4px 10px #999',
                        y:-1,
                        transition: {
                            duration: "0.3"
                        }
                    }}
                >
                    Low to High 
                </m.li>
                <m.li
                 variants={itemVariants}
                whileHover={{
                    backgroundColor:'#666',
                    boxShadow: '0px 4px 10px #999',
                    y:-1,
                    transition: {
                        duration: "0.3"
                    }}   
                }>
                    High to Low 
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
                    backgroundColor:'#666',
                    boxShadow: '0px 4px 10px #999',
                    y:-1,
                    transition: {
                        duration: "0.3"
                    } }  
                }
                >
                    Low to High 
                </m.li>
                <m.li
                 variants={itemVariants}
                whileHover={{        
                    backgroundColor:'#666',
                    boxShadow: '0px 4px 10px #999',
                    y:-1,
                    transition: {
                        duration: "0.3"
                    }}  
                }
                >
                    High to Low 
                </m.li> 
                <m.li
                variants={itemVariants}
                className="cursor-default text-zinc-500 font-bold mt-3"
                >
                    Sort by Sale
                </m.li>
                <m.li
                 variants={itemVariants}
                whileHover={{        
                    backgroundColor:'#666',
                    boxShadow: '0px 4px 10px #999',
                    y:-1,
                    transition: {
                        duration: "0.3"
                    }}  
                }
                >
                    Low to High 
                </m.li>
                <m.li
                 variants={itemVariants}
                whileHover={{        
                    backgroundColor:'#666',
                    boxShadow: '0px 4px 10px #999',
                    y:-1,
                    transition: {
                        duration: "0.3"
                    }}  
                }
                className="mb-1"
                >
                    High to Low 
                </m.li> 
            </m.ul>
            <div
            onClick={handleClose}
            className='w-full h-full absolute top-0 left-0 z-[0]'
            />
        </>

    )
}

export default Filter;