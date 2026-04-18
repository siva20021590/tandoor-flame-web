import Link from "next/link";
import { ArrowRight, Flame, MapPin, PartyPopper, Phone } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section } from "@/components/Section";
import { brand } from "@/lib/brand";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const signatures = await prisma.menuItem.findMany({
    where: { isSignature: true, isAvailable: true },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-900 text-white">
        <div className="absolute inset-0 bg-hero-pattern opacity-80" />
        <div className="container-prose relative grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
              <Flame className="h-3.5 w-3.5" /> {brand.cuisineFocus}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
              {brand.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-charcoal-200">
              {brand.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reservations" className="btn-primary">
                Reserve a table
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Order online
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wider text-charcoal-300">
                  Address
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {brand.address}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-charcoal-300">
                  Today
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {brand.hours[0].time}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-charcoal-300">
                  Reservations
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {brand.phone}
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="card bg-white/10 text-white backdrop-blur">
              <p className="font-display text-xl">Chef&apos;s table tonight</p>
              <p className="mt-3 text-sm text-charcoal-200">
                A seven-course tasting menu inspired by the kitchens of Awadh,
                Rajasthan and the Chettinad. Booking closes 4pm.
              </p>
              <div className="mt-6 space-y-3">
                {signatures.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-charcoal-200">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-brand-200">
                      {formatInr(item.priceInPaise)}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-200 hover:text-white"
              >
                Explore full menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <Section
        eyebrow="Why Tandoor Flame"
        title="Crafted in the old way. Served in the new."
        description="Every dish starts with whole spices, ground the morning of service, and meats brought in fresh daily from our trusted farm partners."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Flame,
              title: "Live-coal tandoor",
              body: "Our 900°F tandoor gives kebabs and breads their signature smoke — lit fresh every service.",
            },
            {
              icon: PartyPopper,
              title: "Private dining & events",
              body: "Host up to 80 guests in our Nizam-inspired private room with a dedicated tandoor chef.",
            },
            {
              icon: MapPin,
              title: "Delivery & pickup",
              body: "Signature curries, biryanis and breads — packed to travel, ready in 25 minutes.",
            },
          ].map((f) => (
            <div key={f.title} className="card h-full">
              <f.icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-4 font-display text-xl text-charcoal-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-charcoal-600">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA band */}
      <Section className="py-10">
        <div className="card flex flex-col items-center justify-between gap-6 bg-brand-600 text-white sm:flex-row">
          <div>
            <p className="font-display text-2xl">Planning something special?</p>
            <p className="mt-1 text-sm text-brand-100">
              Wedding sangeets, corporate milestones, intimate family feasts — our catering team will take care of it.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/catering"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              Catering enquiry <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${brand.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              <Phone className="h-4 w-4" /> Call us
            </a>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
