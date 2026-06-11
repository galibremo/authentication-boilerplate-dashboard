import type { UserListQuery } from "@/features/users/types/users.types";

export const apiKeys = {
	all: ["api-keys"] as const,
	lists: () => [...apiKeys.all, "list"] as const,
	list: (filters: UserListQuery) => [...apiKeys.lists(), filters] as const,
	details: () => [...apiKeys.all, "detail"] as const,
	detail: (id: string) => [...apiKeys.details(), id] as const
};
