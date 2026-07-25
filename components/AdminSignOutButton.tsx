"use client";

import { createClient } from "@/lib/supabase/client";

export default function AdminSignOutButton() {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button onClick={handleSignOut} className="hover:text-canvas">
      Sign out
    </button>
  );
}