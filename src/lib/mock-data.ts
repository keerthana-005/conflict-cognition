import type {
  AuditEntry,
  Chat,
  Conflict,
  Entity,
  GraphEdge,
  GraphNode,
  IngestedDocument,
  User,
  Workspace,
} from "./types";

export const workspaces: Workspace[] = [
  {
    id: "ws-hr",
    name: "HR Policies",
    description: "Employee handbooks, leave policies, benefits addenda.",
    documentCount: 148,
    unresolvedConflicts: 3,
    updatedAt: "2026-08-24T10:12:00Z",
  },
  {
    id: "ws-legal",
    name: "Legal Docs",
    description: "Master agreements, renewals, amendments and SOWs.",
    documentCount: 412,
    unresolvedConflicts: 2,
    updatedAt: "2026-08-26T16:40:00Z",
  },
  {
    id: "ws-medical",
    name: "Medical Records",
    description: "Clinical protocols, dosage guidance, care pathways.",
    documentCount: 89,
    unresolvedConflicts: 0,
    updatedAt: "2026-08-20T08:05:00Z",
  },
];

export const users: User[] = [
  {
    id: "u-1",
    name: "Keerthana S",
    email: "keerthana@chronosgraph.io",
    role: "admin",
    workspaceIds: ["ws-hr", "ws-legal", "ws-medical"],
    createdAt: "2025-11-02T09:00:00Z",
  },
  {
    id: "u-2",
    name: "Marco Feld",
    email: "marco@chronosgraph.io",
    role: "steward",
    workspaceIds: ["ws-hr", "ws-legal"],
    createdAt: "2026-01-14T09:00:00Z",
  },
  {
    id: "u-3",
    name: "Priya Nair",
    email: "priya@chronosgraph.io",
    role: "analyst",
    workspaceIds: ["ws-hr"],
    createdAt: "2026-03-22T09:00:00Z",
  },
  {
    id: "u-4",
    name: "Tom Reyes",
    email: "tom@chronosgraph.io",
    role: "pending",
    workspaceIds: [],
    createdAt: "2026-08-25T09:00:00Z",
  },
];

