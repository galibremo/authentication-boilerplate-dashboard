import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendMessage } from "./chat.actions";
import { chatKeys } from "./chat.keys";
import type { ChatMessage } from "../types/chat.types";

export function useSendMessageMutation(sessionId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (chatInput: string) => sendMessage(sessionId, chatInput),
		onMutate: async (chatInput) => {
			await queryClient.cancelQueries({ queryKey: chatKeys.history(sessionId) });

			const previousMessages = queryClient.getQueryData<ChatMessage[]>(chatKeys.history(sessionId));

			const optimisticMessage: ChatMessage = {
				id: Date.now(),
				sessionId,
				message: {
					type: "human",
					content: chatInput,
				},
			};

			queryClient.setQueryData<ChatMessage[]>(chatKeys.history(sessionId), (old) => [
				...(old ?? []),
				optimisticMessage,
			]);

			return { previousMessages };
		},
		onError: (_err, _chatInput, context) => {
			if (context?.previousMessages) {
				queryClient.setQueryData(chatKeys.history(sessionId), context.previousMessages);
			}
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: chatKeys.history(sessionId) });
		},
	});
}
