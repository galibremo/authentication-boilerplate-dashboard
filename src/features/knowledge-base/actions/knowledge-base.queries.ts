import { useQuery } from "@tanstack/react-query";

import { getKnowledgeBaseMessage } from "@/features/knowledge-base/actions/knowledge-base.actions";
import { knowledgeBaseKeys } from "@/features/knowledge-base/actions/knowledge-base.keys";

export function useKnowledgeBaseMessageQuery(enabled = true) {
	return useQuery({
		queryKey: knowledgeBaseKeys.details(),
		queryFn: getKnowledgeBaseMessage,
		enabled
	});
}

