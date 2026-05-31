import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ScrollRevealText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"], // Starts revealing when 90% from top, finishes at 40%
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

        return (
          <motion.span key={i} style={{ opacity }} className="mr-[0.25em] mb-1">
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
