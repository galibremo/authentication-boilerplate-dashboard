"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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

import { useCreateApiKeysMutation } from "@/features/api-keys/actions/api-keys.mutations";
import { ApiKeysFormFields } from "@/features/api-keys/components/api-keys-form-fields";
import {
	CreateApiKeysFormValues,
	createApiKeysFormSchema
} from "@/features/api-keys/schemas/api-keys-form.schema";

export function CreateApiKeysDialog() {
	const { createApiKeys, isCreateApiKeysLoading } = useCreateApiKeysMutation();
	const [open, setOpen] = useState(false);

	const form = useForm<CreateApiKeysFormValues>({
		resolver: zodResolver(createApiKeysFormSchema),
		defaultValues: createInitialValues()
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			form.reset({
				name: ""
			});
		}

		setOpen(nextOpen);
	};

	const onSubmit = useCallback(
		(values: CreateApiKeysFormValues) => {
			createApiKeys({
				name: values.name
			});
			setOpen(false);
		},
		[createApiKeys]
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button
				type="button"
				onClick={() => handleOpenChange(true)}
				disabled={isCreateApiKeysLoading}
			>
				<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
				Create API Key
			</Button>
			<DialogContent className="sm:max-w-2xl">
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
						<DialogHeader>
							<DialogTitle>Create API Key</DialogTitle>
							<DialogDescription>Create a new API key for your application.</DialogDescription>
						</DialogHeader>
						<ApiKeysFormFields idPrefix="create-api-keys" disabled={isCreateApiKeysLoading} />
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isCreateApiKeysLoading}>
								{isCreateApiKeysLoading ? "Creating" : "Create API Key"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}

function createInitialValues(): CreateApiKeysFormValues {
	return {
		name: ""
	};
}

