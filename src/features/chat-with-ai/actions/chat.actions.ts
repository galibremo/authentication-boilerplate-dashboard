import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import type { ChatMessage, SendMessageResponse } from "../types/chat.types";

export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
	return apiClient<ChatMessage[]>({
		method: "GET",
		url: apiRoute.chatHistory,
		params: { sessionId }
	});
}

export async function sendMessage(
	sessionId: string,
	chatInput: string
): Promise<SendMessageResponse> {
	return apiClient<SendMessageResponse>({
		method: "POST",
		url: apiRoute.chat,
		data: { chatInput, sessionId }
	});
}
