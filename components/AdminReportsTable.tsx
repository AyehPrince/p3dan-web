"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminReport } from "@/lib/admin";

const statusStyles: Record<string, string> = {
  open: "bg-warmgray-100 text-warmgray-700",
  resolved: "bg-teal-100 text-teal-900",
  dismissed: "bg-coral-100 text-coral-800",
};

export default function AdminReportsTable({
  reports,
  activeStatus,
}: {
  reports: AdminReport[];
  activeStatus: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  const handleResolve = async (id: string, status: "resolved" | "dismissed") => {
    setBusy(id);
    await supabase.from("reports").update({ status }).eq("id", id);
    setBusy(null);
    router.refresh();
  };

  const handleReopen = async (id: string) => {
    setBusy(id);
    await supabase.from("reports").update({ status: "open" }).eq("id", id);
    setBusy(null);
    router.refresh();
  };

  const statusTabs = ["open", "resolved", "dismissed"];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {statusTabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/reports?status=${tab}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              activeStatus === tab
                ? "bg-teal-600 text-canvas"
                : "bg-canvas-card border border-warmgray-100 text-warmgray-700"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="text-warmgray-600 text-sm">No {activeStatus} reports.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-canvas-card border border-warmgray-100 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="inline-block bg-warmgray-100 text-warmgray-700 text-[11px] font-medium px-2 py-0.5 rounded-md capitalize">
                      {report.target_type} report
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md capitalize ${statusStyles[report.status]}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{report.reason}</p>
                  {report.description && (
                    <p className="text-warmgray-600 text-xs mt-1">
                      {report.description}
                    </p>
                  )}
                  <p className="text-warmgray-400 text-xs mt-1.5">
                    Reported by {report.reporter_name || "a user"}
                    {report.listing_title && ` · re: "${report.listing_title}"`}
                  </p>
                </div>
                <span className="text-warmgray-400 text-xs whitespace-nowrap">
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                {report.target_listing_id && (
                  <Link
                    href={`/admin/listings/${report.target_listing_id}`}
                    className="text-teal-600 text-xs font-medium px-3 py-1.5 hover:underline"
                  >
                    Preview →
                  </Link>
                )}
                {report.status === "open" ? (
                  <>
                    <button
                      onClick={() => handleResolve(report.id, "resolved")}
                      disabled={busy === report.id}
                      className="bg-teal-600 text-canvas text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
                    >
                      Mark resolved
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, "dismissed")}
                      disabled={busy === report.id}
                      className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors disabled:opacity-60"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReopen(report.id)}
                    disabled={busy === report.id}
                    className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors disabled:opacity-60"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}