export const entities: Entity[] = [
  {
    id: "ent-sick-leave",
    workspaceId: "ws-hr",
    name: "Sick Leave Policy",
    type: "policy",
    facts: [
      {
        id: "f-sl-2022",
        entityId: "ent-sick-leave",
        statement: "Annual paid sick leave entitlement",
        value: "10 days per calendar year",
        documentId: "doc-handbook-2022",
        documentName: "Employee_Handbook_2022.pdf",
        snippet:
          "Full-time employees accrue ten (10) paid sick days per calendar year, effective 1 January 2022.",
        validFrom: "2022-01-01",
        validTo: "2024-12-31",
        extractedAt: "2026-02-11T12:22:00Z",
        state: "superseded",
      },
      {
        id: "f-sl-2025",
        entityId: "ent-sick-leave",
        statement: "Annual paid sick leave entitlement",
        value: "15 days per calendar year",
        documentId: "doc-handbook-2025",
        documentName: "Employee_Handbook_2025.pdf",
        snippet:
          "Effective 1 January 2025, the annual paid sick leave entitlement increases to fifteen (15) days.",
        validFrom: "2025-01-01",
        validTo: null,
        extractedAt: "2026-08-24T09:41:00Z",
        state: "valid",
      },
      {
        id: "f-sl-addendum",
        entityId: "ent-sick-leave",
        statement: "Annual paid sick leave entitlement",
        value: "12 days per calendar year",
        documentId: "doc-benefits-addendum",
        documentName: "Benefits_Addendum_Q1_2025.docx",
        snippet:
          "Sick leave remains capped at twelve (12) days for staff on the legacy benefits schedule.",
        validFrom: "2025-01-01",
        validTo: null,
        extractedAt: "2026-08-24T09:44:00Z",
        state: "under_review",
      },
    ],
  },
  {
    id: "ent-notice-period",
    workspaceId: "ws-hr",
    name: "Notice Period",
    type: "policy",
    facts: [
      {
        id: "f-np-2023",
        entityId: "ent-notice-period",
        statement: "Standard resignation notice period",
        value: "30 days",
        documentId: "doc-handbook-2022",
        documentName: "Employee_Handbook_2022.pdf",
        snippet: "Employees shall give thirty (30) days written notice of resignation.",
        validFrom: "2022-01-01",
        validTo: "2025-06-30",
        extractedAt: "2026-02-11T12:25:00Z",
        state: "superseded",
      },
      {
        id: "f-np-2025",
        entityId: "ent-notice-period",
        statement: "Standard resignation notice period",
        value: "60 days",
        documentId: "doc-handbook-2025",
        documentName: "Employee_Handbook_2025.pdf",
        snippet: "From 1 July 2025 the standard notice period is sixty (60) days.",
        validFrom: "2025-07-01",
        validTo: null,
        extractedAt: "2026-08-24T09:47:00Z",
        state: "valid",
      },
    ],
  },
  {
    id: "ent-renewal-term",
    workspaceId: "ws-legal",
    name: "Auto-Renewal Term (Acme MSA)",
    type: "clause",
    facts: [
      {
        id: "f-rt-orig",
        entityId: "ent-renewal-term",
        statement: "Auto-renewal term",
        value: "12 months",
        documentId: "doc-acme-msa",
        documentName: "Acme_MSA_2023.pdf",
        snippet: "This Agreement renews automatically for successive twelve (12) month terms.",
        validFrom: "2023-04-01",
        validTo: null,
        extractedAt: "2026-05-02T10:00:00Z",
        state: "under_review",
      },
      {
        id: "f-rt-amend",
        entityId: "ent-renewal-term",
        statement: "Auto-renewal term",
        value: "24 months",
        documentId: "doc-acme-amend-2",
        documentName: "Acme_Amendment_2_2026.pdf",
        snippet: "Section 4.2 is amended so that renewal terms shall be twenty-four (24) months.",
        validFrom: "2026-01-15",
        validTo: null,
        extractedAt: "2026-08-26T16:38:00Z",
        state: "valid",
      },
    ],
  },
];

export const conflicts: Conflict[] = [
  {
    id: "cf-1",
    workspaceId: "ws-hr",
    entityId: "ent-sick-leave",
    entityName: "Sick Leave Policy",
    factAId: "f-sl-2025",
    factBId: "f-sl-addendum",
    detectedAt: "2026-08-24T09:45:00Z",
    suggestion:
      "Treat the 2025 Handbook (15 days) as current for all staff; the addendum's 12-day cap appears scoped to a legacy cohort and should be modelled as a narrower sub-population, not a contradiction.",
    confidence: 0.58,
    status: "needs_review",
  },
  {
    id: "cf-2",
    workspaceId: "ws-hr",
    entityId: "ent-notice-period",
    entityName: "Notice Period",
    factAId: "f-np-2025",
    factBId: "f-np-2023",
    detectedAt: "2026-08-24T09:48:00Z",
    suggestion:
      "The 2025 Handbook explicitly supersedes the 2022 clause from 1 July 2025. Close the earlier fact's validity window at 2025-06-30.",
    confidence: 0.94,
    status: "auto_resolved",
    resolvedBy: "system",
  },
  {
    id: "cf-3",
    workspaceId: "ws-hr",
    entityId: "ent-sick-leave",
    entityName: "Sick Leave Policy",
    factAId: "f-sl-2022",
    factBId: "f-sl-2025",
    detectedAt: "2026-08-24T09:42:00Z",
    suggestion:
      "Sequential versions of the same policy. Close the 2022 window at 2024-12-31; no live contradiction remains.",
    confidence: 0.91,
    status: "auto_resolved",
    resolvedBy: "system",
  },
  {
    id: "cf-4",
    workspaceId: "ws-legal",
    entityId: "ent-renewal-term",
    entityName: "Auto-Renewal Term (Acme MSA)",
    factAId: "f-rt-amend",
    factBId: "f-rt-orig",
    detectedAt: "2026-08-26T16:39:00Z",
    suggestion:
      "Amendment 2 modifies Section 4.2 but does not state an effective date for in-flight renewals. Human review recommended before superseding the original term.",
    confidence: 0.41,
    status: "needs_review",
  },
  {
    id: "cf-5",
    workspaceId: "ws-legal",
    entityId: "ent-renewal-term",
    entityName: "Auto-Renewal Term (Acme MSA)",
    factAId: "f-rt-orig",
    factBId: "f-rt-amend",
    detectedAt: "2026-07-12T11:02:00Z",
    suggestion:
      "Notice-to-terminate window referenced in two places (60 vs 90 days). Escalated to Legal Ops for a source-of-truth decision.",
    confidence: 0.35,
    status: "escalated",
    resolvedBy: "Marco Feld",
  },
];

