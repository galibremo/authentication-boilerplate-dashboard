import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	updateKnowledgeBaseMessage,
	uploadKnowledgeBaseFile,
	uploadKnowledgeBaseFiles
} from "@/features/knowledge-base/actions/knowledge-base.actions";
import { knowledgeBaseKeys } from "@/features/knowledge-base/actions/knowledge-base.keys";

export function useKnowledgeBaseMutation() {
	const queryClient = useQueryClient();

	const { mutate, mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: updateKnowledgeBaseMessage,
		onSettled: (_, error) => {
			if (error) {
				toast.error("Failed to update knowledge base message");
			} else {
				queryClient.invalidateQueries({ queryKey: knowledgeBaseKeys.all });
				toast.success("Knowledge base message updated successfully");
			}
		}
	});
	return {
		knowledgeBaseMutate: mutate,
		knowledgeBaseMutateAsync: mutateAsync,
		isKnowledgeBaseMessageLoading: isPending,
		isKnowledgeBaseMessageError: isError,
		KnowledgeBaseMessageError: error
	};
}

export function useKnowledgeBaseUploadMutation() {
	const queryClient = useQueryClient();

	const { mutate, mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: uploadKnowledgeBaseFiles,
		onSettled: (_, error) => {
			if (error) {
				toast.error((error as Error).message || "Failed to upload files to knowledge base");
			} else {
				queryClient.invalidateQueries({ queryKey: knowledgeBaseKeys.all });
				toast.success("Files successfully upserted into ChromaDB");
			}
		}
	});

	return {
		uploadMutate: mutate,
		uploadMutateAsync: mutateAsync,
		isUploadPending: isPending,
		isUploadError: isError,
		uploadError: error
	};
}

