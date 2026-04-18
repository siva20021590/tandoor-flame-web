"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface StatusUpdaterProps {
  endpoint: string;
  current: string;
  options: string[];
}

export function StatusUpdater({ endpoint, current, options }: StatusUpdaterProps) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setSaving(true);
    setValue(next);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (!res.ok) {
      setValue(current);
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="rounded-full border border-charcoal-200 bg-white px-3 py-1 text-xs font-semibold text-charcoal-700 capitalize focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
