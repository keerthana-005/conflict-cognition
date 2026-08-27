import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileUp, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NoAccess } from "./workspace.$workspaceId.conflicts.index";
import { useApp } from "@/lib/app-state";
import { documents as seedDocs } from "@/lib/mock-data";
import type { DocStatus, IngestedDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace/$workspaceId/ingestion")({
  head: () => ({
    meta: [
      { title: "Ingestion dashboard — ChronosGraph" },
      {
        name: "description",
        content: "Track per-document parsing, entity extraction and neighborhood conflict audits.",
      },
      { property: "og:title", content: "Ingestion dashboard — ChronosGraph" },
      {
        property: "og:description",
        content: "Track per-document parsing, entity extraction and neighborhood conflict audits.",
      },
    ],
  }),
  component: IngestionPage,
});

const STAGES: DocStatus[] = ["queued", "parsing", "extracting", "resolving", "auditing", "complete"];

const STATUS_LABEL: Record<DocStatus, string> = {
  queued: "Queued",
  parsing: "Parsing",
  extracting: "Extracting entities",
  resolving: "Resolving against existing graph",
  auditing: "Auditing affected neighborhood",
  complete: "Complete",
  failed: "Failed",
};

function statusClass(s: DocStatus) {
  if (s === "complete") return "bg-success/15 text-success";
  if (s === "failed") return "bg-danger-surface text-destructive";
  if (s === "queued") return "bg-muted text-muted-foreground";
  return "bg-primary/10 text-primary";
}

function IngestionPage() {
  const { workspaceId } = Route.useParams();
  const { role, conflicts } = useApp();
  const [docs, setDocs] = useState<IngestedDocument[]>(() =>
    seedDocs.filter((d) => d.workspaceId === workspaceId),
  );
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setInterval(() => {
      setDocs((prev) =>
        prev.map((d) => {
          if (d.status === "complete" || d.status === "failed") return d;
          const i = STAGES.indexOf(d.status);
          const next = STAGES[Math.min(i + 1, STAGES.length - 1)]!;
          return {
            ...d,
            status: next,
            auditedNodes: next === "auditing" ? d.auditedNodes + 7 : d.auditedNodes,
            newFacts: next === "extracting" ? d.newFacts + 2 : d.newFacts,
          };
        }),
      );
    }, 3500);
    return () => window.clearInterval(t);
  }, []);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const added: IngestedDocument[] = Array.from(files).map((f, i) => ({
        id: `d-${Date.now()}-${i}`,
        workspaceId,
        filename: f.name,
        kind: f.name.endsWith(".pdf")
          ? "pdf"
          : f.name.endsWith(".docx")
            ? "docx"
            : f.name.endsWith(".xlsx")
              ? "xlsx"
              : "image",
        status: "queued",
        uploadedAt: new Date().toISOString(),
        newFacts: 0,
        updatedFacts: 0,
        auditedNodes: 0,
      }));
      setDocs((prev) => [...added, ...prev]);
    },
    [workspaceId],
  );

  if (role === "analyst") return <NoAccess />;

  const newConflicts = conflicts.filter(
    (c) => c.workspaceId === workspaceId && c.status === "needs_review",
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-xl font-semibold tracking-tight">Ingestion dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every upload updates the existing graph incrementally — nothing is rebuilt from scratch.
      </p>

      {newConflicts > 0 && (
        <Link
          to="/workspace/$workspaceId/conflicts"
          params={{ workspaceId }}
          className="mt-5 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning-surface px-4 py-3 text-sm text-warning-foreground hover:brightness-105"
        >
          <TriangleAlert className="size-4" />
          {newConflicts} new contradiction{newConflicts > 1 ? "s" : ""} detected since your last visit
          <ArrowRight className="ml-auto size-4" />
        </Link>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-6 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card",
        )}
      >
        <FileUp className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">Drop documents here or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, XLSX and scanned images</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Filename</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Graph impact</th>
              <th className="px-4 py-2.5 font-medium">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{d.filename}</td>
                <td className="px-4 py-3">
                  <span
                    title={d.errorReason}
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                      statusClass(d.status),
                    )}
                  >
                    {STATUS_LABEL[d.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {d.status === "failed"
                    ? "No changes applied"
                    : d.status === "queued"
                      ? "Waiting for a worker"
                      : `Found ${d.newFacts} new facts, ${d.updatedFacts} updated facts, auditing ${d.auditedNodes} affected nodes for conflicts`}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(d.uploadedAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No documents ingested in this workspace yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
