"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";

import { ApiKeysDataTableRowActions } from "@/features/api-keys/components/api-keys-data-table-row-actions";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";
import { formatUserDate } from "@/features/users/utils/user-format";

interface ApiKeysColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

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
					title="User"
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
				return row.original.key;
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

