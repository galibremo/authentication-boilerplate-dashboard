"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import { createKnowledgeBaseFilesColumns } from "@/features/knowledge-base/components/knowledge-base-files-columns";
import { KnowledgeBaseFilesToolbar } from "@/features/knowledge-base/components/knowledge-base-files-toolbar";
import { useKnowledgeBaseFiles } from "@/features/knowledge-base/hooks/use-knowledge-base-files";

export function KnowledgeBaseFilesTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useKnowledgeBaseFiles();
	const columns = useMemo(
		() =>
			createKnowledgeBaseFilesColumns({
				sort: sort as string,
				dir,
				handleSorting
			}),
		[dir, handleSorting, sort]
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={KnowledgeBaseFilesToolbar}
			emptyTitle="No files uploaded"
			emptyDescription="Uploaded knowledge-base files will appear here."
		/>
	);
}
