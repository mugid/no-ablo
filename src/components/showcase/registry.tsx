import { DetachedLetters } from "@/components/showcase/detached-letters";
import { GlassReveal } from "@/components/showcase/glass-reveal";
import { TooltipText } from "@/components/showcase/tooltip-text";

export const showcaseComponents = {
  "detached-letters": DetachedLetters,
  "glass-reveal": GlassReveal,
  "tooltip-text": TooltipText,
} as const;

export type ShowcaseSlug = keyof typeof showcaseComponents;
