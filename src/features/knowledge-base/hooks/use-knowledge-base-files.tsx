"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useKnowledgeBaseFilesQuery } from "@/features/knowledge-base/actions/knowledge-base.queries";
import { knowledgeBaseFileSearchParams } from "@/features/knowledge-base/schemas/knowledge-base-files.schema";
import type {
	KnowledgeBaseFile,
	KnowledgeBaseFileListQuery,
	KnowledgeBaseFileListResponse,
	KnowledgeBaseFileSort,
	KnowledgeBaseFileSortDirection
} from "@/features/knowledge-base/types/knowledge-base.types";
import { knowledgeBaseFileSortValues } from "@/features/knowledge-base/types/knowledge-base.types";

type KnowledgeBaseFilePagination = PaginatedData<KnowledgeBaseFile>;

interface KnowledgeBaseFilesContextValue {
	tableData: KnowledgeBaseFile[];
	pagination: KnowledgeBaseFilePagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	sort: KnowledgeBaseFileSort;
	dir: KnowledgeBaseFileSortDirection;
	handleSorting: (sort: string, dir: KnowledgeBaseFileSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: KnowledgeBaseFileListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableColumns = new Set<string>(knowledgeBaseFileSortValues);
const KnowledgeBaseFilesContext = createContext<KnowledgeBaseFilesContextValue | null>(null);

interface KnowledgeBaseFilesProviderProps extends GlobalLayoutProps {}

export function KnowledgeBaseFilesProvider({ children }: KnowledgeBaseFilesProviderProps) {
	const [params, setParams] = useQueryStates(knowledgeBaseFileSearchParams);
	const filters = useMemo<KnowledgeBaseFileListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[params.dir, params.page, params.pageSize, params.search, params.sort]
	);
	const filesQuery = useKnowledgeBaseFilesQuery(filters);
	const pagination = filesQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: KnowledgeBaseFileSortDirection) => {
			if (!sortableColumns.has(nextSort)) return;
			void setParams({ sort: nextSort as KnowledgeBaseFileSort, dir: nextDir, page: 1 });
		},
		[setParams]
	);

	const handleOptionFilter = useCallback(
		(key: string, value?: string | string[] | null) => {
			const normalizedValue = Array.isArray(value) ? value.join(",") : value;

			if (key === "page") {
				void setParams({ page: Number(normalizedValue) || 1 });
				return;
			}

			if (key === "limit" || key === "pageSize") {
				void setParams({
					pageSize: Number(normalizedValue) || defaultPagination.pageSize,
					page: defaultPagination.page
				});
			}
		},
		[setParams]
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			void setParams({ search: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleResetAll = useCallback(() => {
		void setParams({
			page: 1,
			pageSize: 10,
			search: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(filesQuery.refetch(), {
			loading: "Refreshing files...",
			success: "Files refreshed",
			error: "Failed to refresh files"
		});
	}, [filesQuery]);

	const value = useMemo<KnowledgeBaseFilesContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination,
			isLoading: filesQuery.isLoading,
			isFetching: filesQuery.isFetching,
			error: filesQuery.error,
			search: params.search,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleResetAll,
			handleRefresh
		}),
		[
			filesQuery.error,
			filesQuery.isFetching,
			filesQuery.isLoading,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSearchChange,
			handleSorting,
			pagination,
			params.dir,
			params.search,
			params.sort
		]
	);

	return (
		<KnowledgeBaseFilesContext.Provider value={value}>
			{children}
		</KnowledgeBaseFilesContext.Provider>
	);
}

export function useKnowledgeBaseFiles() {
	const context = useContext(KnowledgeBaseFilesContext);
	if (!context) {
		throw new Error("useKnowledgeBaseFiles must be used within KnowledgeBaseFilesProvider");
	}
	return context;
}
