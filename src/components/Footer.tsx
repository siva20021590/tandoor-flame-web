import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-charcoal-100 bg-charcoal-900 text-charcoal-100">
      <div className="container-prose grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <span className="font-display text-lg">TF</span>
            </span>
            <span className="font-display text-xl text-white">{brand.name}</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-charcoal-300">
            {brand.description}
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-brand-300">
            Visit us
          </h4>
          <p className="mt-3 text-sm text-charcoal-200">{brand.address}</p>
          <p className="mt-1 text-sm text-charcoal-200">{brand.phone}</p>
          <p className="mt-1 text-sm text-charcoal-200">{brand.email}</p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-brand-300">
            Hours
          </h4>
          <ul className="mt-3 space-y-1 text-sm text-charcoal-200">
            {brand.hours.map((h) => (
              <li key={h.days}>
                <span className="font-medium text-white">{h.days}</span>
                <br />
                {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-800">
        <div className="container-prose flex flex-col justify-between gap-2 py-4 text-xs text-charcoal-400 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-white">
              Staff login
            </Link>
            <a href={brand.instagram} className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
