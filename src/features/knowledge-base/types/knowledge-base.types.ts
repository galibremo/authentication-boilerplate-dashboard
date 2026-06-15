export interface KnowledgeBaseResponse {
	publicId: string;
	createdAt: Date;
	updatedAt: Date;
	systemMessage: string;
}

export type UpdateKnowledgeBaseMessagePayload = {
	systemMessage: string;
};

