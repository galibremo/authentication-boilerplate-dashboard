import { z } from "zod";

import { validateOptionalString } from "@/validators/common-rule";

const baseKnowledgeBaseFormSchema = z.object({
	systemMessage: validateOptionalString("System Message", { max: 255 })
});

export const createKnowledgeBaseFormSchema = baseKnowledgeBaseFormSchema;

export type CreateKnowledgeBaseFormValues = z.infer<typeof createKnowledgeBaseFormSchema>;

