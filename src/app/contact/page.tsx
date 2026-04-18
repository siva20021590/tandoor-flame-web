import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { brand } from "@/lib/brand";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Say hello
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            We&apos;d love to hear from you.
          </h1>
        </div>
      </section>

      <div className="container-prose grid gap-8 py-12 md:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="font-display text-xl text-charcoal-900">Visit</h2>
          <ul className="space-y-4 text-sm text-charcoal-700">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-brand-600" />
              <span>{brand.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-brand-600" />
              <a href={`tel:${brand.phone.replace(/\s+/g, "")}`}>
                {brand.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-brand-600" />
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-brand-600" />
              <div>
                {brand.hours.map((h) => (
                  <div key={h.days}>
                    <span className="font-medium text-charcoal-900">
                      {h.days}
                    </span>{" "}
                    · {h.time}
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display text-xl text-charcoal-900">Reservations</h2>
          <p className="text-sm text-charcoal-700">
            For tables of up to 10, please use our{" "}
            <a
              href="/reservations"
              className="font-medium text-brand-700 underline"
            >
              online reservation form
            </a>
            . For larger parties, private dining or media enquiries call us
            directly.
          </p>
          <h2 className="font-display text-xl text-charcoal-900">Catering</h2>
          <p className="text-sm text-charcoal-700">
            Weddings, corporate dinners, family celebrations — send us the
            details via our{" "}
            <a
              href="/catering"
              className="font-medium text-brand-700 underline"
            >
              catering enquiry form
            </a>{" "}
            and our events team will respond within a working day.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
