"use client";

import { Download, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteKnowledgeBaseFileMutation } from "@/features/knowledge-base/actions/knowledge-base.mutations";
import type { KnowledgeBaseFile } from "@/features/knowledge-base/types/knowledge-base.types";

interface KnowledgeBaseFileRowActionsProps {
	file: KnowledgeBaseFile;
}

export function KnowledgeBaseFileRowActions({ file }: KnowledgeBaseFileRowActionsProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const { deleteFileAsync, isDeleteFilePending } = useDeleteKnowledgeBaseFileMutation();

	const handleDelete = async () => {
		try {
			await deleteFileAsync({ id: file.id });
			setDeleteDialogOpen(false);
		} catch {
			// The mutation toast explains the failure. Keep the dialog open so the user can retry.
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open actions for ${file.filename}`}
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						disabled={!file.secureUrl}
						onSelect={() => {
							if (file.secureUrl) window.open(file.secureUrl, "_blank", "noopener,noreferrer");
						}}
					>
						<Download className="h-4 w-4" />
						Open file
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={isDeleteFilePending}
						onSelect={event => {
							event.preventDefault();
							setDeleteDialogOpen(true);
						}}
					>
						<Trash2 className="h-4 w-4" />
						Delete file
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this file?</AlertDialogTitle>
						<AlertDialogDescription>
							This deletes the stored file and its knowledge-base vectors. If vector cleanup
							fails, the file will remain so you can retry.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleteFilePending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleteFilePending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
