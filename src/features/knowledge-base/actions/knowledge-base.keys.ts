import type { KnowledgeBaseFileListQuery } from "@/features/knowledge-base/types/knowledge-base.types";

export const knowledgeBaseKeys = {
	all: ["knowledge-base"] as const,
	lists: () => [...knowledgeBaseKeys.all, "list"] as const,
	files: () => [...knowledgeBaseKeys.all, "files"] as const,
	fileList: (filters: KnowledgeBaseFileListQuery) =>
		[...knowledgeBaseKeys.files(), filters] as const,
	details: () => [...knowledgeBaseKeys.all, "detail"] as const,
	detail: (id: string) => [...knowledgeBaseKeys.details(), id] as const
};
