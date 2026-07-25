"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminUser } from "@/lib/admin";

const roleStyles: Record<string, string> = {
  seeker: "bg-warmgray-100 text-warmgray-700",
  landlord: "bg-teal-100 text-teal-900",
  admin: "bg-coral-100 text-coral-800",
};

export default function AdminUsersTable({
  users,
  currentAdminId,
}: {
  users: AdminUser[];
  currentAdminId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
 const [overrides, setOverrides] = useState<Record<string, Partial<AdminUser>>>({});

  const getUser = (user: AdminUser): AdminUser => ({
    ...user,
    ...overrides[user.id],
  });

  const runUpdate = async (
    userId: string,
    patch: Partial<AdminUser>,
    dbPatch: Record<string, unknown>
  ) => {
    setError(null);
    setBusy(userId);
    const { error: updateError, count } = await supabase
      .from("profiles")
      .update(dbPatch, { count: "exact" })
      .eq("id", userId);
    setBusy(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    if (count === 0) {
      setError(
        "Update didn't apply — you may not have permission to change this user."
      );
      return;
    }

    setOverrides((prev) => ({ ...prev, [userId]: { ...prev[userId], ...patch } }));
    router.refresh();
  };

  const handlePromote = (userId: string) =>
    runUpdate(userId, { role: "admin" }, { role: "admin" });

  const handleDemote = (userId: string) =>
    runUpdate(userId, { role: "seeker" }, { role: "seeker" });

  const handleTrustToggle = (user: AdminUser) => {
    const next = !getUser(user).is_trusted;
    runUpdate(user.id, { is_trusted: next }, { is_trusted: next });
  };

  const handleSuspend = (userId: string) => {
    runUpdate(
      userId,
      { is_suspended: true, suspended_reason: reason || null },
      { is_suspended: true, suspended_reason: reason || null }
    ).then(() => {
      setSuspendingId(null);
      setReason("");
    });
  };

  const handleUnsuspend = (userId: string) =>
    runUpdate(
      userId,
      { is_suspended: false, suspended_reason: null },
      { is_suspended: false, suspended_reason: null }
    );

  const filtered = users.filter((u) =>
    (u.full_name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name"
        className="w-full max-w-sm bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />

      {error && (
        <p className="text-coral-600 text-sm mb-4 bg-coral-50 border border-coral-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((rawUser) => {
          const user = getUser(rawUser);
          const isSelf = user.id === currentAdminId;
          return (
            <div
              key={user.id}
              className="bg-canvas-card border border-warmgray-100 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-medium text-sm">
                      {user.full_name || "No name"}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${roleStyles[user.role]}`}>
                      {user.role}
                    </span>
                    {user.is_trusted && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-100 text-teal-900">
                        trusted landlord
                      </span>
                    )}
                    {user.is_suspended && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-coral-100 text-coral-800">
                        suspended
                      </span>
                    )}
                  </div>
                  <p className="text-warmgray-600 text-xs">
                    {user.phone || "No phone"} · {user.listing_count}{" "}
                    {user.listing_count === 1 ? "listing" : "listings"} · joined{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  {user.is_suspended && user.suspended_reason && (
                    <p className="text-coral-600 text-xs mt-1">
                      Reason: {user.suspended_reason}
                    </p>
                  )}
                </div>

                {!isSelf && (
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => handleTrustToggle(user)}
                      disabled={busy === user.id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                        user.is_trusted
                          ? "bg-coral-50 border border-coral-400 text-coral-600 hover:bg-coral-100"
                          : "bg-teal-600 text-canvas hover:bg-teal-800"
                      }`}
                    >
                      {user.is_trusted ? "Remove trusted" : "Mark trusted"}
                    </button>

                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleDemote(user.id)}
                        disabled={busy === user.id}
                        className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors disabled:opacity-60"
                      >
                        Remove admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromote(user.id)}
                        disabled={busy === user.id}
                        className="border border-warmgray-200 text-warmgray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-canvas transition-colors disabled:opacity-60"
                      >
                        Make admin
                      </button>
                    )}

                    {user.role !== "admin" && (
                      user.is_suspended ? (
                        <button
                          onClick={() => handleUnsuspend(user.id)}
                          disabled={busy === user.id}
                          className="bg-teal-600 text-canvas text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuspendingId(suspendingId === user.id ? null : user.id)}
                          className="bg-coral-400 text-canvas text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-coral-600 transition-colors"
                        >
                          Suspend
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {suspendingId === user.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason (internal note, optional)"
                    className="flex-1 bg-canvas border border-warmgray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-coral-400"
                  />
                  <button
                    onClick={() => handleSuspend(user.id)}
                    disabled={busy === user.id}
                    className="bg-coral-400 text-canvas text-xs font-medium px-3 py-2 rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-60"
                  >
                    Confirm suspend
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}