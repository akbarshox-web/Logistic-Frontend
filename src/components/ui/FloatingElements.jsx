import React from "react";
import { motion } from "framer-motion";

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Animated Blobs */}
      <div className="blob w-72 h-72 bg-blue-300 top-[-10%] left-[-5%] mix-blend-multiply opacity-20 filter blur-3xl animate-blob"></div>
      <div className="blob w-80 h-80 bg-purple-300 top-[-5%] right-[-5%] mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="blob w-96 h-96 bg-indigo-300 bottom-[-10%] left-[20%] mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* Glass circles */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full border border-white/30 glass hidden md:block"
      />
      <motion.div 
        animate={{ 
          y: [0, 40, 0],
          x: [0, -20, 0],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full border border-white/30 glass hidden md:block"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-500/10"
      />

      {/* 3D Cube */}
      <div className="absolute top-[15%] right-[10%] hidden xl:block perspective-1000">
        <motion.div 
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 preserve-3d relative"
        >
          {[
            "rotateY(0deg) translateZ(50px)",
            "rotateY(90deg) translateZ(50px)",
            "rotateY(180deg) translateZ(50px)",
            "rotateY(-90deg) translateZ(50px)",
            "rotateX(90deg) translateZ(50px)",
            "rotateX(-90deg) translateZ(50px)",
          ].map((transform, i) => (
            <div 
              key={i}
              style={{ transform }}
              className="absolute inset-0 border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingElements;
