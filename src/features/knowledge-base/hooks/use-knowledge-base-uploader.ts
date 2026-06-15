import { useRef, useState } from "react";

import { useKnowledgeBaseUploadMutation } from "@/features/knowledge-base/actions/knowledge-base.mutations";

type Status = "idle" | "uploading" | "clearing" | "success" | "error";

export function useKnowledgeBaseUploader() {
	const [files, setFiles] = useState<File[]>([]);
	const [status, setStatus] = useState<Status>("idle");
	const [message, setMessage] = useState("");
	const [showClearDialog, setShowClearDialog] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { uploadMutate, isUploadPending } = useKnowledgeBaseUploadMutation();

	const addFiles = (incoming: File[]) => {
		setFiles(prev => {
			const names = new Set(prev.map(f => f.name));
			return [...prev, ...incoming.filter(f => !names.has(f.name))];
		});
	};

	const removeFile = (name: string) => {
		setFiles(prev => prev.filter(f => f.name !== name));
	};

	const handleUpload = async () => {
		if (!files.length) return;
		setStatus("uploading");
		setMessage("");

		try {
			// Upload files one by one so n8n processes each separately
			await uploadMutate(files);

			setStatus("success");
			setMessage(`Successfully upserted ${files.length} file(s) into ChromaDB.`);
			setFiles([]);
		} catch (err: any) {
			setStatus("error");
			setMessage(`Could not reach N8N: ${err.message}`);
		}
	};

	const handleClear = async () => {
		setStatus("clearing");
		setMessage("");

		try {
			const res = await fetch("/api/proxy/n8n/clear", { method: "DELETE" });
			const data = await res.json().catch(() => ({}));

			if (res.ok) {
				setStatus("success");
				setMessage("ChromaDB collection cleared successfully.");
			} else {
				setStatus("error");
				setMessage(data?.message || `Clear failed with status ${res.status}`);
			}
		} catch (err: any) {
			setStatus("error");
			setMessage(`Could not reach ChromaDB: ${err.message}`);
		}
	};

	const handleClearConfirm = async () => {
		setShowClearDialog(false);
		await handleClear();
	};

	const busy = status === "uploading" || status === "clearing";

	return {
		files,
		status,
		message,
		showClearDialog,
		inputRef,
		addFiles,
		removeFile,
		handleUpload,
		handleClear,
		handleClearConfirm,
		setShowClearDialog,
		busy
	};
}

