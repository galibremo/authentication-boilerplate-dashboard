export const knowledgeBaseKeys = {
	all: ["knowledgeBase"] as const,
	lists: () => [...knowledgeBaseKeys.all, "list"] as const,
	list: (filters: string | KeyedObject) => [...knowledgeBaseKeys.lists(), filters] as const,
	details: () => [...knowledgeBaseKeys.all, "detail"] as const,
	detail: (id: string) => [...knowledgeBaseKeys.details(), id] as const
};
