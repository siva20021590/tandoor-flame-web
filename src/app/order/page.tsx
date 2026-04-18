import { SiteShell } from "@/components/SiteShell";
import { OrderClient } from "@/components/OrderClient";
import { prisma } from "@/lib/prisma";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { brand } from "@/lib/brand";

export const metadata = { title: "Order online" };
export const revalidate = 60;

export default async function OrderPage() {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
  });

  return (
    <SiteShell>
      <section className="bg-charcoal-900 text-white">
        <div className="container-prose py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Order online
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Our kitchen, at your door.
          </h1>
          <p className="mt-3 max-w-2xl text-charcoal-200">
            Delivery across {brand.city.split(",")[0]}. Pickup typically ready
            in 25 minutes.
          </p>
        </div>
      </section>

      <div className="container-prose py-10">
        <OrderClient
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            category: i.category,
            priceInPaise: i.priceInPaise,
            isSignature: i.isSignature,
          }))}
          razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""}
          razorpayConfigured={isRazorpayConfigured()}
          taxRate={brand.taxRate}
        />
      </div>
    </SiteShell>
  );
}
