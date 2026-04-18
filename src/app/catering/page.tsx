import { Users, Utensils, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { CateringForm } from "@/components/CateringForm";

export const metadata = { title: "Catering & Events" };

export default function CateringPage() {
  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Catering & events
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            From sangeets to board dinners — we cook for the moments.
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-200">
            Live kebab counters, bespoke tasting menus, full-service buffets —
            share a few details and our events team will respond within one
            working day.
          </p>
        </div>
      </section>

      <section className="container-prose py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Intimate to grand",
              body: "10 to 2000 guests, indoor or outdoor, our team scales the experience with you.",
            },
            {
              icon: Utensils,
              title: "Live counters",
              body: "Portable tandoors, chaat stations and dessert carts plated by our chefs in front of guests.",
            },
            {
              icon: Sparkles,
              title: "Bespoke menus",
              body: "From Nizami tasting menus to kid-friendly counters, every menu is tailored to your event.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <f.icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-3 font-display text-lg text-charcoal-900">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-charcoal-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-prose pb-16">
        <CateringForm />
      </div>
    </SiteShell>
  );
}
