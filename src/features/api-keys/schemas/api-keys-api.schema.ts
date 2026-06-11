import { z } from "zod";

import {
	userSortDirectionValues,
	userSortValues,
	type UserListQuery
} from "@/features/users/types/users.types";
import { validateEnum } from "@/validators/common-rule";

function firstSearchParamValue(value: unknown): unknown {
	return Array.isArray(value) ? value[0] : value;
}

const optionalTrimmedStringSchema = z.preprocess(value => {
	const nextValue = firstSearchParamValue(value);
	if (typeof nextValue !== "string") return undefined;

	const trimmed = nextValue.trim();
	return trimmed || undefined;
}, z.string().optional().catch(undefined));

const pageQuerySchema = z
	.preprocess(firstSearchParamValue, z.coerce.number().int().min(1))
	.optional()
	.catch(1)
	.default(1);

const pageSizeQuerySchema = z
	.preprocess(firstSearchParamValue, z.coerce.number().int().min(1).max(100))
	.optional()
	.catch(10)
	.default(10);

const sortQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Sort", userSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", userSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

export const userListQuerySchema = z.object({
	page: pageQuerySchema,
	pageSize: pageSizeQuerySchema,
	search: optionalTrimmedStringSchema,
	sort: sortQuerySchema,
	dir: directionQuerySchema
});

export function createUserListQuery(input: unknown): UserListQuery {
	const query = userListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		search: query.search,
		sort: query.sort,
		dir: query.dir
	};
}
