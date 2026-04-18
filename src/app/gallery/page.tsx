import { SiteShell } from "@/components/SiteShell";

export const metadata = { title: "Gallery" };

const tiles = [
  { title: "Live tandoor", hue: "from-brand-700 to-brand-500" },
  { title: "Chef&apos;s table", hue: "from-charcoal-800 to-brand-800" },
  { title: "Kakori kebab", hue: "from-brand-500 to-brand-300" },
  { title: "Dum biryani", hue: "from-brand-900 to-brand-600" },
  { title: "Private dining", hue: "from-charcoal-900 to-charcoal-700" },
  { title: "Sangeet catering", hue: "from-brand-400 to-brand-700" },
];

export default function GalleryPage() {
  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Gallery
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            A glimpse inside the kitchen.
          </h1>
        </div>
      </section>

      <div className="container-prose py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <div
              key={t.title}
              className={`relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl bg-gradient-to-br ${t.hue} p-6 text-white shadow-sm`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_50%)]" />
              <p
                className="relative z-10 font-display text-xl"
                dangerouslySetInnerHTML={{ __html: t.title }}
              />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-charcoal-500">
          Swap these tiles with real photography by dropping images into{" "}
          <code className="rounded bg-charcoal-100 px-1">public/gallery/</code>{" "}
          and editing{" "}
          <code className="rounded bg-charcoal-100 px-1">
            src/app/gallery/page.tsx
          </code>
          .
        </p>
      </div>
    </SiteShell>
  );
}
