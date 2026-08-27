import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});

const link = "rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground";
const active = "bg-accent text-foreground";

function SettingsLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Workspaces
        </Link>
        <Wordmark className="hidden sm:flex" />
        <nav className="ml-4 flex items-center gap-1">
          <Link
            to="/settings"
            activeOptions={{ exact: true }}
            className={link}
            activeProps={{ className: cn(link, active) }}
          >
            Admin
          </Link>
          <Link to="/settings/profile" className={link} activeProps={{ className: cn(link, active) }}>
            Profile
          </Link>
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
