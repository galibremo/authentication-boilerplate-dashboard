import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_N8N_WORKSPACE_ID!;

export async function uploadKnowledgeBase(data: FormData): Promise<FormData> {
	return apiClient<FormData>({
		method: "POST",
		url: apiRoute.knowledgeBase(WORKSPACE_ID),
		data
	});
}
