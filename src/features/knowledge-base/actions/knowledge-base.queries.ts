import { useQuery } from "@tanstack/react-query";

import {
	getKnowledgeBaseMessage,
	listKnowledgeBaseFiles
} from "@/features/knowledge-base/actions/knowledge-base.actions";
import { knowledgeBaseKeys } from "@/features/knowledge-base/actions/knowledge-base.keys";
import type { KnowledgeBaseFileListQuery } from "@/features/knowledge-base/types/knowledge-base.types";

export function useKnowledgeBaseMessageQuery(enabled = true) {
	return useQuery({
		queryKey: knowledgeBaseKeys.details(),
		queryFn: getKnowledgeBaseMessage,
		enabled
	});
}

export function useKnowledgeBaseFilesQuery(filters: KnowledgeBaseFileListQuery) {
	return useQuery({
		queryKey: knowledgeBaseKeys.fileList(filters),
		queryFn: () => listKnowledgeBaseFiles(filters)
	});
}
