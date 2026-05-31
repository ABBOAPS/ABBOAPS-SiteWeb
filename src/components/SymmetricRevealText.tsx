import { motion } from "motion/react";
import React, { CSSProperties } from "react";

interface SymmetricRevealTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export function SymmetricRevealText({
  text,
  className,
  style
}: SymmetricRevealTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative whitespace-pre-wrap ${className}`}
      style={style}
    >
      {text}
    </motion.div>
  );
}
