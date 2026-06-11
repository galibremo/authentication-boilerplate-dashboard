import { useQuery } from "@tanstack/react-query";

import { ApiKeysListQuery } from "@/features/api-keys/types/api-keys.types";
import { apiKeysList, getApiKey } from "./api-keys.actions";
import { apiKeys } from "./users.keys";

export function useApiKeysQuery(filters: ApiKeysListQuery) {
	return useQuery({
		queryKey: apiKeys.list(filters),
		queryFn: () => apiKeysList(filters)
	});
}

export function useApiKeyQuery(id: string, enabled = true) {
	return useQuery({
		queryKey: apiKeys.detail(id),
		queryFn: () => getApiKey(id),
		enabled: Boolean(id) && enabled,
		refetchOnMount: "always"
	});
}
