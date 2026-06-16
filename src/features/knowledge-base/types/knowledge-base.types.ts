export interface KnowledgeBaseResponse {
	publicId: string;
	createdAt: Date;
	updatedAt: Date;
	systemMessage: string;
}

export type UpdateKnowledgeBaseMessagePayload = {
	systemMessage: string;
};

export type KnowledgeBaseUploadResponse = Record<string, unknown>;

export const knowledgeBaseFileSortValues = ["filename", "fileSize", "createdAt", "updatedAt"] as const;
export const knowledgeBaseFileSortDirectionValues = ["asc", "desc"] as const;

export interface KnowledgeBaseFile {
	id: string;
	filename: string;
	mimeType: string;
	fileSize: number;
	secureUrl: string | null;
	mediaType: string;
	altText: string | null;
	width: number | null;
	height: number | null;
	tags: unknown;
	createdAt: string;
	updatedAt: string;
}

export type KnowledgeBaseFileSort = (typeof knowledgeBaseFileSortValues)[number];
export type KnowledgeBaseFileSortDirection =
	(typeof knowledgeBaseFileSortDirectionValues)[number];
export type KnowledgeBaseFileListResponse = PaginatedData<KnowledgeBaseFile>;

export interface KnowledgeBaseFileListQuery {
	page: number;
	pageSize: number;
	search?: string;
	sort: KnowledgeBaseFileSort;
	dir: KnowledgeBaseFileSortDirection;
}

export interface DeleteKnowledgeBaseFileInput {
	id: string;
}

export interface DeleteKnowledgeBaseFileResponse {
	deleted: boolean;
}
