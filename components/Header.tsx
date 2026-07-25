"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import PinIcon from "./PinIcon";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkSuspension = async (currentUser: User) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_suspended")
        .eq("id", currentUser.id)
        .single();

      if (profile?.is_suspended) {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/suspended");
        return;
      }
      setUser(currentUser);
    };

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        checkSuspension(data.user);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkSuspension(session.user);
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-canvas relative z-10 border-b border-warmgray-100">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PinIcon size={22} />
          <span className="font-heading font-bold text-lg tracking-tight">p3dan</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-warmgray-600">
          <Link href="/listings" className="hover:text-warmgray-900">
            Browse
          </Link>

          {loading ? null : user ? (
            <>
              <span className="hidden sm:inline text-warmgray-400">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="hover:text-warmgray-900"
              >
                Sign out
              </button>
              <Link href="/my-listings" className="hover:text-warmgray-900">
                My listings
              </Link>
              <Link
                href="/list-property"
                className="bg-coral-400 text-canvas px-4 py-2 rounded-lg font-medium hover:bg-coral-600 transition-colors"
              >
                List a property
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:text-warmgray-900">
                Sign in
              </Link>
              <Link
                href="/sign-in?redirect=/list-property"
                className="bg-coral-400 text-canvas px-4 py-2 rounded-lg font-medium hover:bg-coral-600 transition-colors"
              >
                List a property
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}