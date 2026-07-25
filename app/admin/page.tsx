import Link from "next/link";
import { fetchDashboardCounts, fetchDashboardCharts } from "@/lib/admin";
import DashboardCharts from "@/components/DashboardCharts";

export default async function AdminDashboard() {
  const [counts, charts] = await Promise.all([
    fetchDashboardCounts(),
    fetchDashboardCharts(),
  ]);

  const cards = [
    { label: "Pending listings", value: counts.pendingListings, href: "/admin/listings", accent: "coral" },
    { label: "Active listings", value: counts.activeListings, href: "/admin/listings", accent: "teal" },
    { label: "Open reports", value: counts.openReports, href: "/admin/reports", accent: "coral" },
    { label: "Total users", value: counts.totalUsers, href: "/admin/users", accent: "teal" },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const content = (
            <div
              key={card.label}
              className="bg-canvas-card border border-warmgray-100 rounded-2xl p-5"
            >
              <p className="text-warmgray-600 text-xs font-medium mb-1">
                {card.label}
              </p>
              <p
                className={`font-heading font-bold text-3xl ${
                  card.accent === "coral" ? "text-coral-600" : "text-teal-600"
                }`}
              >
                {card.value}
              </p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      <DashboardCharts data={charts} />
    </div>
  );
}