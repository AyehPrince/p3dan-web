import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMyListings } from "@/lib/myListings";
import Header from "@/components/Header";
import MyListingsTable from "@/components/MyListingsTable";

export default async function MyListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/my-listings");
  }

  const listings = await fetchMyListings(user.id);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">My listings</h1>
        <p className="text-warmgray-600 mb-8">Manage the properties you&apos;ve posted.</p>
        <MyListingsTable listings={listings} />
      </main>
    </>
  );
}