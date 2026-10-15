import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-9 w-9", className)}
      fill="none"
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill="currentColor" opacity="0" />
      <path
        d="M10 46V28l12-10 8 7 12-11 12 10v22H10z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M26 46V32h8v14"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M22 22v8" stroke="currentColor" strokeWidth="3.2" />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  const color = variant === "light" ? "text-white" : "text-forest";
  return (
    <div className={cn("flex items-center gap-2.5", color)}>
      <LogoMark className="h-9 w-9" />
      <div className={cn(compact && "hidden sm:block")}>
        <p className="font-display text-[17px] font-semibold leading-none tracking-[0.18em]">
          REDOBRA
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.18em] opacity-80">
          Popayán
        </p>
      </div>
    </div>
  );
}
