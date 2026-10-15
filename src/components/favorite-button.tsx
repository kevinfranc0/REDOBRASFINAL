"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  targetType,
  targetId,
  initial = false,
  className,
}: {
  targetType: "listing" | "profile" | "project";
  targetId: string;
  initial?: boolean;
  className?: string;
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      aria-label={on ? "Quitar de favoritos" : "Guardar"}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOn((v) => !v);
        start(async () => {
          try {
            await toggleFavoriteAction(targetType, targetId);
          } catch {
            setOn((v) => !v);
          }
        });
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-white/90 text-mute shadow-sm backdrop-blur",
        on && "text-leaf",
        className,
      )}
    >
      <Heart size={18} className={on ? "fill-leaf text-leaf" : ""} />
    </button>
  );
}
