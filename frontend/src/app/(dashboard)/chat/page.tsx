import { ChatView } from "@/components/chat/chat-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - DocuMind",
  description: "Chat with your uploaded documents using DocuMind AI",
};

export default function ChatPage() {
  return (
    <div className="w-full h-full">
      <ChatView />
    </div>
  );
}
