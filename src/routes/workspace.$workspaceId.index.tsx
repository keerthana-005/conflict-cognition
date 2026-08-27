import { createFileRoute } from "@tanstack/react-router";
import { ChatView } from "@/components/chat-view";

export const Route = createFileRoute("/workspace/$workspaceId/")({
  head: () => ({
    meta: [
      { title: "Chat — ChronosGraph workspace" },
      {
        name: "description",
        content: "Query your document graph and see cited, time-scoped evidence for every answer.",
      },
      { property: "og:title", content: "Chat — ChronosGraph workspace" },
      {
        property: "og:description",
        content: "Query your document graph and see cited, time-scoped evidence for every answer.",
      },
    ],
  }),
  component: WorkspaceChatIndex,
});

function WorkspaceChatIndex() {
  const { workspaceId } = Route.useParams();
  return <ChatView workspaceId={workspaceId} chat={null} />;
}
