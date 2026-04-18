"use client";

import Script from "next/script";
import { useMemo, useState } from "react";
import { Flame, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { brand } from "@/lib/brand";

interface OrderMenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  priceInPaise: number;
  isSignature: boolean;
}

interface OrderClientProps {
  items: OrderMenuItem[];
  razorpayKeyId: string;
  razorpayConfigured: boolean;
  taxRate: number;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

type RazorpayCtor = new (options: RazorpayOptions) => { open: () => void };

declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

export function OrderClient({
  items,
  razorpayKeyId,
  razorpayConfigured,
  taxRate,
}: OrderClientProps) {
  const { items: cart, add, setQuantity, remove, clear, subtotalPaise } =
    useCart();

  const [customer, setCustomer] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    orderType: "delivery" as "delivery" | "pickup",
    deliveryAddress: "",
    notes: "",
  });
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting"; message: string }
    | { kind: "success"; message: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const grouped = useMemo(() => {
    return items.reduce<Record<string, OrderMenuItem[]>>((acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    }, {});
  }, [items]);

  const taxPaise = Math.round(subtotalPaise * taxRate);
  const totalPaise = subtotalPaise + taxPaise;

  async function handleCheckout() {
    if (cart.length === 0) return;
    if (!customer.customerName || !customer.customerEmail || !customer.customerPhone) {
      setStatus({
        kind: "error",
        message: "Please fill in your name, email and phone.",
      });
      return;
    }
    if (customer.orderType === "delivery" && !customer.deliveryAddress) {
      setStatus({
        kind: "error",
        message: "Please provide a delivery address.",
      });
      return;
    }

    setStatus({ kind: "submitting", message: "Creating your order…" });

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...customer,
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setStatus({
        kind: "error",
        message: body.error ?? "Could not create the order. Please try again.",
      });
      return;
    }

    const body = (await res.json()) as {
      orderId: string;
      razorpay?: { orderId: string; amount: number; currency: string };
      totalPaise: number;
      paymentRequired: boolean;
    };

    if (!body.paymentRequired || !body.razorpay) {
      setStatus({
        kind: "success",
        message: `Order placed! Reference: ${body.orderId}. Our team will call you to confirm — payment can be completed on delivery/pickup because online payments are not configured yet.`,
      });
      clear();
      return;
    }

    if (!razorpayKeyId || !window.Razorpay) {
      setStatus({
        kind: "error",
        message: "Razorpay SDK did not load. Please refresh and try again.",
      });
      return;
    }

    const razorpay = new window.Razorpay({
      key: razorpayKeyId,
      amount: body.razorpay.amount,
      currency: body.razorpay.currency,
      name: brand.name,
      description: `Order ${body.orderId}`,
      order_id: body.razorpay.orderId,
      prefill: {
        name: customer.customerName,
        email: customer.customerEmail,
        contact: customer.customerPhone,
      },
      theme: { color: "#d0510f" },
      handler: async (response) => {
        setStatus({ kind: "submitting", message: "Verifying payment…" });
        const verify = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: body.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        if (!verify.ok) {
          setStatus({
            kind: "error",
            message: "Payment verification failed. Please contact us.",
          });
          return;
        }
        setStatus({
          kind: "success",
          message: `Payment successful! Order ${body.orderId} is confirmed. We&apos;ll send updates to ${customer.customerEmail}.`,
        });
        clear();
      },
      modal: {
        ondismiss: () => setStatus({ kind: "idle" }),
      },
    });
    razorpay.open();
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {Object.entries(grouped).map(([category, rows]) => (
            <section key={category} className="mb-10">
              <h2 className="font-display text-xl text-charcoal-900 sm:text-2xl">
                {category}
              </h2>
              <div className="mt-4 grid gap-3">
                {rows.map((item) => {
                  const existing = cart.find((c) => c.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-charcoal-100 bg-white p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base text-charcoal-900">
                            {item.name}
                          </p>
                          {item.isSignature && (
                            <Flame className="h-4 w-4 text-brand-600" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-charcoal-600">
                          {item.description}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-charcoal-900">
                          {formatInr(item.priceInPaise)}
                        </p>
                      </div>
                      <div>
                        {existing ? (
                          <div className="flex items-center gap-2 rounded-full border border-charcoal-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, existing.quantity - 1)
                              }
                              className="rounded-full p-1.5 text-charcoal-700 hover:bg-charcoal-50"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                              {existing.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, existing.quantity + 1)
                              }
                              className="rounded-full p-1.5 text-charcoal-700 hover:bg-charcoal-50"
                              aria-label="Increase"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              add({
                                id: item.id,
                                name: item.name,
                                priceInPaise: item.priceInPaise,
                              })
                            }
                            className="btn-ghost !px-4 !py-2"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="card space-y-4">
            <h2 className="font-display text-xl text-charcoal-900">
              Your cart
            </h2>
            {cart.length === 0 && (
              <p className="text-sm text-charcoal-600">
                Nothing in the cart yet. Pick a dish to get started.
              </p>
            )}
            {cart.length > 0 && (
              <ul className="space-y-3">
                {cart.map((ci) => (
                  <li
                    key={ci.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {ci.name}{" "}
                        <span className="text-charcoal-500">× {ci.quantity}</span>
                      </p>
                      <p className="text-xs text-charcoal-500">
                        {formatInr(ci.priceInPaise)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal-900">
                        {formatInr(ci.priceInPaise * ci.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(ci.id)}
                        className="rounded-full p-1 text-charcoal-400 hover:bg-charcoal-50 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {cart.length > 0 && (
              <dl className="space-y-1 border-t border-charcoal-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-charcoal-600">Subtotal</dt>
                  <dd className="font-medium">{formatInr(subtotalPaise)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-600">Tax ({Math.round(taxRate * 100)}%)</dt>
                  <dd className="font-medium">{formatInr(taxPaise)}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-charcoal-100 pt-2 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold">{formatInr(totalPaise)}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="card mt-4 space-y-3">
            <h3 className="font-display text-lg text-charcoal-900">Checkout</h3>
            <div className="grid gap-3">
              <div className="flex gap-2">
                {(["delivery", "pickup"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setCustomer((c) => ({ ...c, orderType: t }))
                    }
                    className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                      customer.orderType === t
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-charcoal-200 bg-white text-charcoal-700 hover:border-brand-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                className="field-input"
                placeholder="Full name"
                value={customer.customerName}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, customerName: e.target.value }))
                }
              />
              <input
                className="field-input"
                placeholder="Email"
                type="email"
                value={customer.customerEmail}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, customerEmail: e.target.value }))
                }
              />
              <input
                className="field-input"
                placeholder="Phone"
                value={customer.customerPhone}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, customerPhone: e.target.value }))
                }
              />
              {customer.orderType === "delivery" && (
                <textarea
                  className="field-input"
                  rows={2}
                  placeholder="Delivery address"
                  value={customer.deliveryAddress}
                  onChange={(e) =>
                    setCustomer((c) => ({
                      ...c,
                      deliveryAddress: e.target.value,
                    }))
                  }
                />
              )}
              <textarea
                className="field-input"
                rows={2}
                placeholder="Notes (spice preferences, allergies)"
                value={customer.notes}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, notes: e.target.value }))
                }
              />
            </div>

            {status.kind === "error" && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {status.message}
              </p>
            )}
            {status.kind === "success" && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {status.message}
              </p>
            )}
            {!razorpayConfigured && (
              <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                Razorpay keys are not configured yet — orders will be saved and
                the team will call to confirm. Add{" "}
                <code className="rounded bg-amber-100 px-1">RAZORPAY_KEY_ID</code>,{" "}
                <code className="rounded bg-amber-100 px-1">RAZORPAY_KEY_SECRET</code>{" "}
                and{" "}
                <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_RAZORPAY_KEY_ID</code>{" "}
                to enable checkout.
              </p>
            )}

            <button
              type="button"
              className="btn-primary w-full"
              disabled={cart.length === 0 || status.kind === "submitting"}
              onClick={handleCheckout}
            >
              {status.kind === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {status.message}
                </>
              ) : razorpayConfigured ? (
                <>Pay {formatInr(totalPaise)}</>
              ) : (
                <>Place order · {formatInr(totalPaise)}</>
              )}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
