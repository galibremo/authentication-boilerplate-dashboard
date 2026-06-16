import { apiClient } from "@/lib/api/client";

import {
	DeleteKnowledgeBaseFileInput,
	DeleteKnowledgeBaseFileResponse,
	KnowledgeBaseFileListQuery,
	KnowledgeBaseFileListResponse,
	KnowledgeBaseUploadResponse,
	KnowledgeBaseResponse,
	UpdateKnowledgeBaseMessagePayload
} from "@/features/knowledge-base/types/knowledge-base.types";
import { createKnowledgeBaseFileListQuery } from "@/features/knowledge-base/schemas/knowledge-base-files.schema";
import { apiRoute } from "@/routes/routes";

export async function getKnowledgeBaseMessage(): Promise<KnowledgeBaseResponse> {
	return apiClient<KnowledgeBaseResponse>({
		method: "GET",
		url: apiRoute.knowledgeBaseMessages
	});
}

export async function updateKnowledgeBaseMessage(
	body: UpdateKnowledgeBaseMessagePayload
): Promise<ApiResponse<KnowledgeBaseResponse>> {
	return apiClient<ApiResponse<KnowledgeBaseResponse>>({
		method: "PATCH",
		url: apiRoute.knowledgeBaseMessages,
		data: body
	});
}

export async function listKnowledgeBaseFiles(
	filters: KnowledgeBaseFileListQuery
): Promise<KnowledgeBaseFileListResponse> {
	return apiClient<KnowledgeBaseFileListResponse>({
		method: "GET",
		url: apiRoute.knowledgeBaseFiles,
		params: createKnowledgeBaseFileListQuery(filters)
	});
}

export async function deleteKnowledgeBaseFile({
	id
}: DeleteKnowledgeBaseFileInput): Promise<DeleteKnowledgeBaseFileResponse> {
	const deleted = await apiClient<boolean>({
		method: "DELETE",
		url: apiRoute.knowledgeBaseFile(id)
	});

	return { deleted };
}

export async function uploadKnowledgeBaseFile(file: File): Promise<KnowledgeBaseUploadResponse> {
	const formData = new FormData();
	formData.append("data", file);

	return apiClient<KnowledgeBaseUploadResponse>({
		method: "POST",
		url: apiRoute.knowledgeBaseUpload,
		data: formData
	});
}

export async function uploadKnowledgeBaseFiles(
	files: File[]
): Promise<KnowledgeBaseUploadResponse[]> {
	const responses: KnowledgeBaseUploadResponse[] = [];
	for (const file of files) {
		responses.push(await uploadKnowledgeBaseFile(file));
	}
	return responses;
}
