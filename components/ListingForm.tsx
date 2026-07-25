"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PlacesAutocompleteWeb from "./PlacesAutocompleteWeb";
import type { Option } from "@/lib/options";
import type { MyListingEditData } from "@/lib/myListings";

const OTHER_ROOM_TYPE_ID = "other";

export default function ListingForm({
  roomTypes,
  cities,
  userId,
  mode = "create",
  listingId,
  initialData,
}: {
  roomTypes: Option[];
  cities: Option[];
  userId: string;
  mode?: "create" | "edit";
  listingId?: string;
  initialData?: MyListingEditData;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [roomTypeId, setRoomTypeId] = useState(
    initialData?.room_type_id ?? (initialData?.custom_room_type ? OTHER_ROOM_TYPE_ID : "")
  );
  const [customRoomType, setCustomRoomType] = useState(initialData?.custom_room_type ?? "");
  const [cityId, setCityId] = useState(initialData?.city_id ?? "");
  const [areaName, setAreaName] = useState(initialData?.area_name ?? "");
  const [placeId, setPlaceId] = useState<string | null>(initialData?.place_id ?? null);
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude ?? null);
  const [price, setPrice] = useState(initialData ? String(initialData.price) : "");
  const [leaseTermYears, setLeaseTermYears] = useState(
    initialData ? String(initialData.lease_term_years) : "1"
  );
  const [paymentStructure, setPaymentStructure] = useState(
    initialData?.payment_structure ?? "full_upfront"
  );
  const [deposit, setDeposit] = useState(
    initialData?.deposit_months ? String(initialData.deposit_months) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCity = cities.find((c) => c.id === cityId);

  const handleCityChange = (id: string) => {
    setCityId(id);
    setAreaName("");
    setPlaceId(null);
    setLatitude(null);
    setLongitude(null);
  };

  const handleAreaSelect = (place: { name: string; latitude: number; longitude: number; placeId: string }) => {
    setAreaName(place.name);
    setPlaceId(place.placeId);
    setLatitude(place.latitude);
    setLongitude(place.longitude);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !price || !cityId || !areaName || !roomTypeId) {
      setError("Please fill in title, room type, price, city, and area.");
      return;
    }
    if (roomTypeId === OTHER_ROOM_TYPE_ID && !customRoomType.trim()) {
      setError("Please describe the room type.");
      return;
    }
    if (latitude === null || longitude === null) {
      setError("Please select an area from the suggestions list.");
      return;
    }

    setSubmitting(true);
    const isOther = roomTypeId === OTHER_ROOM_TYPE_ID;

    const payload = {
      title,
      description,
      price: parseFloat(price),
      deposit_months: deposit ? parseFloat(deposit) : 0,
      room_type_id: isOther ? null : roomTypeId,
      custom_room_type: isOther ? customRoomType : null,
      city_id: cityId,
      area_name: areaName,
      place_id: placeId,
      lease_term_years: parseInt(leaseTermYears, 10),
      payment_structure: paymentStructure,
      latitude,
      longitude,
    };

    if (mode === "edit" && listingId) {
      const { error: updateError } = await supabase
        .from("listings")
        .update(payload)
        .eq("id", listingId);
      setSubmitting(false);

      if (updateError) {
        setError(updateError.message);
        return;
      }
      router.push("/my-listings");
      router.refresh();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert({ owner_id: userId, ...payload })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Something went wrong.");
      return;
    }

    router.push(`/list-property/photos/${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Cozy 2 bedroom self-contain"
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Description
        </label>
        <textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Tell renters what makes this place worth seeing"
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Room type
        </label>
        <select
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="">Select a room type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
          <option value={OTHER_ROOM_TYPE_ID}>Other, please specify</option>
        </select>
      </div>

      {roomTypeId === OTHER_ROOM_TYPE_ID && (
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Describe the room type
          </label>
          <input
            value={customRoomType}
            onChange={(e) => setCustomRoomType(e.target.value)}
            placeholder="e.g. Boys' quarters, Penthouse"
            className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      )}

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          City
        </label>
        <select
          value={cityId}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="">Select a city</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Area
        </label>
        <PlacesAutocompleteWeb
          cityName={selectedCity?.name ?? null}
          value={areaName}
          onSelect={handleAreaSelect}
        />
      </div>

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Price per month (GHS)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="900"
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Lease term
          </label>
          <select
            value={leaseTermYears}
            onChange={(e) => setLeaseTermYears(e.target.value)}
            className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="1">1 year</option>
            <option value="2">2 years</option>
          </select>
        </div>
        <div>
          <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
            Payment structure
          </label>
          <select
            value={paymentStructure}
            onChange={(e) => setPaymentStructure(e.target.value)}
            className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="full_upfront">Full amount upfront</option>
            <option value="installments">Installments negotiable</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-warmgray-600 text-xs font-medium mb-1.5">
          Extra deposit, if any (months)
        </label>
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          placeholder="0"
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {error && <p className="text-coral-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-teal-600 text-canvas rounded-xl py-3 font-medium hover:bg-teal-800 transition-colors disabled:opacity-60"
      >
        {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Submit listing"}
      </button>

      {mode === "create" && (
        <p className="text-warmgray-400 text-xs text-center">
          Your listing will be reviewed before it goes live.
        </p>
      )}
    </form>
  );
}