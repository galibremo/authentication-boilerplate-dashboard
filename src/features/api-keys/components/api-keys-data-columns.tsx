"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Button } from "@/components/ui/button";

import { ApiKeysDataTableRowActions } from "@/features/api-keys/components/api-keys-data-table-row-actions";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";
import { formatUserDate } from "@/features/users/utils/user-format";

interface ApiKeysColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

const handleCopyKey = async (key: string) => {
	await navigator.clipboard.writeText(key);
	toast.success("API key copied to clipboard");
};

export function createApiKeysColumns({
	sort,
	dir,
	handleSorting
}: ApiKeysColumnsOptions): ColumnDef<ApiKeys>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Name"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => {
				return row.original.name;
			}
		},
		{
			accessorKey: "key",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Key"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => {
				const key = row.original.key;
				return (
					<div className="flex items-center gap-2">
						<code className="text-sm">{key}</code>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => handleCopyKey(key)}
						>
							<HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
						</Button>
					</div>
				);
			}
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Created"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatUserDate(row.original.createdAt)
		},
		{
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Updated"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatUserDate(row.original.updatedAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <ApiKeysDataTableRowActions apiKey={row.original} />
		}
	];
}

