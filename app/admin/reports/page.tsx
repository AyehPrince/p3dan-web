import { fetchReportsByStatus } from "@/lib/admin";
import AdminReportsTable from "@/components/AdminReportsTable";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status || "open";
  const reports = await fetchReportsByStatus(activeStatus);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl mb-6">Reports</h1>
      <AdminReportsTable reports={reports} activeStatus={activeStatus} />
    </div>
  );
}