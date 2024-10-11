"use client";

import { motion } from "framer-motion";

const Bounce = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, 0], // Adding slight rotation for a waving effect
      }}
      transition={{
        duration: 3,
        ease: "easeInOut", // Smoother transition
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {children}
    </motion.div>
  );
};

export default Bounce;
