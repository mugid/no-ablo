export type ShowcaseItem = {
  slug: string;
  title: string;
  description: string;
};

export const showcaseItems: ShowcaseItem[] = [
  {
    slug: "press-button",
    title: "Press Button",
    description: "A button with tactile press feedback.",
  },
  {
    slug: "stagger-fade",
    title: "Stagger Fade",
    description: "Text that reveals with a staggered fade-in.",
  },
];

export function getShowcaseItem(slug: string) {
  return showcaseItems.find((item) => item.slug === slug);
}
