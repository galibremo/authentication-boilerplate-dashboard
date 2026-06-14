import { Metadata } from "next";

import ChatWithAIPage from "@/features/chat-wit-ai/components/chat-with-ai-page";

export const metadata: Metadata = {
	title: "Chat With AI",
	description: "Interact with the AI assistant."
};

export default function ChatWithAI() {
	return <ChatWithAIPage />;
}

