import Link from "next/link";
import { Flame } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";
import { brand } from "@/lib/brand";

export const metadata = { title: "Menu" };
export const revalidate = 60;

export default async function MenuPage() {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
  });
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            The menu
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            From the kitchens of {brand.cuisineFocus.split("•")[0].trim()} and beyond.
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-200">
            Every plate is made from scratch. Spice levels are marked from 1
            (gentle) to 4 (incendiary). Ask your server for the day&apos;s off-menu
            additions.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.keys(grouped).map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase()}`}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container-prose py-12">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <section
            key={category}
            id={category.toLowerCase()}
            className="scroll-mt-24 border-b border-charcoal-100 py-10 last:border-b-0"
          >
            <h2 className="font-display text-2xl text-charcoal-900 sm:text-3xl">
              {category}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-charcoal-100 bg-white p-5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-charcoal-900">
                        {item.name}
                      </h3>
                      {item.isSignature && (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                          Signature
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-charcoal-600">
                      {item.description}
                    </p>
                    {item.spiceLevel > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600">
                        {Array.from({ length: item.spiceLevel }).map((_, i) => (
                          <Flame key={i} className="h-3 w-3" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-charcoal-900">
                      {formatInr(item.priceInPaise)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl text-charcoal-900">
              Prefer to order in?
            </h3>
            <p className="mt-1 text-sm text-charcoal-700">
              Our signature dishes travel beautifully — delivery and pickup
              available across {brand.city.split(",")[0]}.
            </p>
          </div>
          <Link href="/order" className="btn-primary">
            Start an order
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
