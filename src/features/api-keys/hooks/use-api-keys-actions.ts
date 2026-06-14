import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import {
	useDeleteApiKeysMutation,
	useUpdateApiKeysMutation
} from "@/features/api-keys/actions/api-keys.mutations";
import {
	CreateApiKeysFormValues,
	editApiKeysFormSchema
} from "@/features/api-keys/schemas/api-keys-form.schema";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";

export type UseApiKeysActionsReturn = ReturnType<typeof useApiKeysActions>;

export function useApiKeysActions(apiKeys: ApiKeys) {
	const { updateApiKeys, isUpdateApiKeysLoading } = useUpdateApiKeysMutation();
	const { deleteApiKeys, isDeleteApiKeysLoading } = useDeleteApiKeysMutation();

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const editForm = useForm<CreateApiKeysFormValues>({
		resolver: zodResolver(editApiKeysFormSchema),
		defaultValues: createEditValues(apiKeys)
	});

	const handleUpdateApiKeys = useCallback(
		(values: CreateApiKeysFormValues) => {
			updateApiKeys({
				id: apiKeys.id,
				name: values.name,
				key: values.key
			});
			setEditDialogOpen(false);
		},
		[updateApiKeys, apiKeys.id]
	);

	const handleDeleteApiKeys = useCallback(() => {
		deleteApiKeys({ id: apiKeys.id });
		setDeleteDialogOpen(false);
	}, [deleteApiKeys, apiKeys.id]);

	const resetEditForm = useCallback(() => {
		editForm.reset(createEditValues(apiKeys));
	}, [apiKeys, editForm]);

	return {
		editForm,
		isUpdateApiKeysLoading,
		isDeleteApiKeysLoading,
		editDialogOpen,
		setEditDialogOpen,
		detailsDialogOpen,
		setDetailsDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		handleUpdateApiKeys,
		handleDeleteApiKeys,
		resetEditForm
	};
}

function createEditValues(apiKeys: ApiKeys): CreateApiKeysFormValues {
	return {
		name: apiKeys.name ?? "",
		key: apiKeys.key ?? ""
	};
}

