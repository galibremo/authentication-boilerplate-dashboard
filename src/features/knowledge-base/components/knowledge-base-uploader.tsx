"use client";

import {
	AlertCircle,
	CheckCircle2,
	CloudUpload,
	File,
	FileSpreadsheet,
	FileText,
	FileType,
	Loader2,
	X
} from "lucide-react";
import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import {
	KNOWLEDGE_BASE_ACCEPTED_EXTENSIONS,
	KNOWLEDGE_BASE_DROPZONE_ACCEPT,
	KNOWLEDGE_BASE_UPLOAD_MAX_SIZE,
	KnowledgeBaseUploadItem,
	useKnowledgeBaseUploader
} from "../hooks/use-knowledge-base-uploader";

function getFileIcon(name: string) {
	const ext = name.split(".").pop()?.toLowerCase();
	const cls = "h-4 w-4 shrink-0 text-muted-foreground";
	if (ext === "csv") return <FileSpreadsheet className={cls} />;
	if (ext === "pdf" || ext === "doc" || ext === "docx") return <FileType className={cls} />;
	if (ext === "txt" || ext === "md") return <FileText className={cls} />;
	return <File className={cls} />;
}

function formatSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusIcon(item: KnowledgeBaseUploadItem) {
	if (item.status === "uploading") {
		return <Loader2 className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />;
	}

	if (item.status === "success") {
		return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />;
	}

	if (item.status === "error") {
		return <AlertCircle className="text-destructive h-4 w-4 shrink-0" />;
	}

	return getFileIcon(item.file.name);
}

function getStatusText(item: KnowledgeBaseUploadItem) {
	if (item.status === "uploading") return "Uploading";
	if (item.status === "success") return "Stored and sent for indexing";
	if (item.status === "error") return item.error || "Upload failed";
	return "Ready";
}

export default function KnowledgeBaseUploader() {
	const {
		files,
		message,
		summary,
		addFiles,
		addRejectedFiles,
		removeFile,
		clearCompleted,
		handleUpload,
		busy,
		uploadableCount
	} = useKnowledgeBaseUploader();

	const onDrop = useCallback(
		(accepted: File[], rejected: FileRejection[]) => {
			addFiles(accepted);
			addRejectedFiles(rejected);
		},
		[addFiles, addRejectedFiles]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: KNOWLEDGE_BASE_DROPZONE_ACCEPT,
		maxSize: KNOWLEDGE_BASE_UPLOAD_MAX_SIZE,
		multiple: true,
		disabled: busy
	});

	const isUploading = files.some(file => file.status === "uploading");
	const hasCompleted = files.some(file => file.status === "success");

	return (
		<div className="w-full max-w-lg space-y-5">
			<div
				{...getRootProps()}
				className={cn(
					"bg-accent/50 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-16 text-center transition-colors",
					isDragActive ? "border-border bg-accent" : "border-border/90 hover:border-border",
					busy && "pointer-events-none opacity-50"
				)}
			>
				<input {...getInputProps()} />
				<CloudUpload className="text-muted-foreground/60 h-8 w-8" strokeWidth={1.5} />
				<div>
					<p className="text-foreground text-sm font-medium">
						{isDragActive ? "Release to add files" : "Drop files here or click to browse"}
					</p>
					<p className="text-muted-foreground mt-1 text-xs">
						Documents up to 10MB each
					</p>
				</div>
				<div className="flex flex-wrap justify-center gap-1.5">
					{KNOWLEDGE_BASE_ACCEPTED_EXTENSIONS.map(ext => (
						<Badge
							key={ext}
							variant="secondary"
							className="rounded-full px-2.5 py-0.5 text-[11px] font-normal"
						>
							{ext}
						</Badge>
					))}
				</div>
			</div>

			{files.length > 0 && (
				<ul className="space-y-1.5">
					{files.map(item => (
						<li
							key={item.id}
							className={cn(
								"border-border/40 bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2",
								item.status === "error" && "border-destructive/30 bg-destructive/5",
								item.status === "success" &&
									"border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
							)}
						>
							{getStatusIcon(item)}
							<div className="min-w-0 flex-1">
								<span className="text-foreground block truncate text-sm" title={item.file.name}>
									{item.file.name}
								</span>
								<span
									className={cn(
										"text-muted-foreground block truncate text-xs",
										item.status === "error" && "text-destructive",
										item.status === "success" && "text-green-700 dark:text-green-400"
									)}
								>
									{getStatusText(item)}
								</span>
							</div>
							<span className="text-muted-foreground shrink-0 text-xs tabular-nums">
								{formatSize(item.file.size)}
							</span>
							<button
								onClick={() => removeFile(item.id)}
								disabled={busy}
								aria-label={`Remove ${item.file.name}`}
								className="text-muted-foreground hover:text-destructive shrink-0 rounded p-0.5 transition-colors disabled:pointer-events-none disabled:opacity-50"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</li>
					))}
				</ul>
			)}

			{message && (
				<div className="border-destructive/30 bg-destructive/5 text-destructive flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm">
					<AlertCircle className="h-4 w-4 shrink-0" />
					<span>{message}</span>
				</div>
			)}

			{summary && (
				<div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400">
					<CheckCircle2 className="h-4 w-4 shrink-0" />
					<span>{summary}</span>
				</div>
			)}

			{isUploading && <Progress value={undefined} className="h-0.75" />}

			<div className="flex flex-col gap-2 sm:flex-row">
				<Button
					onClick={handleUpload}
					disabled={!uploadableCount || busy}
					className="flex-1 gap-2"
				>
					{isUploading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Uploading...
						</>
					) : (
						<>
							<CloudUpload className="h-4 w-4" />
							Upload to knowledge base
						</>
					)}
				</Button>
				{hasCompleted && (
					<Button
						type="button"
						variant="outline"
						onClick={clearCompleted}
						disabled={busy}
						className="sm:w-auto"
					>
						Clear completed
					</Button>
				)}
			</div>
		</div>
	);
}
