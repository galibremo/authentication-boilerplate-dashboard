import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";
import { z } from "zod";

import {
	knowledgeBaseFileSortDirectionValues,
	knowledgeBaseFileSortValues,
	type KnowledgeBaseFileListQuery
} from "@/features/knowledge-base/types/knowledge-base.types";
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
	.preprocess(firstSearchParamValue, validateEnum("Sort", knowledgeBaseFileSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(
		firstSearchParamValue,
		validateEnum("Direction", knowledgeBaseFileSortDirectionValues)
	)
	.optional()
	.catch("desc")
	.default("desc");

const knowledgeBaseFileListQuerySchema = z.object({
	page: pageQuerySchema,
	pageSize: pageSizeQuerySchema,
	search: optionalTrimmedStringSchema,
	sort: sortQuerySchema,
	dir: directionQuerySchema
});

export const knowledgeBaseFileSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...knowledgeBaseFileSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...knowledgeBaseFileSortDirectionValues]).withDefault("desc")
};

export function createKnowledgeBaseFileListQuery(
	input: unknown
): KnowledgeBaseFileListQuery {
	const query = knowledgeBaseFileListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		search: query.search,
		sort: query.sort,
		dir: query.dir
	};
}
