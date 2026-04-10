import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const BackgroundBlobs = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="noise-overlay" />
      
      {/* Blob 1 - Indigo/Blue */}
      <motion.div
        className="blob bg-indigo-600 w-[500px] h-[500px] -top-24 -left-24"
        animate={shouldReduceMotion ? undefined : {
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 - Purple/Violet */}
      <motion.div
        className="blob bg-purple-600 w-[400px] h-[400px] top-1/2 -right-24"
        animate={shouldReduceMotion ? undefined : {
          x: [0, -40, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 3 - Blue/Cyan */}
      <motion.div
        className="blob bg-blue-600 w-[300px] h-[300px] -bottom-24 left-1/4"
        animate={shouldReduceMotion ? undefined : {
          x: [0, 30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#030712]">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 40%),
                       radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)`
        }}
      />
    </div>
  );
};
