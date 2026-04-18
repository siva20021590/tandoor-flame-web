import { prisma } from "@/lib/prisma";
import { StatusUpdater } from "@/components/StatusUpdater";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 500,
  });

  return (
    <div className="container-prose py-10">
      <h1 className="font-display text-3xl text-charcoal-900">Reservations</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-charcoal-100 bg-white">
        <table className="min-w-full divide-y divide-charcoal-100 text-sm">
          <thead className="bg-charcoal-50 text-left text-xs uppercase tracking-wider text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Date · Time</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal-500">
                  No reservations yet.
                </td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-charcoal-900">{r.name}</p>
                  {r.occasion && (
                    <p className="text-xs text-charcoal-500">{r.occasion}</p>
                  )}
                  {r.notes && (
                    <p className="mt-1 max-w-xs text-xs text-charcoal-500">
                      {r.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-charcoal-700">
                  {new Date(r.date).toDateString()}
                  <br />
                  <span className="text-xs text-charcoal-500">{r.time}</span>
                </td>
                <td className="px-4 py-3 text-charcoal-700">{r.partySize}</td>
                <td className="px-4 py-3 text-xs text-charcoal-700">
                  <p>{r.email}</p>
                  <p>{r.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusUpdater
                    endpoint={`/api/admin/reservations/${r.id}`}
                    current={r.status}
                    options={["pending", "confirmed", "cancelled"]}
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
