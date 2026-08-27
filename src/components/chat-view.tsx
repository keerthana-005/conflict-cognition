import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  SendHorizonal,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/app-state";
import { promptSuggestions } from "@/lib/mock-data";
import type { Chat, ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatWindow(from: string, to: string | null) {
  return `${from} → ${to ?? "present"}`;
}

function buildAnswer(question: string): ChatMessage {
  const q = question.toLowerCase();
  if (q.includes("sick") || q.includes("leave")) {
    return {
      id: `m-${Date.now()}-a`,
      role: "assistant",
      createdAt: new Date().toISOString(),
      content:
        "Current best evidence: 15 paid sick days per calendar year, effective 1 January 2025 [1]. The prior entitlement of 10 days applied from 2022 until the end of 2024 [2]. A Q1 2025 addendum states a 12-day cap for a legacy cohort [3] and has not been reconciled.",
      citations: [
        {
          index: 1,
          documentId: "doc-handbook-2025",
          documentName: "Employee_Handbook_2025.pdf",
          snippet:
            "Effective 1 January 2025, the annual paid sick leave entitlement increases to fifteen (15) days.",
          validFrom: "2025-01-01",
          validTo: null,
          entityId: "ent-sick-leave",
        },
        {
          index: 2,
          documentId: "doc-handbook-2022",
          documentName: "Employee_Handbook_2022.pdf",
          snippet: "Full-time employees accrue ten (10) paid sick days per calendar year.",
          validFrom: "2022-01-01",
          validTo: "2024-12-31",
          entityId: "ent-sick-leave",
        },
        {
          index: 3,
          documentId: "doc-benefits-addendum",
          documentName: "Benefits_Addendum_Q1_2025.docx",
          snippet:
            "Sick leave remains capped at twelve (12) days for staff on the legacy benefits schedule.",
          validFrom: "2025-01-01",
          validTo: null,
          entityId: "ent-sick-leave",
        },
      ],
      conflictRefs: ["cf-1"],
    };
  }
  if (q.includes("notice")) {
    return {
      id: `m-${Date.now()}-a`,
      role: "assistant",
      createdAt: new Date().toISOString(),
      content:
        "Current best evidence: the standard resignation notice period is 60 days from 1 July 2025 [1]. The earlier 30-day requirement applied from 2022 to 30 June 2025 [2]; that supersession was auto-resolved with high confidence.",
      citations: [
        {
          index: 1,
          documentId: "doc-handbook-2025",
          documentName: "Employee_Handbook_2025.pdf",
          snippet: "From 1 July 2025 the standard notice period is sixty (60) days.",
          validFrom: "2025-07-01",
          validTo: null,
          entityId: "ent-notice-period",
        },
        {
          index: 2,
          documentId: "doc-handbook-2022",
          documentName: "Employee_Handbook_2022.pdf",
          snippet: "Employees shall give thirty (30) days written notice of resignation.",
          validFrom: "2022-01-01",
          validTo: "2025-06-30",
          entityId: "ent-notice-period",
        },
      ],
    };
  }
  return {
    id: `m-${Date.now()}-a`,
    role: "assistant",
    createdAt: new Date().toISOString(),
    content:
      "Current best evidence from this workspace's graph: renewal terms for the Acme MSA are 24 months following Amendment 2 (15 January 2026) [1], amending the original 12-month term [2]. The amendment does not state how in-flight renewals are treated, so this remains open for review.",
    citations: [
      {
        index: 1,
        documentId: "doc-acme-amend-2",
        documentName: "Acme_Amendment_2_2026.pdf",
        snippet: "Section 4.2 is amended so that renewal terms shall be twenty-four (24) months.",
        validFrom: "2026-01-15",
        validTo: null,
        entityId: "ent-renewal-term",
      },
      {
        index: 2,
        documentId: "doc-acme-msa",
        documentName: "Acme_MSA_2023.pdf",
        snippet: "This Agreement renews automatically for successive twelve (12) month terms.",
        validFrom: "2023-04-01",
        validTo: null,
        entityId: "ent-renewal-term",
      },
    ],
    conflictRefs: ["cf-4"],
  };
}

export function ChatView({ workspaceId, chat }: { workspaceId: string; chat: Chat | null }) {
  const { appendMessages, createChat, conflicts } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = useMemo(() => chat?.messages ?? [], [chat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chat?.id]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content) return;
    let targetId = chat?.id;
    if (!targetId) {
      const created = createChat(workspaceId);
      targetId = created.id;
      navigate({
        to: "/workspace/$workspaceId/chat/$chatId",
        params: { workspaceId, chatId: created.id },
      });
    }
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}-u`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    appendMessages(targetId, [userMsg]);
    setDraft("");
    setPending(true);
    const id = targetId;
    window.setTimeout(() => {
      appendMessages(id, [buildAnswer(content)]);
      setPending(false);
      inputRef.current?.focus();
    }, 900);
  };

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-6">
      <div className="flex-1 space-y-6 py-8">
        {messages.length === 0 && !pending && (
          <div className="py-16 text-center">
            <h1 className="text-xl font-semibold tracking-tight">Ask about this corpus</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Answers cite the source documents and their validity windows, and flag facts with known
              contradictions.
            </p>
            <div className="mx-auto mt-6 grid max-w-lg gap-2">
              {promptSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm hover:border-primary/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                {m.content}
              </div>
            </div>
          ) : (
            <AnswerCard key={m.id} message={m} workspaceId={workspaceId} conflictTitles={conflicts} />
          ),
        )}

        {pending && (
          <p className="animate-pulse text-sm text-muted-foreground">
            Retrieving facts and auditing the affected neighborhood…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-background pb-6">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="size-3.5" /> Retrieval filters
          {showFilters ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        </button>
        {showFilters && (
          <div className="mb-2 grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Valid from</label>
              <Input type="date" className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Source type</label>
              <Input placeholder="PDF, DOCX, XLSX" className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Entity type</label>
              <Input placeholder="policy, clause, person" className="h-8 text-xs" />
            </div>
          </div>
        )}
        <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2">
          <Textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={1}
            placeholder="Ask a question about these documents…"
            className="min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none focus-visible:ring-0"
          />
          <Button size="icon" onClick={() => send(draft)} disabled={!draft.trim()} aria-label="Send">
            <SendHorizonal className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Answers reflect current best evidence in the graph and may be incomplete.
        </p>
      </div>
    </div>
  );
}

function AnswerCard({
  message,
  workspaceId,
  conflictTitles,
}: {
  message: ChatMessage;
  workspaceId: string;
  conflictTitles: ReturnType<typeof useApp>["conflicts"];
}) {
  const [open, setOpen] = useState(false);
  const refs = (message.conflictRefs ?? []).filter((id) => {
    const c = conflictTitles.find((x) => x.id === id);
    return Boolean(c);
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

      {refs.map((id) => {
        const conflict = conflictTitles.find((c) => c.id === id)!;
        return (
          <div
            key={id}
            className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-warning/40 bg-warning-surface px-3 py-2 text-xs text-warning-foreground"
          >
            <TriangleAlert className="size-4 shrink-0" />
            <span className="font-medium">
              Conflicting information exists for this fact ({conflict.entityName})
            </span>
            <Link
              to="/workspace/$workspaceId/conflicts/$conflictId"
              params={{ workspaceId, conflictId: id }}
              className="ml-auto font-semibold underline underline-offset-2"
            >
              View details
            </Link>
          </div>
        );
      })}

      {message.citations && message.citations.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            Evidence & timeline ({message.citations.length} sources)
          </button>
          {open && (
            <ul className="mt-3 space-y-2">
              {message.citations.map((c) => (
                <li key={c.index} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="flex size-5 items-center justify-center rounded bg-accent text-[10px]">
                      {c.index}
                    </span>
                    <FileText className="size-3.5 text-muted-foreground" />
                    {c.documentName}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">“{c.snippet}”</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {formatWindow(c.validFrom, c.validTo)}
                    </span>
                    {c.entityId && (
                      <Link
                        to="/workspace/$workspaceId/entity/$entityId"
                        params={{ workspaceId, entityId: c.entityId }}
                        className={cn("text-primary hover:underline")}
                      >
                        View entity timeline
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
