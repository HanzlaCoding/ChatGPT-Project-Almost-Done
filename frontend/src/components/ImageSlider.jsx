import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const slidesData = [
    {
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=60&w=1080&fm=webp&auto=format&fit=crop",
        title: "Unlock Infinite Intelligence",
        subtitle: "Experience conversation that evolves with you."
    },
    {
        image: "https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=2674&auto=format&fit=crop", 
        title: "Calculated Precision",
        subtitle: "Mathematical perfection in every generated response."
    },
    {
        image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=60&w=1080&fm=webp&auto=format&fit=crop",
        title: "The Future is Fluid",
        subtitle: "Seamlessly integrate AI into your daily flow."
    }
]

const ImageSlider = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slidesData.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#1e1e24] shadow-2xl">
      {/* Images with Fade Transition */}
      <AnimatePresence mode='popLayout'>
            <motion.img
                key={index}
                src={slidesData[index].image}
                alt="Background"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
      </AnimatePresence>
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e24] via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 bg-[#4a4a58]/20 mix-blend-overlay" />

      {/* Content */}
      <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col justify-between p-12">
            
            {/* Header: Logo & Back Link */}
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                   <span className="font-heading font-bold text-2xl text-white tracking-widest">NEXUS</span>
               </div>
               
               <Link to="/" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-white/20 transition-colors">
                   Back to website →
               </Link>
            </div>

            {/* Dynamic Text */}
            <div className="mb-12">
                <AnimatePresence mode='wait'>
                    <motion.div
                       key={index}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.8 }}
                    >
                         <h1 className="text-4xl font-heading font-medium text-white leading-tight">
                            {slidesData[index].title.split(" ").map((word, i) => (
                                <span key={i} className="block">{word} </span>
                            ))}
                         </h1>
                         <p className="mt-4 text-lg text-white/80 font-light max-w-md">
                             {slidesData[index].subtitle}
                         </p>
                    </motion.div>
                </AnimatePresence>

               {/* Progress Indicators */}
               <div className="mt-8 flex gap-2">
                   {slidesData.map((_, i) => (
                       <div 
                         key={i} 
                         className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                       />
                   ))}
               </div>
            </div>
        </div>
    </div>
  )
}

export default ImageSlider
