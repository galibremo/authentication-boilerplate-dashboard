import { z } from "zod";

import { validateString } from "@/validators/common-rule";

const baseApiKeysFormSchema = z.object({
	name: validateString("Name", { max: 255 }),
	key: validateString("Key")
});

export const createApiKeysFormSchema = baseApiKeysFormSchema;

export const editApiKeysFormSchema = baseApiKeysFormSchema;

export type CreateApiKeysFormValues = z.infer<typeof createApiKeysFormSchema>;
export type EditApiKeysFormValues = z.infer<typeof editApiKeysFormSchema>;
