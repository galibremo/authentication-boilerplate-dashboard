import { uploadKnowledgeBase } from "@/features/knowledge-base/actions/knowledge-base.actions";
import { knowledgeBaseKeys } from "@/features/knowledge-base/actions/knowledge-base.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadKnowledgeBaseMutation() {
	const queryClient = useQueryClient();
	const { mutateAsync, mutate, error, isSuccess, isError, isPending } = useMutation({
		mutationFn: uploadKnowledgeBase,
		onSettled: (_, error) => {
			if (error) {
				console.error("Unknown error:", error);
				toast.error("Failed to Create Knowledge Base!");
			} else {
				queryClient.invalidateQueries({ queryKey: knowledgeBaseKeys.all });
				toast.success("Knowledge Base Added successfully!");
			}
		}
	});
	return {
		uploadKnowledgeBase: mutate,
		uploadKnowledgeBaseAsynchronously: mutateAsync,
		isUploadKnowledgeBaseLoading: isPending,
		uploadKnowledgeBaseError: error,
		isUploadKnowledgeBaseError: isError,
		isUploadKnowledgeBaseSuccess: isSuccess
	};
}
