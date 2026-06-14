"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useApiKeysQuery } from "@/features/api-keys/actions/api-keys.queries";
import { apiKeysSearchParams } from "@/features/api-keys/schemas/api-keys.schema";
import type {
	ApiKeys,
	ApiKeysListQuery,
	ApiKeysListResponse,
	ApiKeysSort,
	ApiKeysSortDirection
} from "@/features/api-keys/types/api-keys.types";
import { apiKeysSortValues } from "@/features/api-keys/types/api-keys.types";

type ApiKeysPagination = PaginatedData<ApiKeys>;

interface ApiKeysListContextValue {
	tableData: ApiKeys[];
	pagination: ApiKeysPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	sort: ApiKeysSort;
	dir: ApiKeysSortDirection;
	handleSorting: (sort: string, dir: ApiKeysSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: ApiKeysListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableApiKeysColumns = new Set<string>(apiKeysSortValues);
const ApiKeysListContext = createContext<ApiKeysListContextValue | null>(null);

interface ApiKeysListProviderProps extends GlobalLayoutProps {}

export function ApiKeysListProvider({ children }: ApiKeysListProviderProps) {
	const [params, setParams] = useQueryStates(apiKeysSearchParams);
	const filters = useMemo<ApiKeysListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[params.dir, params.page, params.pageSize, params.search, params.sort]
	);
	const apiKeysQuery = useApiKeysQuery(filters);
	const pagination = apiKeysQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: ApiKeysSortDirection) => {
			if (!sortableApiKeysColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as ApiKeysSort, dir: nextDir, page: 1 });
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
		void toast.promise(apiKeysQuery.refetch(), {
			loading: "Refreshing apiKeys...",
			success: "ApiKeys refreshed",
			error: "Failed to refresh apiKeys"
		});
	}, [apiKeysQuery]);

	const value = useMemo<ApiKeysListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: apiKeysQuery.isLoading,
			isFetching: apiKeysQuery.isFetching,
			error: apiKeysQuery.error,
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
			pagination.rows,
			pagination.total,
			pagination.page,
			pagination.pageSize,
			apiKeysQuery.isLoading,
			apiKeysQuery.isFetching,
			apiKeysQuery.error,
			params.search,
			params.sort,
			params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleResetAll,
			handleRefresh
		]
	);

	return <ApiKeysListContext.Provider value={value}>{children}</ApiKeysListContext.Provider>;
}

export function useApiKeysList() {
	const context = useContext(ApiKeysListContext);

	if (!context) {
		throw new Error("useApiKeysList must be used within ApiKeysListProvider");
	}

	return context;
}

