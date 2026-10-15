"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export function SearchBox({
  placeholder = "Buscar servicios, materiales, proyectos...",
  initial = "",
  withFilter = false,
}: {
  placeholder?: string;
  initial?: string;
  withFilter?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      router.push("/buscar");
      return;
    }
    router.push(`/buscar?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <label className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-card">
        <Search size={18} className="text-mute" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-mute"
        />
      </label>
      {withFilter ? (
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest shadow-card"
          aria-label="Filtros"
        >
          <SlidersHorizontal size={18} />
        </button>
      ) : null}
    </form>
  );
}
