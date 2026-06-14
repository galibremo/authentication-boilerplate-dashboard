import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	apiKeysSortDirectionValues,
	apiKeysSortValues
} from "@/features/api-keys/types/api-keys.types";

export const apiKeysSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...apiKeysSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...apiKeysSortDirectionValues]).withDefault("desc")
};

