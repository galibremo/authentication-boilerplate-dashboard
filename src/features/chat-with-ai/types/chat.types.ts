export type ChatMessage = {
	id: number;
	sessionId: string;
	message: {
		type: "human" | "ai";
		content: string;
	};
};

export type SendMessageResponse = {
	text: string;
};
