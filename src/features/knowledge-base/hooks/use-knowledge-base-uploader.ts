import { useMemo, useState } from "react";
import { type FileRejection } from "react-dropzone";

import { useKnowledgeBaseUploadMutation } from "@/features/knowledge-base/actions/knowledge-base.mutations";
import { KnowledgeBaseUploadResponse } from "@/features/knowledge-base/types/knowledge-base.types";

export const KNOWLEDGE_BASE_UPLOAD_MAX_SIZE = 10 * 1024 * 1024;

export const KNOWLEDGE_BASE_ACCEPTED_EXTENSIONS = [
	".txt",
	".md",
	".markdown",
	".csv",
	".json",
	".jsonl",
	".ndjson",
	".xml",
	".tsv",
	".pdf",
	".doc",
	".docx"
] as const;

export const KNOWLEDGE_BASE_DROPZONE_ACCEPT = {
	"text/plain": [".txt"],
	"text/markdown": [".md", ".markdown"],
	"text/csv": [".csv"],
	"text/xml": [".xml"],
	"text/tab-separated-values": [".tsv"],
	"application/json": [".json"],
	"application/ld+json": [".json"],
	"application/x-ndjson": [".jsonl", ".ndjson"],
	"application/xml": [".xml"],
	"application/pdf": [".pdf"],
	"application/msword": [".doc"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
};

const acceptedExtensionSet = new Set(KNOWLEDGE_BASE_ACCEPTED_EXTENSIONS);

type UploadStatus = "pending" | "uploading" | "success" | "error";

export type KnowledgeBaseUploadItem = {
	id: string;
	file: File;
	status: UploadStatus;
	error?: string;
	response?: KnowledgeBaseUploadResponse;
};

function getFileId(file: File) {
	return `${file.name}-${file.size}-${file.lastModified}`;
}

function getFileExtension(file: File) {
	const extension = file.name.split(".").pop()?.toLowerCase();
	return extension ? `.${extension}` : "";
}

function validateFile(file: File) {
	if (file.size > KNOWLEDGE_BASE_UPLOAD_MAX_SIZE) {
		return "File is larger than 10MB.";
	}

	if (
		!acceptedExtensionSet.has(
			getFileExtension(file) as (typeof KNOWLEDGE_BASE_ACCEPTED_EXTENSIONS)[number]
		)
	) {
		return "File type is not supported.";
	}

	return null;
}

function getRejectionMessage(rejection: FileRejection) {
	const firstError = rejection.errors[0];

	if (firstError?.code === "file-too-large") {
		return `${rejection.file.name} is larger than 10MB.`;
	}

	if (firstError?.code === "file-invalid-type") {
		return `${rejection.file.name} is not a supported document.`;
	}

	return `${rejection.file.name} could not be added.`;
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	return "Upload failed.";
}

export function useKnowledgeBaseUploader() {
	const [items, setItems] = useState<KnowledgeBaseUploadItem[]>([]);
	const [message, setMessage] = useState("");
	const [isUploadingQueue, setIsUploadingQueue] = useState(false);

	const { uploadMutateAsync, isUploadPending } = useKnowledgeBaseUploadMutation();
	const busy = isUploadingQueue || isUploadPending;

	const addFiles = (incoming: File[]) => {
		if (!incoming.length) return;

		setItems(prev => {
			const ids = new Set(prev.map(item => item.id));
			const next = [...prev];
			const messages: string[] = [];

			for (const file of incoming) {
				const id = getFileId(file);
				const validationError = validateFile(file);

				if (ids.has(id)) {
					messages.push(`${file.name} is already in the queue.`);
					continue;
				}

				if (validationError) {
					messages.push(`${file.name}: ${validationError}`);
					continue;
				}

				ids.add(id);
				next.push({ id, file, status: "pending" });
			}

			setMessage(messages.join(" "));
			return next;
		});
	};

	const addRejectedFiles = (rejections: FileRejection[]) => {
		if (!rejections.length) return;
		setMessage(rejections.map(getRejectionMessage).join(" "));
	};

	const removeFile = (id: string) => {
		if (busy) return;
		setItems(prev => prev.filter(item => item.id !== id));
	};

	const clearCompleted = () => {
		if (busy) return;
		setItems(prev => prev.filter(item => item.status !== "success"));
		setMessage("");
	};

	const handleUpload = async () => {
		if (busy) return;

		const uploadableItems = items.filter(
			item => item.status === "pending" || item.status === "error"
		);

		if (!uploadableItems.length) {
			setMessage("Add at least one supported document before uploading.");
			return;
		}

		setMessage("");
		setIsUploadingQueue(true);

		try {
			for (const item of uploadableItems) {
				setItems(prev =>
					prev.map(current =>
						current.id === item.id
							? { ...current, status: "uploading", error: undefined }
							: current
					)
				);

				try {
					const response = await uploadMutateAsync(item.file);
					setItems(prev =>
						prev.map(current =>
							current.id === item.id
								? { ...current, status: "success", response }
								: current
						)
					);
				} catch (error) {
					setItems(prev =>
						prev.map(current =>
							current.id === item.id
								? { ...current, status: "error", error: getErrorMessage(error) }
								: current
						)
					);
				}
			}
		} finally {
			setIsUploadingQueue(false);
		}
	};

	const summary = useMemo(() => {
		const total = items.length;
		const success = items.filter(item => item.status === "success").length;
		const failed = items.filter(item => item.status === "error").length;

		if (!total) return "";
		if (failed) return `${success}/${total} file(s) stored and sent for indexing.`;
		if (success === total) return `${total} file(s) stored and sent for indexing.`;
		return "";
	}, [items]);

	const uploadableCount = items.filter(
		item => item.status === "pending" || item.status === "error"
	).length;

	return {
		files: items,
		message,
		summary,
		addFiles,
		addRejectedFiles,
		removeFile,
		clearCompleted,
		handleUpload,
		busy,
		uploadableCount
	};
}
