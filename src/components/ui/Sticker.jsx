import React from "react";
import { motion } from "framer-motion";

const Sticker = ({ icon: Icon, color = "primary", size = 24, className = "" }) => {
  const colorMap = {
    primary: "bg-primary-100 text-primary-600 border-primary-200 shadow-primary-500/20",
    blue: "bg-blue-100 text-blue-600 border-blue-200 shadow-blue-500/20",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200 shadow-indigo-500/20",
    sky: "bg-sky-100 text-sky-600 border-sky-200 shadow-sky-500/20",
    orange: "bg-orange-100 text-orange-600 border-orange-200 shadow-orange-500/20",
    green: "bg-green-100 text-green-600 border-green-200 shadow-green-500/20",
    rose: "bg-rose-100 text-rose-600 border-rose-200 shadow-rose-500/20",
    amber: "bg-amber-100 text-amber-600 border-amber-200 shadow-amber-500/20",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.9 }}
      className={`
        inline-flex items-center justify-center p-3 rounded-2xl border-2 
        shadow-lg transition-colors duration-300
        ${colorMap[color] || colorMap.primary}
        ${className}
      `}
    >
      <Icon size={size} strokeWidth={2.5} />
    </motion.div>
  );
};

export default Sticker;
