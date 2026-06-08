"use client";

import { motion } from "motion/react";

export function PressButton() {
  return (
    <motion.button
      type="button"
      className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      Press me
    </motion.button>
  );
}
