"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { showcaseItems } from "@/lib/showcase";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "block text-sm transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="flex min-h-full w-48 shrink-0 flex-col justify-center px-6">
      <nav className="flex flex-col gap-4">
        {showcaseItems.map((item) => (
          <NavLink key={item.slug} href={`/components/${item.slug}`}>
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
