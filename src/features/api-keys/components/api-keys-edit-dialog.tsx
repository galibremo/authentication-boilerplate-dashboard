"use client";

import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import { ApiKeysFormFields } from "@/features/api-keys/components/api-keys-form-fields";
import { UseApiKeysActionsReturn } from "@/features/api-keys/hooks/use-api-keys-actions";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";

interface ApiKeysEditDialogProps {
	apiKey: ApiKeys;
	actions: UseApiKeysActionsReturn;
}

export function ApiKeysEditDialog({ apiKey, actions }: ApiKeysEditDialogProps) {
	return (
		<Dialog open={actions.editDialogOpen} onOpenChange={actions.setEditDialogOpen}>
			<DialogContent className="sm:max-w-2xl">
				<FormProvider {...actions.editForm}>
					<form
						onSubmit={actions.editForm.handleSubmit(actions.handleUpdateApiKeys)}
						className="grid gap-6"
					>
						<DialogHeader>
							<DialogTitle>Edit API Key</DialogTitle>
							<DialogDescription>{apiKey.name}</DialogDescription>
						</DialogHeader>
						<ApiKeysFormFields
							idPrefix={`edit-api-key-${apiKey.id}`}
							disabled={actions.isUpdateApiKeysLoading}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={actions.isUpdateApiKeysLoading}>
								{actions.isUpdateApiKeysLoading ? "Saving" : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

