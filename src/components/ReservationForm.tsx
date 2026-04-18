"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { reservationSchema, type ReservationInput } from "@/lib/validators";

export function ReservationForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      partySize: 2,
      time: "19:30",
    },
  });

  const onSubmit = async (data: ReservationInput) => {
    setServerError(null);
    setSuccess(null);
    const res = await fetch("/api/reservations", {
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
      `Thank you, ${data.name}! Your table for ${data.partySize} on ${new Date(
        data.date,
      ).toDateString()} at ${data.time} is being confirmed. Booking ID: ${body.id}`,
    );
    reset();
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <h2 className="font-display text-2xl text-charcoal-900">
        Book your table
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
          <label className="field-label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            className="field-input"
            placeholder="Priya Sharma"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="field-input"
            placeholder="priya@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="field-input"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="partySize">
            Party size
          </label>
          <input
            id="partySize"
            type="number"
            min={1}
            max={30}
            className="field-input"
            {...register("partySize", { valueAsNumber: true })}
          />
          {errors.partySize && (
            <p className="mt-1 text-xs text-red-600">
              {errors.partySize.message}
            </p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            min={minDate}
            className="field-input"
            {...register("date")}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="time">
            Time
          </label>
          <input
            id="time"
            type="time"
            className="field-input"
            {...register("time")}
          />
          {errors.time && (
            <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="occasion">
          Occasion <span className="text-charcoal-400">(optional)</span>
        </label>
        <select id="occasion" className="field-input" {...register("occasion")}>
          <option value="">No special occasion</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="business">Business dinner</option>
          <option value="date">Date night</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="notes">
          Notes <span className="text-charcoal-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          className="field-input"
          placeholder="Allergies, seating preferences, surprises…"
          {...register("notes")}
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Confirm reservation"
        )}
      </button>
    </form>
  );
}