export const documents: IngestedDocument[] = [
  {
    id: "d-1",
    workspaceId: "ws-hr",
    filename: "Employee_Handbook_2025.pdf",
    kind: "pdf",
    status: "complete",
    uploadedAt: "2026-08-24T09:40:00Z",
    newFacts: 3,
    updatedFacts: 2,
    auditedNodes: 15,
  },
  {
    id: "d-2",
    workspaceId: "ws-hr",
    filename: "Benefits_Addendum_Q1_2025.docx",
    kind: "docx",
    status: "auditing",
    uploadedAt: "2026-08-26T08:15:00Z",
    newFacts: 1,
    updatedFacts: 1,
    auditedNodes: 8,
  },
  {
    id: "d-3",
    workspaceId: "ws-hr",
    filename: "Leave_Accrual_Table.xlsx",
    kind: "xlsx",
    status: "resolving",
    uploadedAt: "2026-08-26T08:22:00Z",
    newFacts: 6,
    updatedFacts: 0,
    auditedNodes: 4,
  },
  {
    id: "d-4",
    workspaceId: "ws-hr",
    filename: "Scanned_Policy_Notice.png",
    kind: "image",
    status: "failed",
    uploadedAt: "2026-08-25T14:02:00Z",
    newFacts: 0,
    updatedFacts: 0,
    auditedNodes: 0,
    errorReason: "OCR confidence below threshold (0.42) — page 2 is skewed and partially cropped.",
  },
  {
    id: "d-5",
    workspaceId: "ws-legal",
    filename: "Acme_Amendment_2_2026.pdf",
    kind: "pdf",
    status: "complete",
    uploadedAt: "2026-08-26T16:30:00Z",
    newFacts: 2,
    updatedFacts: 1,
    auditedNodes: 22,
  },
  {
    id: "d-6",
    workspaceId: "ws-legal",
    filename: "Vendor_Renewals_Q3.xlsx",
    kind: "xlsx",
    status: "queued",
    uploadedAt: "2026-08-27T03:58:00Z",
    newFacts: 0,
    updatedFacts: 0,
    auditedNodes: 0,
  },
];

export const auditEntries: AuditEntry[] = [
  {
    id: "a-1",
    workspaceId: "ws-hr",
    timestamp: "2026-08-24T09:48:00Z",
    entityName: "Notice Period",
    summary: "30 days (Handbook 2022) vs 60 days (Handbook 2025)",
    resolution: "auto",
    resolvedBy: "system",
    status: "resolved",
  },
  {
    id: "a-2",
    workspaceId: "ws-hr",
    timestamp: "2026-08-24T09:45:00Z",
    entityName: "Sick Leave Policy",
    summary: "15 days (Handbook 2025) vs 12 days (Benefits Addendum)",
    resolution: "human",
    resolvedBy: "Marco Feld",
    status: "pending",
  },
  {
    id: "a-3",
    workspaceId: "ws-hr",
    timestamp: "2026-08-24T09:42:00Z",
    entityName: "Sick Leave Policy",
    summary: "10 days (Handbook 2022) superseded by 15 days (Handbook 2025)",
    resolution: "auto",
    resolvedBy: "system",
    status: "resolved",
  },
  {
    id: "a-4",
    workspaceId: "ws-legal",
    timestamp: "2026-08-26T16:39:00Z",
    entityName: "Auto-Renewal Term (Acme MSA)",
    summary: "12-month vs 24-month renewal term after Amendment 2",
    resolution: "human",
    resolvedBy: "Keerthana S",
    status: "pending",
  },
  {
    id: "a-5",
    workspaceId: "ws-legal",
    timestamp: "2026-07-12T11:02:00Z",
    entityName: "Auto-Renewal Term (Acme MSA)",
    summary: "Notice-to-terminate window 60 vs 90 days",
    resolution: "human",
    resolvedBy: "Marco Feld",
    status: "escalated",
  },
];

