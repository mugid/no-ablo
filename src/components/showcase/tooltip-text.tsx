"use client";

import { useReducedMotion } from "motion/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const WORD = "compounds";
const TOOLTIP =
  "When small, unnoticed choices stack together, the whole interface starts to feel inevitable.";
const PARAGRAPH = {
  before:
    "Design engineering is the craft of building interfaces where every unseen detail ",
  after: " into something people love without knowing why.",
};

export function TooltipText() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <TooltipProvider delay={400} timeout={400}>
      <p className="max-w-lg text-base font-medium leading-relaxed tracking-tight">
        {PARAGRAPH.before}
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "inline cursor-default border-0 bg-transparent p-0 font-inherit text-inherit shadow-none outline-none",
              "transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
              "[@media(hover:hover)_and_(pointer:fine)]:hover:text-primary",
              "focus-visible:ring-2 focus-visible:ring-ring/60",
            )}
          >
            {WORD}
            <sup className="ml-px text-[0.65em] leading-none text-muted-foreground">
              1
            </sup>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className={cn(
              "max-w-[220px] text-pretty leading-snug",
              "origin-(--transform-origin)",
              "animate-none data-[state=delayed-open]:animate-none data-open:animate-none data-closed:animate-none",
              "transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
              "data-[starting-style]:opacity-0",
              "data-[ending-style]:opacity-0",
              "data-[instant]:duration-0",
              !shouldReduceMotion && [
                "data-[starting-style]:scale-[0.97]",
                "data-[ending-style]:scale-[0.97]",
              ],
            )}
          >
            {TOOLTIP}
          </TooltipContent>
        </Tooltip>
        {PARAGRAPH.after}
      </p>
    </TooltipProvider>
  );
}
