import { cn } from "@/lib/utils";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="13" className="stroke-primary" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="2.6" className="fill-primary" />
        <circle cx="16" cy="5.5" r="2.2" className="fill-primary/70" />
        <circle cx="25.5" cy="21" r="2.2" className="fill-primary/70" />
        <circle cx="6.5" cy="21" r="2.2" className="fill-warning" />
        <path d="M16 16V7.5M16 16l8-4M16 16l-7.6 4.2" className="stroke-primary/60" strokeWidth="1.3" />
      </svg>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Logo />
      <span className="text-[15px] font-semibold tracking-tight">
        Chronos<span className="text-primary">Graph</span>
      </span>
    </span>
  );
}
