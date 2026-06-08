import { PressButton } from "@/components/showcase/press-button";
import { StaggerFade } from "@/components/showcase/stagger-fade";

export const showcaseComponents = {
  "press-button": PressButton,
  "stagger-fade": StaggerFade,
} as const;

export type ShowcaseSlug = keyof typeof showcaseComponents;
