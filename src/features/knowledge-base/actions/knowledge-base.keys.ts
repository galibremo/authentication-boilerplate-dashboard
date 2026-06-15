import type { UserListQuery } from "@/features/users/types/users.types";

export const knowledgeBaseKeys = {
	all: ["knowledge-base"] as const,
	lists: () => [...knowledgeBaseKeys.all, "list"] as const,
	list: (filters: UserListQuery) => [...knowledgeBaseKeys.lists(), filters] as const,
	details: () => [...knowledgeBaseKeys.all, "detail"] as const,
	detail: (id: string) => [...knowledgeBaseKeys.details(), id] as const
};

