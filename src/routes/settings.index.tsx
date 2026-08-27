import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { canAdmin, roleLabel, useApp } from "@/lib/app-state";
import { users } from "@/lib/mock-data";
import type { Role } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "Admin settings — ChronosGraph" },
      {
        name: "description",
        content: "Manage users, roles, workspace access and background auditor health.",
      },
      { property: "og:title", content: "Admin settings — ChronosGraph" },
      {
        property: "og:description",
        content: "Manage users, roles, workspace access and background auditor health.",
      },
    ],
  }),
  component: AdminSettings;
});

function AdminSettings() {
  return null;
}
