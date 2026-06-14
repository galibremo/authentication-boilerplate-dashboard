"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { UseApiKeysActionsReturn } from "@/features/api-keys/hooks/use-api-keys-actions";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";

interface ApiKeysDeleteDialogProps {
	apiKey: ApiKeys;
	actions: UseApiKeysActionsReturn;
}

export function ApiKeysDeleteDialog({ apiKey, actions }: ApiKeysDeleteDialogProps) {
	return (
		<AlertDialog open={actions.deleteDialogOpen} onOpenChange={actions.setDeleteDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={Delete02Icon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete api key?</AlertDialogTitle>
					<AlertDialogDescription>
						This permanently deletes {apiKey.name}, including linked sessions and login accounts.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={actions.handleDeleteApiKeys}
						disabled={actions.isDeleteApiKeysLoading}
					>
						{actions.isDeleteApiKeysLoading ? "Deleting" : "Delete api key"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

