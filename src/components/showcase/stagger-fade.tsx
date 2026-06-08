"use client";

import { motion } from "motion/react";

const words = ["Design", "is", "in", "the", "details."];

export function StaggerFade() {
  return (
    <p className="flex flex-wrap gap-x-2 text-2xl font-medium tracking-tight">
      {words.map((word, index) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.08,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
