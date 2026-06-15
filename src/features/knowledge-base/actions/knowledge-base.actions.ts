import { apiClient } from "@/lib/api/client";

import {
	KnowledgeBaseResponse,
	UpdateKnowledgeBaseMessagePayload
} from "@/features/knowledge-base/types/knowledge-base.types";
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

export async function uploadKnowledgeBaseFile(file: File): Promise<ApiResponse<void>> {
	const formData = new FormData();
	formData.append("data", file);

	return apiClient<ApiResponse<void>>({
		method: "POST",
		url: apiRoute.knowledgeBaseUpload,
		data: formData,
		headers: { "Content-Type": "multipart/form-data" }
	});
}

