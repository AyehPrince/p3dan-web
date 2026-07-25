"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Option } from "@/lib/options";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function ListingFilters({
  roomTypes,
  cities,
}: {
  roomTypes: Option[];
  cities: Option[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/listings?${params.toString()}`);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("q", query);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray-400">
          <SearchIcon />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search area or title"
          className="w-full bg-canvas-card border border-warmgray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>
      <select
        defaultValue={searchParams.get("roomType") ?? ""}
        onChange={(e) => updateParam("roomType", e.target.value)}
        className="bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <option value="">Any room type</option>
        {roomTypes.map((rt) => (
          <option key={rt.id} value={rt.id}>
            {rt.name}
          </option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get("city") ?? ""}
        onChange={(e) => updateParam("city", e.target.value)}
        className="bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <option value="">Any city</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}