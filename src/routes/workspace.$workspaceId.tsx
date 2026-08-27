import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { WorkspaceTopNav } from "@/components/workspace-topnav";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/workspace/$workspaceId")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { workspaceId } = Route.useParams();
  const { hydrated, user, setLastWorkspaceId, lastWorkspaceId } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  useEffect(() => {
    if (workspaceId && workspaceId !== lastWorkspaceId) setLastWorkspaceId(workspaceId);
  }, [workspaceId, lastWorkspaceId, setLastWorkspaceId]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <WorkspaceSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceTopNav />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
