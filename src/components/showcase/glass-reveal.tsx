"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

const TEXT =
  "yo, you can see this, because i'm fascinated by design engineering";

const REVEAL_RADIUS = 40;

export function GlassReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const springX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.35 });
  const springY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.35 });
  const springRadius = useSpring(0, { stiffness: 280, damping: 30, mass: 0.2 });

  const clipPath = useMotionTemplate`circle(${springRadius}px at ${springX}px ${springY}px)`;

  function updatePosition(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    springX.set(event.clientX - rect.left);
    springY.set(event.clientY - rect.top);
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    updatePosition(event);
    springRadius.set(REVEAL_RADIUS);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    updatePosition(event);
  }

  function handlePointerLeave() {
    springRadius.set(0);
  }

  if (shouldReduceMotion) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-card p-10">
        <p className="text-base font-medium leading-relaxed tracking-tight">
          {TEXT}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative max-w-xl overflow-hidden rounded-2xl p-10 select-none",
        "shadow-[0_1px_1px_0_oklch(0_0_0/3%),0_2px_6px_-1px_oklch(0_0_0/5%),0_8px_24px_-4px_oklch(0_0_0/7%),0_20px_48px_-12px_oklch(0_0_0/6%)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-12 -left-10 size-44 rounded-full bg-foreground/15 blur-2xl" />
        <div className="absolute -right-8 -bottom-10 size-52 rounded-full bg-muted-foreground/20 blur-2xl" />
        <div className="absolute top-1/3 left-1/2 size-32 -translate-x-1/2 rounded-full bg-primary/12 blur-2xl" />
      </div>

      <p className="relative text-base font-medium leading-relaxed tracking-tight">
        {TEXT}
      </p>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          "bg-background/40",
          "shadow-[inset_0_1px_1px_0_oklch(1_0_0/40%),inset_0_-1px_1px_0_oklch(0_0_0/5%)]",
          "ring-1 ring-foreground/8 ring-inset",
        )}
        style={{
          backdropFilter: "blur(40px) saturate(1.6) brightness(1.05)",
          WebkitBackdropFilter: "blur(40px) saturate(1.6) brightness(1.05)",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-2xl bg-linear-to-br from-background/25 via-transparent to-foreground/5"
          aria-hidden
        />
      </div>

      <motion.p
        className="pointer-events-none absolute inset-0 p-10 text-base font-medium leading-relaxed tracking-tight"
        style={{ clipPath }}
      >
        {TEXT}
      </motion.p>
    </div>
  );
}
