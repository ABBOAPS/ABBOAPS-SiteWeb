import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useRef } from "react";
import { cn } from "../utils";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function LiquidGlass({
  children,
  className,
  intensity = 0.5,
}: LiquidGlassProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const background = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,${intensity}), transparent 80%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden bg-white/5 backdrop-blur-[12px] saturate-[180%] border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-70 transition-opacity duration-300 z-0 mix-blend-overlay"
        style={{ background }}
      />
      {/* Light border reflection layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0 glass-reflection"
        style={{ background }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
