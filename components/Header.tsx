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
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
    window.location.href = "/";
  };

  const closeMenu = () => setMenuOpen(false);

  // Where the "List a property" button sends people
  const listHref = user ? "/list-property" : "/sign-in?redirect=/list-property";

  const renderLinks = (mobile: boolean) => {
    if (loading) return null;

    const linkClass = mobile
      ? "block py-3 text-base hover:text-warmgray-900"
      : "hover:text-warmgray-900 whitespace-nowrap";

    const ctaClass =
      "bg-coral-400 text-canvas px-4 py-2 rounded-lg font-medium hover:bg-coral-600 transition-colors whitespace-nowrap";

    if (user) {
      return (
        <>
          <Link href="/listings" className={linkClass} onClick={closeMenu}>
            Browse
          </Link>
          {!mobile && (
            <span className="hidden lg:inline text-warmgray-400 whitespace-nowrap">
              {user.email}
            </span>
          )}
          <Link href="/my-listings" className={linkClass} onClick={closeMenu}>
            My listings
          </Link>
          <button
            onClick={handleSignOut}
            className={`${linkClass} ${mobile ? "w-full text-left" : ""}`}
          >
            Sign out
          </button>
          {!mobile && (
            <Link href="/list-property" className={ctaClass} onClick={closeMenu}>
              List a property
            </Link>
          )}
        </>
      );
    }

    return (
      <>
        <Link href="/listings" className={linkClass} onClick={closeMenu}>
          Browse
        </Link>
        <Link href="/sign-in" className={linkClass} onClick={closeMenu}>
          Sign in
        </Link>
        {!mobile && (
          <Link
            href="/sign-in?redirect=/list-property"
            className={ctaClass}
            onClick={closeMenu}
          >
            List a property
          </Link>
        )}
      </>
    );
  };

  return (
    <header className="bg-canvas relative z-10 border-b border-warmgray-100">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
          <PinIcon size={22} />
          <span className="font-heading font-bold text-lg tracking-tight">p3dan</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm text-warmgray-600">
          {renderLinks(false)}
        </nav>

        {/* Mobile: visible List button + menu icon */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href={listHref}
            onClick={closeMenu}
            className="bg-coral-400 text-canvas text-sm px-3 py-2 rounded-lg font-medium hover:bg-coral-600 transition-colors whitespace-nowrap"
          >
            List a property
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="p-2 -mr-2 text-warmgray-900"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-warmgray-100 px-6 pb-6 pt-2 flex flex-col text-warmgray-600">
          {user && (
            <p className="text-sm text-warmgray-400 truncate pb-2 border-b border-warmgray-100 mb-2">
              {user.email}
            </p>
          )}
          {renderLinks(true)}
        </div>
      )}
    </header>
  );
}