import { SiteShell } from "@/components/SiteShell";
import { brand } from "@/lib/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Our story
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            An ode to the flame that has fed India for centuries.
          </h1>
        </div>
      </section>

      <div className="container-prose prose prose-charcoal max-w-3xl py-12">
        <p className="text-lg text-charcoal-700">
          {brand.name} was born out of a simple conviction — that non-vegetarian
          Indian cooking deserves the same craft, patience and reverence as any
          great cuisine in the world.
        </p>
        <p className="text-base text-charcoal-700">
          Our kitchen is split across three fires: a live-coal tandoor for
          kebabs and breads, a slow-simmer range for our signature curries, and
          a dedicated dum-pukht section where each biryani is sealed with dough
          and cooked on its own handi. Spices are roasted and ground every
          morning; meats are sourced from trusted farm partners across India.
        </p>
        <p className="text-base text-charcoal-700">
          From a 20-seat supper club to a 120-cover restaurant on{" "}
          {brand.address.split(",")[0]}, {brand.name} has grown on the strength
          of guests who&apos;ve become family. We&apos;re glad you&apos;re here.
        </p>
      </div>
    </SiteShell>
  );
}
