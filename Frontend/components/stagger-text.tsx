"use client";

import { motion } from "framer-motion";

export default function StaggeredText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const characters = Array.from(text);
  return (
    <div className="flex space-x-1">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
          className={className}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
