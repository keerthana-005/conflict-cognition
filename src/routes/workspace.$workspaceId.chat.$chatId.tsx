import { createFileRoute } from "@tanstack/react-router";
import { ChatView } from "@/components/chat-view";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/workspace/$workspaceId/chat/$chatId")({
  head: () => ({
    meta: [
      { title: "Chat thread — ChronosGraph" },
      {
        name: "description",
        content: "A saved conversation with cited evidence and temporal conflict warnings.",
      },
      { property: "og:title", content: "Chat thread — ChronosGraph" },
      {
        property: "og:description",
        content: "A saved conversation with cited evidence and temporal conflict warnings.",
      },
    ],
  }),
  component: ChatThread,
});

function ChatThread() {
  const { workspaceId, chatId } = Route.useParams();
  const { chats } = useApp();
  const chat = chats.find((c) => c.id === chatId) ?? null;

  if (!chat) {
    return (
      <div className="p-10 text-sm text-muted-foreground">
        This chat no longer exists. Start a new one from the sidebar.
      </div>
    );
  }

  return <ChatView key={chat.id} workspaceId={workspaceId} chat={chat} />;
}
