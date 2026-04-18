"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cateringSchema, type CateringInput } from "@/lib/validators";

export function CateringForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CateringInput>({
    resolver: zodResolver(cateringSchema),
    defaultValues: { guestCount: 50 },
  });

  const onSubmit = async (data: CateringInput) => {
    setServerError(null);
    setSuccess(null);
    const res = await fetch("/api/catering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong. Please try again.");
      return;
    }
    const body = await res.json();
    setSuccess(
      `Thank you, ${data.name}! We'll be in touch within one working day. Reference: ${body.id}`,
    );
    reset();
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <h2 className="font-display text-2xl text-charcoal-900">
        Enquire about an event
      </h2>

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <p>{success}</p>
        </div>
      )}
      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="c-name">
            Full name
          </label>
          <input id="c-name" className="field-input" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            className="field-input"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-phone">
            Phone
          </label>
          <input
            id="c-phone"
            className="field-input"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-type">
            Event type
          </label>
          <select
            id="c-type"
            className="field-input"
            {...register("eventType")}
          >
            <option value="">Select one</option>
            <option>Wedding / Sangeet</option>
            <option>Corporate</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>House party</option>
            <option>Other</option>
          </select>
          {errors.eventType && (
            <p className="mt-1 text-xs text-red-600">
              {errors.eventType.message}
            </p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-date">
            Event date
          </label>
          <input
            id="c-date"
            type="date"
            min={minDate}
            className="field-input"
            {...register("eventDate")}
          />
          {errors.eventDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.eventDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-count">
            Estimated guests
          </label>
          <input
            id="c-count"
            type="number"
            min={10}
            className="field-input"
            {...register("guestCount", { valueAsNumber: true })}
          />
          {errors.guestCount && (
            <p className="mt-1 text-xs text-red-600">
              {errors.guestCount.message}
            </p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="c-venue">
            Venue <span className="text-charcoal-400">(optional)</span>
          </label>
          <input
            id="c-venue"
            className="field-input"
            placeholder="Hotel, home, farmhouse…"
            {...register("venue")}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="c-budget">
            Budget range <span className="text-charcoal-400">(optional)</span>
          </label>
          <select id="c-budget" className="field-input" {...register("budget")}>
            <option value="">No preference</option>
            <option>Under ₹50,000</option>
            <option>₹50,000 – ₹1,50,000</option>
            <option>₹1,50,000 – ₹5,00,000</option>
            <option>₹5,00,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="c-message">
          Tell us about the event
        </label>
        <textarea
          id="c-message"
          rows={4}
          className="field-input"
          placeholder="Menu preferences, dietary needs, live counter ideas…"
          {...register("message")}
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </button>
    </form>
  );
}
