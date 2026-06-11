import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import {
	ApiKeys,
	ApiKeysListQuery,
	ApiKeysListResponse,
	CreateApiKeys,
	UpdateApiKeys
} from "@/features/api-keys/types/api-keys.types";
import { createUserListQuery } from "@/features/users/schemas/users-api.schema";
import type { DeleteUserInput, DeleteUserResponse } from "@/features/users/types/users.types";

export async function apiKeysList(filters: ApiKeysListQuery): Promise<ApiKeysListResponse> {
	return apiClient<ApiKeysListResponse>({
		method: "GET",
		url: apiRoute.apiKeys,
		params: createUserListQuery(filters)
	});
}

export async function getApiKey(id: string): Promise<ApiKeys> {
	return apiClient<ApiKeys>({
		method: "GET",
		url: apiRoute.apiKey(id)
	});
}

export async function createApiKeys(data: CreateApiKeys): Promise<ApiKeys> {
	return apiClient<ApiKeys>({
		method: "POST",
		url: apiRoute.apiKeys,
		data
	});
}

export async function updateApiKeys({ id, ...data }: UpdateApiKeys): Promise<ApiKeys> {
	return apiClient<ApiKeys>({
		method: "PATCH",
		url: apiRoute.apiKey(id),
		data
	});
}

export async function deleteApiKeys({ id }: DeleteUserInput): Promise<DeleteUserResponse> {
	return apiClient<DeleteUserResponse>({
		method: "DELETE",
		url: apiRoute.apiKey(id)
	});
}
