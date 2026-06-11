import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiKeys } from "@/features/api-keys/actions/users.keys";
import { createApiKeys, deleteApiKeys, updateApiKeys } from "./api-keys.actions";

export function useCreateApiKeysMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createApiKeys,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.all });
		}
	});
}

export function useUpdateApiKeysMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateApiKeys,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.all });
		}
	});
}

export function useDeleteUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteApiKeys,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.all });
		}
	});
}
