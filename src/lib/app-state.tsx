import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as mock from "./mock-data";
import type { Chat, ChatMessage, Conflict, Role, User, Workspace } from "./types";

const STORAGE_KEY = "chronosgraph.session.v1";

interface Session {
  user: User | null;
  lastWorkspaceId: string | null;
}

interface AppState {
  hydrated: boolean;
  user: User | null;
  role: Role;
  login: (email: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (patch: Partial<User>) => void;
  lastWorkspaceId: string | null;
  setLastWorkspaceId: (id: string) => void;
  workspaces: Workspace[];
  createWorkspace: (name: string) => Workspace;
  archiveWorkspace: (id: string) => void;
  chats: Chat[];
  createChat: (workspaceId: string) => Chat;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  archiveChat: (id: string) => void;
  appendMessages: (chatId: string, messages: ChatMessage[]) => void;
  conflicts: Conflict[];
  setConflictStatus: (id: string, status: Conflict["status"], by: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastWorkspaceId, setLastWs] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mock.workspaces);
  const [chats, setChats] = useState<Chat[]>(mock.chats);
  const [conflicts, setConflicts] = useState<Conflict[]>(mock.conflicts);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        setUser(parsed.user ?? null);
        setLastWs(parsed.lastWorkspaceId ?? null);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Session) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const login: AppState["login"] = useCallback(
    (email) => {
      const found =
        mock.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
      const account = found ?? (mock.users[0] as User);
      if (!found && !email.includes("@")) return { ok: false, error: "Enter a valid email address." };
      setUser(account);
      persist({ user: account, lastWorkspaceId });
      return { ok: true };
    },
    [lastWorkspaceId, persist],
  );

  const signup: AppState["signup"] = useCallback(
    (name, email) => {
      const account: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        role: "pending",
        workspaceIds: [],
        createdAt: new Date().toISOString(),
      };
      setUser(account);
      persist({ user: account, lastWorkspaceId: null });
    },
    [persist],
  );

  const logout = useCallback(() => {
    setUser(null);
    persist({ user: null, lastWorkspaceId: null });
  }, [persist]);

  const setRole = useCallback(
    (role: Role) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          role,
          workspaceIds: role === "pending" ? [] : mock.workspaces.map((w) => w.id),
        };
        persist({ user: next, lastWorkspaceId });
        return next;
      });
    },
    [lastWorkspaceId, persist],
  );

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        persist({ user: next, lastWorkspaceId });
        return next;
      });
    },
    [lastWorkspaceId, persist],
  );

  const setLastWorkspaceId = useCallback(
    (id: string) => {
      setLastWs(id);
      persist({ user, lastWorkspaceId: id });
    },
    [persist, user],
  );

  const createWorkspace = useCallback((name: string) => {
    const ws: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      description: "New workspace — no documents ingested yet.",
      documentCount: 0,
      unresolvedConflicts: 0,
      updatedAt: new Date().toISOString(),
    };
    setWorkspaces((prev) => [...prev, ws]);
    return ws;
  }, []);

  const archiveWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, archived: !w.archived } : w)));
  }, []);

  const createChat = useCallback((workspaceId: string) => {
    const chat: Chat = {
      id: `chat-${Date.now()}`,
      workspaceId,
      title: "New chat",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setChats((prev) => [chat, ...prev]);
    return chat;
  }, []);

  const renameChat = useCallback((id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const archiveChat = useCallback((id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)));
  }, []);

  const appendMessages = useCallback((chatId: string, messages: ChatMessage[]) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title:
                c.messages.length === 0 && messages[0]?.role === "user"
                  ? messages[0].content.slice(0, 40)
                  : c.title,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, ...messages],
            }
          : c,
      ),
    );
  }, []);

  const setConflictStatus = useCallback(
    (id: string, status: Conflict["status"], by: string) => {
      setConflicts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status, resolvedBy: by } : c)),
      );
    },
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      user,
      role: user?.role ?? "pending",
      login,
      signup,
      logout,
      setRole,
      updateUser,
      lastWorkspaceId,
      setLastWorkspaceId,
      workspaces,
      createWorkspace,
      archiveWorkspace,
      chats,
      createChat,
      renameChat,
      deleteChat,
      archiveChat,
      appendMessages,
      conflicts,
      setConflictStatus,
    }),
    [
      hydrated,
      user,
      login,
      signup,
      logout,
      setRole,
      updateUser,
      lastWorkspaceId,
      setLastWorkspaceId,
      workspaces,
      createWorkspace,
      archiveWorkspace,
      chats,
      createChat,
      renameChat,
      deleteChat,
      archiveChat,
      appendMessages,
      conflicts,
      setConflictStatus,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}

export const roleLabel: Record<Role, string> = {
  analyst: "Analyst",
  steward: "Steward",
  admin: "Admin",
  pending: "Pending access",
};

export function canSteward(role: Role) {
  return role === "steward" || role === "admin";
}
export function canAdmin(role: Role) {
  return role === "admin";
}
