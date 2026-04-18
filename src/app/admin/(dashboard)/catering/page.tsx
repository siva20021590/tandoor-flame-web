import { prisma } from "@/lib/prisma";
import { StatusUpdater } from "@/components/StatusUpdater";

export const dynamic = "force-dynamic";

export default async function AdminCateringPage() {
  const inquiries = await prisma.cateringInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div className="container-prose py-10">
      <h1 className="font-display text-3xl text-charcoal-900">
        Catering inquiries
      </h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-charcoal-100 bg-white">
        <table className="min-w-full divide-y divide-charcoal-100 text-sm">
          <thead className="bg-charcoal-50 text-left text-xs uppercase tracking-wider text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal-500">
                  No inquiries yet.
                </td>
              </tr>
            )}
            {inquiries.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-charcoal-900">{i.name}</p>
                  <p className="text-xs text-charcoal-500">{i.email}</p>
                  <p className="text-xs text-charcoal-500">{i.phone}</p>
                </td>
                <td className="px-4 py-3 text-charcoal-700">
                  <p className="font-medium">{i.eventType}</p>
                  <p className="text-xs text-charcoal-500">
                    {new Date(i.eventDate).toDateString()}
                    {i.venue ? ` · ${i.venue}` : ""}
                  </p>
                  {i.message && (
                    <p className="mt-1 max-w-sm text-xs text-charcoal-500">
                      {i.message}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-charcoal-700">{i.guestCount}</td>
                <td className="px-4 py-3 text-charcoal-700">{i.budget ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusUpdater
                    endpoint={`/api/admin/catering/${i.id}`}
                    current={i.status}
                    options={["new", "contacted", "booked", "closed"]}
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
