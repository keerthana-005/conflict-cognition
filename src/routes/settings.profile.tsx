import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleLabel, useApp } from "@/lib/app-state";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — ChronosGraph" },
      { name: "description", content: "Update your account details and password." },
      { property: "og:title", content: "Your profile — ChronosGraph" },
      { property: "og:description", content: "Update your account details and password." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, logout, hydrated } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your role is set by an admin and can't be changed here.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-1.5">
          <Label htmlFor="pname">Full name</Label>
          <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pemail">Email</Label>
          <Input id="pemail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Input value={roleLabel[user.role]} readOnly className="bg-muted text-muted-foreground" />
        </div>
        <Button
          onClick={() => {
            updateUser({ name, email });
            toast.success("Profile updated");
          }}
        >
          Save changes
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Change password</h2>
        <div className="space-y-1.5">
          <Label htmlFor="cur">Current password</Label>
          <Input id="cur" type="password" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" />
        </div>
        <Button variant="outline" onClick={() => toast.success("Password updated")}>
          Update password
        </Button>
      </section>

      <Button
        variant="ghost"
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
      >
        Log out
      </Button>
    </div>
  );
}
