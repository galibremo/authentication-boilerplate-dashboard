import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createApiKeys, deleteApiKeys, updateApiKeys } from "./api-keys.actions";
import { apiKeys } from "@/features/api-keys/actions/api-keys.keys";

export function useCreateApiKeysMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, mutate, error, isSuccess, isError, isPending } = useMutation({
		mutationFn: createApiKeys,
		onSettled: (_, error) => {
			if (error) {
				console.error("Unknown error:", error);
				toast.error("Failed to Create API Key!");
			} else {
				queryClient.invalidateQueries({ queryKey: apiKeys.all });
				toast.success("API Key Created successfully!");
			}
		}
	});
	return {
		createApiKeys: mutate,
		createApiKeysAsynchronously: mutateAsync,
		isCreateApiKeysLoading: isPending,
		createApiKeysError: error,
		isCreateApiKeysError: isError,
		isCreateApiKeysSuccess: isSuccess
	};
}

export function useUpdateApiKeysMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, mutate, error, isSuccess, isError, isPending } = useMutation({
		mutationFn: updateApiKeys,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.all });
		}
	});
	return {
		updateApiKeys: mutate,
		updateApiKeysAsynchronously: mutateAsync,
		isUpdateApiKeysLoading: isPending,
		updateApiKeysError: error,
		isUpdateApiKeysError: isError,
		isUpdateApiKeysSuccess: isSuccess
	};
}

export function useDeleteApiKeysMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, mutate, error, isSuccess, isError, isPending } = useMutation({
		mutationFn: deleteApiKeys,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.all });
		}
	});
	return {
		deleteApiKeys: mutate,
		deleteApiKeysAsynchronously: mutateAsync,
		isDeleteApiKeysLoading: isPending,
		deleteApiKeysError: error,
		isDeleteApiKeysError: isError,
		isDeleteApiKeysSuccess: isSuccess
	};
}

