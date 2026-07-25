"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminListingActions({
  listingId,
  currentStatus,
  verified: initialVerified,
}: {
  listingId: string;
  currentStatus: string;
  verified: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [verified, setVerified] = useState(initialVerified);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const handleApprove = async () => {
    setBusy(true);
    await supabase.from("listings").update({ status: "active" }).eq("id", listingId);
    setBusy(false);
    router.push("/admin/listings?status=active");
    router.refresh();
  };

  const handleReject = async () => {
    setBusy(true);
    await supabase
      .from("listings")
      .update({ status: "rejected", rejection_reason: reason || null })
      .eq("id", listingId);
    setBusy(false);
    router.push("/admin/listings?status=rejected");
    router.refresh();
  };

  const handleReinstate = async () => {
    setBusy(true);
    await supabase
      .from("listings")
      .update({ status: "active", rejection_reason: null })
      .eq("id", listingId);
    setBusy(false);
    router.push("/admin/listings?status=active");
    router.refresh();
  };

  const handleVerifyToggle = async () => {
    const nextVerified = !verified;
    setBusy(true);
    const { error } = await supabase
      .from("listings")
      .update({ verified: nextVerified })
      .eq("id", listingId);
    setBusy(false);

    if (!error) {
      setVerified(nextVerified);
    }
    router.refresh();
  };

  const handleToggleRented = async () => {
    const nextStatus = currentStatus === "active" ? "rented" : "active";
    setBusy(true);
    await supabase.from("listings").update({ status: nextStatus }).eq("id", listingId);
    setBusy(false);
    router.push(`/admin/listings?status=${nextStatus}`);
    router.refresh();
  };

  if (currentStatus === "pending") {
    return (
      <div className="border-t border-warmgray-100 pt-6">
        <h2 className="font-medium mb-3">Review decision</h2>
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleApprove}
            disabled={busy}
            className="bg-teal-600 text-canvas font-medium px-5 py-2.5 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
          >
            Approve listing
          </button>
          <button
            onClick={() => setShowRejectInput((s) => !s)}
            className="border border-warmgray-200 text-warmgray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-canvas-card transition-colors"
          >
            Reject listing
          </button>
        </div>

        {showRejectInput && (
          <div className="flex gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional, shown to the landlord)"
              className="flex-1 bg-canvas-card border border-warmgray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
            <button
              onClick={handleReject}
              disabled={busy}
              className="bg-coral-400 text-canvas font-medium px-5 py-2.5 rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-60"
            >
              Confirm reject
            </button>
          </div>
        )}
      </div>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <div className="border-t border-warmgray-100 pt-6">
        <h2 className="font-medium mb-3">This listing was rejected</h2>
        <button
          onClick={handleReinstate}
          disabled={busy}
          className="bg-teal-600 text-canvas font-medium px-5 py-2.5 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
        >
          Reinstate — make active
        </button>
        <p className="text-warmgray-400 text-xs mt-2">
          Use this if the rejection was a mistake. This clears the rejection
          reason and puts the listing straight back live.
        </p>
      </div>
    );
  }

  if (currentStatus === "active" || currentStatus === "rented") {
    return (
      <div className="border-t border-warmgray-100 pt-6 flex gap-3">
        {currentStatus === "active" && (
          <button
            onClick={handleVerifyToggle}
            disabled={busy}
            className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60 ${
              verified
                ? "bg-coral-50 border border-coral-400 text-coral-600 hover:bg-coral-100"
                : "bg-teal-600 text-canvas hover:bg-teal-800"
            }`}
          >
            {verified ? "Remove verified badge" : "Mark verified"}
          </button>
        )}
        <button
          onClick={handleToggleRented}
          disabled={busy}
          className="border border-warmgray-200 text-warmgray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-canvas-card transition-colors disabled:opacity-60"
        >
          {currentStatus === "active" ? "Mark as rented" : "Relist as active"}
        </button>
      </div>
    );
  }

  return null;
}