"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { KnowledgeBaseFileRowActions } from "@/features/knowledge-base/components/knowledge-base-file-row-actions";
import type { KnowledgeBaseFile } from "@/features/knowledge-base/types/knowledge-base.types";
import { formatUserDate } from "@/features/users/utils/user-format";

interface KnowledgeBaseFilesColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

function formatSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string) {
	return filename.split(".").pop()?.toUpperCase() || "FILE";
}

export function createKnowledgeBaseFilesColumns({
	sort,
	dir,
	handleSorting
}: KnowledgeBaseFilesColumnsOptions): ColumnDef<KnowledgeBaseFile>[] {
	return [
		{
			accessorKey: "filename",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="File"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<div className="flex min-w-0 items-center gap-2">
					<FileText className="text-muted-foreground h-4 w-4 shrink-0" />
					<span className="truncate" title={row.original.filename}>
						{row.original.filename}
					</span>
				</div>
			)
		},
		{
			accessorKey: "mimeType",
			header: "Type",
			cell: ({ row }) => (
				<Badge variant="secondary" className="rounded-full">
					{getFileExtension(row.original.filename)}
				</Badge>
			)
		},
		{
			accessorKey: "fileSize",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Size"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatSize(row.original.fileSize)
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Uploaded"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatUserDate(row.original.createdAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <KnowledgeBaseFileRowActions file={row.original} />
		}
	];
}
