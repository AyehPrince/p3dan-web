"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = { placeId: string; description: string };

type PlaceSelection = {
  name: string;
  latitude: number;
  longitude: number;
  placeId: string;
};

export default function PlacesAutocompleteWeb({
  cityName,
  value,
  onSelect,
}: {
  cityName: string | null;
  value: string;
  onSelect: (place: PlaceSelection) => void;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (text: string) => {
    setQuery(text);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim() || !cityName) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const input = `${text}, ${cityName}, Ghana`;
      const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`);
      const data = await res.json();
      setSuggestions(data.predictions || []);
      setLoading(false);
    }, 400);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    setQuery(suggestion.description);
    setOpen(false);
    setSuggestions([]);
    setLoading(true);
    const res = await fetch(`/api/places/details?placeId=${suggestion.placeId}`);
    const details = await res.json();
    setLoading(false);
    if (details.latitude) {
      onSelect({
        name: suggestion.description,
        latitude: details.latitude,
        longitude: details.longitude,
        placeId: suggestion.placeId,
      });
    }
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        disabled={!cityName}
        placeholder={cityName ? `Search area in ${cityName}` : "Select a city first"}
        className="w-full bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-60"
      />
      {loading && (
        <span className="absolute right-3 top-3 text-warmgray-400 text-xs">…</span>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute z-10 top-full left-0 right-0 bg-canvas-card border border-warmgray-100 rounded-xl mt-1.5 overflow-hidden shadow-sm">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-sm border-b border-warmgray-50 last:border-b-0 hover:bg-canvas transition-colors"
            >
              {s.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}