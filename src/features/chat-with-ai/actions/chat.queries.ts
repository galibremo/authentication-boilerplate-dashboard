import { useQuery } from "@tanstack/react-query";

import { fetchChatHistory } from "./chat.actions";
import { chatKeys } from "./chat.keys";

export function useChatHistoryQuery(sessionId: string) {
	return useQuery({
		queryKey: chatKeys.history(sessionId),
		queryFn: () => fetchChatHistory(sessionId),
		enabled: !!sessionId,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
