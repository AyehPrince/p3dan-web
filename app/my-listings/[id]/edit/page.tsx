import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchMyListingForEdit } from "@/lib/myListings";
import { fetchRoomTypeOptions, fetchCityOptions } from "@/lib/options";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirect=/my-listings/${id}/edit`);
  }

  const [listing, roomTypes, cities] = await Promise.all([
    fetchMyListingForEdit(id, user.id),
    fetchRoomTypeOptions(),
    fetchCityOptions(),
  ]);

  if (!listing) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">Edit listing</h1>
        <p className="text-warmgray-600 mb-8">{listing.title}</p>
        <ListingForm
          roomTypes={roomTypes}
          cities={cities}
          userId={user.id}
          mode="edit"
          listingId={id}
          initialData={listing}
        />
      </main>
    </>
  );
}