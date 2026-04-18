import { prisma } from "@/lib/prisma";
import { StatusUpdater } from "@/components/StatusUpdater";
import { formatInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { items: true },
  });

  return (
    <div className="container-prose py-10">
      <h1 className="font-display text-3xl text-charcoal-900">Orders</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-charcoal-100 bg-white">
        <table className="min-w-full divide-y divide-charcoal-100 text-sm">
          <thead className="bg-charcoal-50 text-left text-xs uppercase tracking-wider text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal-500">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-charcoal-900">{o.customerName}</p>
                  <p className="text-xs text-charcoal-500">{o.customerEmail}</p>
                  <p className="text-xs text-charcoal-500">{o.customerPhone}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-brand-700">
                    {o.orderType}
                  </p>
                  {o.deliveryAddress && (
                    <p className="mt-1 max-w-xs text-xs text-charcoal-500">
                      {o.deliveryAddress}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-charcoal-700">
                  <ul className="space-y-0.5">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.quantity} × {it.menuItemName}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal-900">
                  {formatInr(o.totalPaise)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      o.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : o.paymentStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-charcoal-100 text-charcoal-700"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusUpdater
                    endpoint={`/api/admin/orders/${o.id}`}
                    current={o.status}
                    options={["pending", "paid", "fulfilled", "cancelled"]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
