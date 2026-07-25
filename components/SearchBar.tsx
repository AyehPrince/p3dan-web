"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = { placeId: string; description: string };

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (text: string) => {
    setQuery(text);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(text)}`);
      const data = await res.json();
      setSuggestions(data.predictions || []);
      setLoading(false);
    }, 350);
  };

  const goToListings = (q: string) => {
    setOpen(false);
    router.push(`/listings?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToListings(query);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    // Use just the first part of the description (the actual place name)
    // so the ilike filter matches area_name cleanly, e.g. "Adenta" not
    // "Adenta, Accra, Ghana"
    const shortName = suggestion.description.split(",")[0];
    setQuery(suggestion.description);
    goToListings(shortName);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search area, e.g. Adenta"
          className="flex-1 bg-canvas-card border border-warmgray-100 rounded-xl px-4 py-3 text-sm text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        <button
          type="submit"
          className="bg-teal-600 text-canvas rounded-xl px-5 py-3 text-sm font-medium hover:bg-teal-800 transition-colors"
        >
          Search
        </button>
      </form>

      {open && (loading || suggestions.length > 0) && (
        <div className="absolute z-10 top-full left-0 right-0 bg-canvas-card border border-warmgray-100 rounded-xl mt-1.5 overflow-hidden shadow-sm">
          {loading && (
            <div className="px-4 py-3 text-sm text-warmgray-400">Searching…</div>
          )}
          {!loading &&
            suggestions.map((s) => (
              <button
                key={s.placeId}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
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