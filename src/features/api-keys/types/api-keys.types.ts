export const apiKeysSortValues = ["name", "createdAt", "updatedAt"] as const;
export const apiKeysSortDirectionValues = ["asc", "desc"] as const;

export interface ApiKeys {
	id: string;
	name: string;
	keys: string;
	createdAt: string;
	updatedAt: string;
}

export type ApiKeysSort = (typeof apiKeysSortValues)[number];
export type ApiKeysSortDirection = (typeof apiKeysSortDirectionValues)[number];
export type ApiKeysListResponse = PaginatedData<ApiKeys>;

export interface ApiKeysListQuery {
	page: number;
	pageSize: number;
	search?: string;
	sort: ApiKeysSort;
	dir: ApiKeysSortDirection;
}

export interface CreateApiKeys {
	name: string;
	key: string;
}

export interface UpdateApiKeys {
	id: string;
	name: string;
	key: string;
}

export interface DeleteApiKeysInput {
	id: string;
}

export interface DeleteApiKeysResponse {
	deleted: boolean;
}
