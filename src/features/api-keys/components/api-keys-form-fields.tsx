"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { CreateApiKeysFormValues } from "@/features/api-keys/schemas/api-keys-form.schema";

interface ApiKeysFormFieldsProps {
	idPrefix: string;
	disabled?: boolean;
}

export function ApiKeysFormFields({ idPrefix, disabled = false }: ApiKeysFormFieldsProps) {
	const {
		register,
		control,
		formState: { errors }
	} = useFormContext<CreateApiKeysFormValues>();

	return (
		<FieldGroup className="gap-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
					<Input
						id={`${idPrefix}-name`}
						{...register("name")}
						placeholder="Name for the API key"
						disabled={disabled}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-key`}>Key</FieldLabel>
					<Input
						id={`${idPrefix}-key`}
						{...register("key")}
						placeholder="API key"
						disabled={disabled}
					/>
				</Field>
			</div>
		</FieldGroup>
	);
}

