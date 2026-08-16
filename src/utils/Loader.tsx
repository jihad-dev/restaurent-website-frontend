import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-slate-100">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring - Amber Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full shadow-lg shadow-amber-500/20"
        />

        {/* Middle Ring - Orange Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full shadow-md shadow-orange-500/20"
        />

        {/* Inner Ring - Deep Amber */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full"
        />

        {/* Center Culinary Icon */}
        <motion.div
          animate={{
            scale: [0.85, 1.1, 0.85],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute p-2.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 shadow-sm"
        >
          <UtensilsCrossed size={18} />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-6 text-xs font-bold uppercase tracking-widest text-amber-400/90"
      >
        Preparing Kitchen Data...
      </motion.p>
    </div>
  );
};

export default Loader;
