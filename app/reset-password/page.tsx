"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import PasswordRequirements from "@/components/PasswordRequirements";
import { isPasswordValid } from "@/lib/validation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(password)) {
      setError("Please meet all password requirements below.");
      setPasswordFocused(true);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthLayout
      headline="Almost there."
      subhead="Set a new password to get back into your account."
    >
      <h1 className="font-heading font-bold text-2xl mb-1">Set new password</h1>
      <p className="text-warmgray-600 text-sm mb-8">Choose a new password below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            required
            className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          {(passwordFocused || password.length > 0) && (
            <PasswordRequirements password={password} />
          )}
        </div>

        {error && <p className="text-coral-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-canvas rounded-xl py-3 font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}