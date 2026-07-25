"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MyListing } from "@/lib/myListings";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-warmgray-100", text: "text-warmgray-700", label: "Pending review" },
  active: { bg: "bg-teal-100", text: "text-teal-900", label: "Active" },
  rented: { bg: "bg-coral-100", text: "text-coral-800", label: "Rented" },
  rejected: { bg: "bg-coral-100", text: "text-coral-800", label: "Not approved" },
};

export default function MyListingsTable({ listings }: { listings: MyListing[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRented = async (listing: MyListing) => {
    const nextStatus = listing.status === "active" ? "rented" : "active";
    setBusy(listing.id);
    setError(null);
    const { error: updateError } = await supabase
      .from("listings")
      .update({ status: nextStatus })
      .eq("id", listing.id);
    setBusy(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(deleteTarget);
    await supabase.from("listings").delete().eq("id", deleteTarget);
    setBusy(null);
    setDeleteTarget(null);
    router.refresh();
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-warmgray-600 mb-4">You haven&apos;t listed any properties yet.</p>
        <Link
          href="/list-property"
          className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors inline-block"
        >
          List a property
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="text-coral-600 text-sm mb-4 bg-coral-50 border border-coral-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div className="space-y-3">
        {listings.map((listing) => {
          const style = statusStyles[listing.status] || statusStyles.pending;
          const canToggleRented = listing.status === "active" || listing.status === "rented";
          return (
            <div key={listing.id} className="bg-canvas-card border border-warmgray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-sm">{listing.title}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-coral-600 text-sm font-medium mb-1">
                GHS {listing.price.toLocaleString()}/mo
              </p>
              {listing.status === "rejected" && listing.rejection_reason && (
                <p className="text-warmgray-600 text-xs mb-2">{listing.rejection_reason}</p>
              )}
              <div className="flex gap-2 flex-wrap mt-2">
                <Link
                  href={`/my-listings/${listing.id}/edit`}
                  className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/list-property/photos/${listing.id}`}
                  className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors"
                >
                  Photos
                </Link>
                {canToggleRented && (
                  <button
                    onClick={() => handleToggleRented(listing)}
                    disabled={busy === listing.id}
                    className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors disabled:opacity-60"
                  >
                    {listing.status === "active" ? "Mark as rented" : "Relist as active"}
                  </button>
                )}
                {listing.status === "active" && (
                  <Link
                    href={`/listings/${listing.id}`}
                    target="_blank"
                    className="text-teal-600 text-xs font-medium px-3 py-1.5 hover:underline"
                  >
                    View public page →
                  </Link>
                )}
                <button
                  onClick={() => setDeleteTarget(listing.id)}
                  className="text-coral-600 text-xs font-medium px-3 py-1.5 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
          <div className="bg-canvas rounded-2xl p-5 w-full max-w-sm">
            <h3 className="font-heading font-bold text-lg mb-2">Delete this listing?</h3>
            <p className="text-warmgray-600 text-sm mb-5">This can&apos;t be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-warmgray-200 text-warmgray-700 rounded-xl py-2.5 font-medium hover:bg-canvas-card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy === deleteTarget}
                className="flex-1 bg-coral-400 text-canvas rounded-xl py-2.5 font-medium hover:bg-coral-600 transition-colors disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}