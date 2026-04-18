import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
  center?: boolean;
}

export function Section({
  eyebrow,
  title,
  description,
  className,
  children,
  center,
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="container-prose">
        {(eyebrow || title || description) && (
          <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-charcoal-600">
                {description}
              </p>
            )}
          </div>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
