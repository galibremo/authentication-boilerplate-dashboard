import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { useKnowledgeBaseMutation } from "@/features/knowledge-base/actions/knowledge-base.mutations";
import {
	CreateKnowledgeBaseFormValues,
	createKnowledgeBaseFormSchema
} from "@/features/knowledge-base/schemas/knowledge-base-form.schema";

export default function KnowledgeBaseForm() {
	const { knowledgeBaseMutateAsync, isKnowledgeBaseMessageLoading } = useKnowledgeBaseMutation();

	const form = useForm<CreateKnowledgeBaseFormValues>({
		resolver: zodResolver(createKnowledgeBaseFormSchema),
		defaultValues: {
			systemMessage: ""
		}
	});

	const {
		register,
		formState: { errors }
	} = form;

	const onSubmit = async (values: CreateKnowledgeBaseFormValues) => {
		try {
			await knowledgeBaseMutateAsync(values);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
			>
				{/* Header Context Section */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
						Knowledge Base Configuration
					</h2>
					<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
						Define the behavioral rules and context for your AI agent.
					</p>
				</div>

				<FieldGroup className="space-y-6">
					{/* Layout fixed from horizontal row to stack flex-col */}
					<Field className="flex flex-col gap-2">
						<FieldLabel
							htmlFor="system-message"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							System Message
						</FieldLabel>

						<Textarea
							id="system-message"
							{...register("systemMessage")}
							placeholder="e.g., You are a helpful assistant specialized in technical writing..."
							rows={6}
							className="focus:ring-primary min-h-30 w-full resize-y rounded-lg border-zinc-200 focus:ring-2 dark:border-zinc-800"
						/>

						{/* Contextual instruction text under the field */}
						{!errors.systemMessage && (
							<p className="text-xs text-zinc-400 dark:text-zinc-500">
								This message outlines constraints, persona directives, and ground truths.
							</p>
						)}

						{errors.systemMessage && (
							<p className="text-destructive animate-in fade-in-50 text-xs font-medium duration-150 dark:text-red-400">
								{errors.systemMessage.message}
							</p>
						)}
					</Field>
				</FieldGroup>

				{/* Actions Row */}
				<div className="mt-6 flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
					<Button
						type="submit"
						disabled={isKnowledgeBaseMessageLoading}
						className="w-full min-w-35 sm:w-auto"
					>
						{isKnowledgeBaseMessageLoading ? "Saving Changes..." : "Save Configuration"}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}

