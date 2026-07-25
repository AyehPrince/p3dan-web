"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import { isValidEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      headline="Forgot your password?"
      subhead="No problem — we'll send you a link to reset it."
    >
      <h1 className="font-heading font-bold text-2xl mb-1">Reset password</h1>
      <p className="text-warmgray-600 text-sm mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <p className="text-teal-600 text-sm bg-teal-50 border border-teal-100 rounded-lg px-4 py-3">
          Check your email for a link to reset your password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {error && <p className="text-coral-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-canvas rounded-xl py-3 font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-warmgray-600 text-sm text-center mt-6">
        <Link href="/sign-in" className="text-coral-600 font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}