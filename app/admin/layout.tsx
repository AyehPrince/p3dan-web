import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdminProfile } from "@/lib/admin";
import PinIcon from "@/components/PinIcon";
import AdminSignOutButton from "@/components/AdminSignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdminProfile();

  if (!admin) {
    redirect("/sign-in?redirect=/admin");
  }

  return (
    <div className="min-h-screen">
      <header className="bg-teal-900 text-canvas">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PinIcon size={18} color="#D85A30" />
              <span className="font-heading font-bold">p3dan admin</span>
            </div>
            <nav className="flex items-center gap-4 text-sm text-teal-100">
              <Link href="/admin" className="hover:text-canvas">
                Dashboard
              </Link>
              <Link href="/admin/listings" className="hover:text-canvas">
                Listings
              </Link>
              <Link href="/admin/reports" className="hover:text-canvas">
                Reports
              </Link>
              <Link href="/admin/users" className="hover:text-canvas">
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-teal-100">
            <span>{admin.full_name}</span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}