import { fetchAllUsers, getCurrentAdminProfile } from "@/lib/admin";
import AdminUsersTable from "@/components/AdminUsersTable";

export default async function AdminUsersPage() {
  const [users, admin] = await Promise.all([
    fetchAllUsers(),
    getCurrentAdminProfile(),
  ]);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl mb-6">Users</h1>
      <AdminUsersTable users={users} currentAdminId={admin?.id ?? ""} />
    </div>
  );
}