export const chats: Chat[] = [
  {
    id: "chat-sick-leave",
    workspaceId: "ws-hr",
    title: "Sick leave entitlement",
    updatedAt: "2026-08-26T09:10:00Z",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "What's our current sick leave policy?",
        createdAt: "2026-08-26T09:09:00Z",
      },
      {
        id: "m-2",
        role: "assistant",
        createdAt: "2026-08-26T09:10:00Z",
        content:
          "Current best evidence: full-time employees receive 15 paid sick days per calendar year, effective 1 January 2025 [1]. This replaced the earlier 10-day entitlement that applied from 2022 through the end of 2024 [2].\n\nOne caveat: a Q1 2025 benefits addendum states a 12-day cap for staff on the legacy benefits schedule [3], which has not yet been reconciled with the handbook.",
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
      },
    ],
  },
  {
    id: "chat-compliance",
    workspaceId: "ws-hr",
    title: "Compliance deadlines",
    updatedAt: "2026-08-21T13:00:00Z",
    messages: [],
  },
  {
    id: "chat-renewals",
    workspaceId: "ws-legal",
    title: "Contract renewals",
    updatedAt: "2026-08-26T17:00:00Z",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "How long is the Acme auto-renewal term?",
        createdAt: "2026-08-26T16:58:00Z",
      },
      {
        id: "m-4",
        role: "assistant",
        createdAt: "2026-08-26T17:00:00Z",
        content:
          "Current best evidence: renewal terms are 24 months following Amendment 2, executed 15 January 2026 [1]. The original 2023 MSA specified 12-month renewals [2] and no effective date was given for in-flight renewals, so this is not settled.",
        citations: [
          {
            index: 1,
            documentId: "doc-acme-amend-2",
            documentName: "Acme_Amendment_2_2026.pdf",
            snippet:
              "Section 4.2 is amended so that renewal terms shall be twenty-four (24) months.",
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
      },
    ],
  },
  {
    id: "chat-protocols",
    workspaceId: "ws-medical",
    title: "Dosage protocol history",
    updatedAt: "2026-08-19T11:00:00Z",
    messages: [],
  },
];

export const promptSuggestions = [
  "What's our current sick leave policy?",
  "Which clauses changed in the last 12 months?",
  "Show me facts with unresolved contradictions",
  "Summarise the notice period history for this workspace",
];

export function graphFor(conflictId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const conflict = conflicts.find((c) => c.id === conflictId);
  const entity = entities.find((e) => e.id === conflict?.entityId);
  if (!conflict || !entity) return { nodes: [], edges: [] };

  const positions = [
    { x: 22, y: 26 },
    { x: 78, y: 26 },
    { x: 50, y: 78 },
    { x: 16, y: 74 },
  ];

  const nodes: GraphNode[] = [
    { id: entity.id, label: entity.name, kind: "entity", state: "valid", x: 50, y: 14 },
    ...entity.facts.map((f, i) => ({
      id: f.id,
      label: f.value,
      kind: "fact" as const,
      state: f.state,
      validFrom: f.validFrom,
      validTo: f.validTo,
      x: positions[i % positions.length].x,
      y: positions[i % positions.length].y,
    })),
  ];

  const edges: GraphEdge[] = entity.facts.map((f) => ({
    source: entity.id,
    target: f.id,
    kind: "asserts" as const,
  }));
  edges.push({ source: conflict.factAId, target: conflict.factBId, kind: "contradicts" });

  return { nodes, edges };
}
