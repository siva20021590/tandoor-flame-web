import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    pendingReservations,
    upcomingReservations,
    activeOrders,
    paidOrders,
    newInquiries,
  ] = await Promise.all([
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.reservation.count({ where: { date: { gte: new Date() } } }),
    prisma.order.count({
      where: { status: { in: ["pending", "paid"] } },
    }),
    prisma.order.aggregate({
      _sum: { totalPaise: true },
      where: { paymentStatus: "paid" },
    }),
    prisma.cateringInquiry.count({ where: { status: "new" } }),
  ]);

  const recentReservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Pending reservations", value: pendingReservations, href: "/admin/reservations" },
    { label: "Upcoming reservations", value: upcomingReservations, href: "/admin/reservations" },
    { label: "Active orders", value: activeOrders, href: "/admin/orders" },
    {
      label: "Paid revenue",
      value: formatInr(paidOrders._sum.totalPaise ?? 0),
      href: "/admin/orders",
    },
    { label: "New catering inquiries", value: newInquiries, href: "/admin/catering" },
  ];

  return (
    <div className="container-prose py-10">
      <h1 className="font-display text-3xl text-charcoal-900">Overview</h1>
      <p className="mt-1 text-sm text-charcoal-600">
        A quick pulse on tonight&apos;s service.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card transition hover:border-brand-200 hover:shadow-md"
          >
            <p className="text-xs uppercase tracking-wider text-charcoal-500">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl text-charcoal-900">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-display text-lg text-charcoal-900">
            Latest reservations
          </h2>
          <ul className="mt-4 divide-y divide-charcoal-100 text-sm">
            {recentReservations.length === 0 && (
              <li className="py-3 text-charcoal-500">No reservations yet.</li>
            )}
            {recentReservations.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-charcoal-900">{r.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {r.partySize} guests · {new Date(r.date).toDateString()} · {r.time}
                  </p>
                </div>
                <span className="rounded-full bg-charcoal-100 px-2 py-0.5 text-xs text-charcoal-700">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2 className="font-display text-lg text-charcoal-900">Latest orders</h2>
          <ul className="mt-4 divide-y divide-charcoal-100 text-sm">
            {recentOrders.length === 0 && (
              <li className="py-3 text-charcoal-500">No orders yet.</li>
            )}
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-charcoal-900">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-charcoal-500">
                    {o.orderType} · {formatInr(o.totalPaise)} ·{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    o.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-charcoal-100 text-charcoal-700"
                  }`}
                >
                  {o.paymentStatus}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
