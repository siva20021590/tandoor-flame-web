import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LogOut } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-charcoal-50">
      <header className="border-b border-charcoal-100 bg-white">
        <div className="container-prose flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
                <span className="font-display text-sm">TF</span>
              </span>
              <span className="font-display text-sm text-charcoal-800">
                {brand.name} Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              {[
                { href: "/admin", label: "Overview" },
                { href: "/admin/reservations", label: "Reservations" },
                { href: "/admin/orders", label: "Orders" },
                { href: "/admin/catering", label: "Catering" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3 py-1.5 text-charcoal-700 hover:bg-charcoal-100"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-charcoal-600 sm:inline">
              {session.user.email}
            </span>
            <SignOutButton>
              <LogOut className="h-4 w-4" />
              Sign out
            </SignOutButton>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
