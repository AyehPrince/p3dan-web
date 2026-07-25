"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/AuthLayout";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  };

  return (
    <AuthLayout
      headline="Finding a place shouldn't feel like a gamble."
      subhead="Real fees, real areas, and a straight line to the landlord — no middleman, no surprises."
    >
      <h1 className="font-heading font-bold text-2xl mb-1">Welcome back</h1>
      <p className="text-warmgray-600 text-sm mb-8">Sign in to continue</p>

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
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center mt-4">
        <Link href="/forgot-password" className="text-warmgray-600 text-xs hover:text-warmgray-900">
          Forgot password?
        </Link>
      </p>

      <p className="text-warmgray-600 text-sm text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-coral-600 font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}