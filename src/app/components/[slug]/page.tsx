import { notFound } from "next/navigation";

import {
  showcaseComponents,
  type ShowcaseSlug,
} from "@/components/showcase/registry";
import { getShowcaseItem } from "@/lib/showcase";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(showcaseComponents).map((slug) => ({ slug }));
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getShowcaseItem(slug);

  if (!item || !(slug in showcaseComponents)) {
    notFound();
  }

  const Component = showcaseComponents[slug as ShowcaseSlug];

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-lg">
        <h1 className="text-base font-medium tracking-tight">{item.title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
      </div>

      <div className="rounded-xl border border-border p-6">
        <div className="relative min-h-64 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex min-h-64 items-center justify-center p-12">
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}
