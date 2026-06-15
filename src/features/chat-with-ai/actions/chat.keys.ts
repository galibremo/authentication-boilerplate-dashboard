export const chatKeys = {
	all: ["chat"] as const,
	history: (sessionId: string) => [...chatKeys.all, "history", sessionId] as const
};
