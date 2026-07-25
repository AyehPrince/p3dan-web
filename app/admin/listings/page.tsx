import { fetchListingsByStatus } from "@/lib/admin";
import AdminListingsTable from "@/components/AdminListingsTable";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status || "pending";
  const listings = await fetchListingsByStatus(activeStatus);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl mb-6">Listings</h1>
      <AdminListingsTable listings={listings} activeStatus={activeStatus} />
    </div>
  );
}