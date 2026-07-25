import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchRoomTypeOptions, fetchCityOptions } from "@/lib/options";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";

export default async function ListPropertyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/list-property");
  }

  const [roomTypes, cities] = await Promise.all([
    fetchRoomTypeOptions(),
    fetchCityOptions(),
  ]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">
          List a property
        </h1>
        <p className="text-warmgray-600 mb-8">
          Fill in the details below — your listing will be reviewed before it
          goes live.
        </p>
        <ListingForm roomTypes={roomTypes} cities={cities} userId={user.id} />
      </main>
    </>
  );
}