"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { createApiKeysColumns } from "@/features/api-keys/components/api-keys-data-columns";
import { ApiKeysDataTableToolbar } from "@/features/api-keys/components/api-keys-data-table-toolbar";
import { useApiKeysList } from "@/features/api-keys/hooks/use-api-keys-list";

export function ApiKeysTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useApiKeysList();
	const columns = useMemo(
		() =>
			createApiKeysColumns({
				sort: sort as string,
				dir,
				handleSorting
			}),
		[sort, dir, handleSorting]
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={ApiKeysDataTableToolbar}
			emptyTitle="No API keys found"
			emptyDescription="API keys matching your filters will appear here."
		/>
	);
}

