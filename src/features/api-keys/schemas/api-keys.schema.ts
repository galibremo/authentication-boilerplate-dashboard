import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import { userSortDirectionValues, userSortValues } from "@/features/users/types/users.types";

export const apiKeysSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...userSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...userSortDirectionValues]).withDefault("desc")
};
