"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import PasswordRequirements from "@/components/PasswordRequirements";
import { isValidEmail, isPasswordValid } from "@/lib/validation";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid(password)) {
      setPasswordFocused(true);
      setError("Please meet all password requirements below.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      // Confirmation is off in this environment — already signed in
      router.push("/");
      router.refresh();
    } else {
      setMessage("Check your email for a confirmation link, then sign in.");
    }
  };

  return (
    <AuthLayout
      headline="List your place once. Reach real seekers."
      subhead="No agent fees on the app, no long back-and-forth — just direct contact with people actually looking."
    >
      <h1 className="font-heading font-bold text-2xl mb-1">Create account</h1>
      <p className="text-warmgray-600 text-sm mb-8">Find your next place, faster</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
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
          {email.length > 0 && !isValidEmail(email) && (
            <p className="text-coral-600 text-xs mt-1.5">
              That doesn&apos;t look like a valid email.
            </p>
          )}
        </div>
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Password
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

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-teal-600"
          />
          <span className="text-warmgray-600 text-xs leading-relaxed">
            I agree to p3dan&apos;s{" "}
            <Link href="/terms" target="_blank" className="text-coral-600 font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="text-coral-600 font-medium hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        {error && <p className="text-coral-600 text-sm">{error}</p>}
        {message && <p className="text-teal-600 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral-400 text-canvas rounded-xl py-3 font-medium hover:bg-coral-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-warmgray-600 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-coral-600 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}