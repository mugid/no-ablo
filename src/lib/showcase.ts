export type ShowcaseItem = {
  slug: string;
  title: string;
  description: string;
};

export const showcaseItems: ShowcaseItem[] = [
  {
    slug: "detached-letters",
    title: "Detached Letters",
    description:
      "Letters start as a sentence — click and drag to throw them apart inside the showcase box.",
  },
  {
    slug: "glass-reveal",
    title: "Glass Reveal",
    description:
      "Frosted glass obscures text until a radial spotlight follows your cursor.",
  },
  {
    slug: "tooltip-text",
    title: "Tooltip Text",
    description:
      "A paragraph with a highlighted word that reveals its meaning on hover.",
  },
];

export function getShowcaseItem(slug: string) {
  return showcaseItems.find((item) => item.slug === slug);
}
