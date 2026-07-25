"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminListing } from "@/lib/admin";

const statusTabs = ["pending", "active", "rejected", "rented"];

export default function AdminListingsTable({
  listings,
  activeStatus,
}: {
  listings: AdminListing[];
  activeStatus: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [verifiedOverrides, setVerifiedOverrides] = useState<Record<string, boolean>>({});

  const isVerified = (listing: AdminListing) =>
    verifiedOverrides[listing.id] ?? listing.verified;

  const handleApprove = async (id: string) => {
    setBusy(id);
    await supabase.from("listings").update({ status: "active" }).eq("id", id);
    setBusy(null);
    router.refresh();
  };

  const handleReject = async (id: string) => {
    setBusy(id);
    await supabase
      .from("listings")
      .update({ status: "rejected", rejection_reason: reason || null })
      .eq("id", id);
    setBusy(null);
    setRejectingId(null);
    setReason("");
    router.refresh();
  };

  const handleVerifyToggle = async (listing: AdminListing) => {
    const nextVerified = !isVerified(listing);
    setBusy(listing.id);
    const { error } = await supabase
      .from("listings")
      .update({ verified: nextVerified })
      .eq("id", listing.id);
    setBusy(null);

    if (!error) {
      setVerifiedOverrides((prev) => ({ ...prev, [listing.id]: nextVerified }));
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {statusTabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/listings?status=${tab}`}
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

      {listings.length === 0 ? (
        <p className="text-warmgray-600 text-sm">No {activeStatus} listings.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const verified = isVerified(listing);
            return (
              <div
                key={listing.id}
                className="bg-canvas-card border border-warmgray-100 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{listing.title}</p>
                      {verified && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-100 text-teal-900">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-warmgray-600 text-xs mt-0.5">
                      {listing.owner_name} · {listing.area_name}, {listing.city} · GHS{" "}
                      {listing.price.toLocaleString()}/mo
                    </p>
                  </div>
                  <span className="text-warmgray-400 text-xs whitespace-nowrap">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  {activeStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(listing.id)}
                        disabled={busy === listing.id}
                        className="bg-teal-600 text-canvas text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setRejectingId(rejectingId === listing.id ? null : listing.id)
                        }
                        className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {activeStatus === "active" && (
                    <button
                      onClick={() => handleVerifyToggle(listing)}
                      disabled={busy === listing.id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                        verified
                          ? "bg-coral-50 border border-coral-400 text-coral-600 hover:bg-coral-100"
                          : "bg-teal-600 text-canvas hover:bg-teal-800"
                      }`}
                    >
                      {verified ? "Remove verified badge" : "Mark verified"}
                    </button>
                  )}
                  <Link
                    href={`/admin/listings/${listing.id}`}
                    className="text-teal-600 text-xs font-medium px-3 py-1.5 hover:underline"
                  >
                    Preview →
                  </Link>
                </div>

                {rejectingId === listing.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason (optional, shown to the landlord)"
                      className="flex-1 bg-canvas border border-warmgray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-coral-400"
                    />
                    <button
                      onClick={() => handleReject(listing.id)}
                      disabled={busy === listing.id}
                      className="bg-coral-400 text-canvas text-xs font-medium px-3 py-2 rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-60"
                    >
                      Confirm reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}