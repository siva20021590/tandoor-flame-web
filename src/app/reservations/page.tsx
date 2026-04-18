import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ReservationForm } from "@/components/ReservationForm";
import { brand } from "@/lib/brand";

export const metadata = { title: "Reservations" };

export default function ReservationsPage() {
  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Reserve a table
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            A table, set and waiting.
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-200">
            Reservations are confirmed within 10 minutes during service hours.
            For parties larger than 10, please call us directly so we can plan
            the kitchen.
          </p>
        </div>
      </section>

      <div className="container-prose grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <ReservationForm />
        <aside className="space-y-6">
          <div className="card">
            <h3 className="font-display text-lg text-charcoal-900">
              Planning your visit
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-charcoal-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-600" />
                <span>{brand.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brand-600" />
                <a
                  href={`tel:${brand.phone.replace(/\s+/g, "")}`}
                  className="hover:text-brand-700"
                >
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand-600" />
                <a
                  href={`mailto:${brand.email}`}
                  className="hover:text-brand-700"
                >
                  {brand.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-brand-600" />
                <div>
                  {brand.hours.map((h) => (
                    <div key={h.days}>
                      <span className="font-medium text-charcoal-800">
                        {h.days}
                      </span>{" "}
                      · {h.time}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
          <div className="card bg-brand-50">
            <h3 className="font-display text-lg text-charcoal-900">
              House policies
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-charcoal-700">
              <li>Tables are held for 15 minutes past the booked time.</li>
              <li>Smart casual. We love an excuse to dress up.</li>
              <li>
                Kindly let us know of any allergies or dietary preferences in
                the notes — we&apos;ll adapt the kitchen for you.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
