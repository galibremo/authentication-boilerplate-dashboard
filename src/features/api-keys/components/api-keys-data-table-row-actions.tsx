"use client";

import {
	Delete02Icon,
	EyeIcon,
	MoreVerticalIcon,
	UserEdit01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { ApiKeysDeleteDialog } from "@/features/api-keys/components/api-keys-delete-dialog";
import { ApiKeysDetailsDialog } from "@/features/api-keys/components/api-keys-details-dialog";
import { ApiKeysEditDialog } from "@/features/api-keys/components/api-keys-edit-dialog";
import { useApiKeysActions } from "@/features/api-keys/hooks/use-api-keys-actions";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";

interface ApiKeysDataTableRowActionsProps {
	apiKey: ApiKeys;
}

export function ApiKeysDataTableRowActions({ apiKey }: ApiKeysDataTableRowActionsProps) {
	const actions = useApiKeysActions(apiKey);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open actions for ${apiKey.name}`}
					>
						<HugeiconsIcon icon={MoreVerticalIcon} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onSelect={event => {
							event.preventDefault();
							actions.setDetailsDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={EyeIcon} />
						View details
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={!actions.isUpdateApiKeysLoading}
						onSelect={event => {
							event.preventDefault();
							actions.resetEditForm();
							actions.setEditDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Edit Api Key
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={!actions.isDeleteApiKeysLoading}
						onSelect={event => {
							event.preventDefault();
							actions.setDeleteDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={Delete02Icon} />
						Delete Api Key
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ApiKeysDetailsDialog
				apiKey={apiKey}
				open={actions.detailsDialogOpen}
				onOpenChange={actions.setDetailsDialogOpen}
			/>

			<ApiKeysEditDialog apiKey={apiKey} actions={actions} />
			<ApiKeysDeleteDialog apiKey={apiKey} actions={actions} />
		</>
	);
}

