"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
	AlertCircle,
	CheckCircle2,
	CloudUpload,
	File,
	FileJson,
	FileSpreadsheet,
	FileText,
	Loader2,
	Trash2,
	X
} from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useKnowledgeBaseUploader } from "../hooks/use-knowledge-base-uploader";

const ACCEPTED_EXTENSIONS = [".txt", ".pdf", ".docx", ".csv", ".json", ".md"];

function getFileIcon(name: string) {
	const ext = name.split(".").pop()?.toLowerCase();
	const cls = "h-4 w-4 shrink-0 text-muted-foreground";
	if (ext === "json") return <FileJson className={cls} />;
	if (ext === "csv") return <FileSpreadsheet className={cls} />;
	if (ext === "txt" || ext === "md") return <FileText className={cls} />;
	return <File className={cls} />;
}

function formatSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBaseUploader() {
	const {
		files,
		status,
		message,
		showClearDialog,
		addFiles,
		removeFile,
		handleUpload,
		handleClearConfirm,
		setShowClearDialog,
		busy
	} = useKnowledgeBaseUploader();

	const onDrop = useCallback((accepted: File[]) => addFiles(accepted), [addFiles]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: Object.fromEntries(
			ACCEPTED_EXTENSIONS.map(ext => [
				ext === ".md" ? "text/markdown" : `application/${ext.slice(1)}`,
				[ext]
			])
		),
		multiple: true,
		disabled: busy
	});

	const isUploading = status === "uploading";
	const isClearing = status === "clearing";
	const isSuccess = status === "success";

	return (
		<div className="mx-auto w-full max-w-lg space-y-6">
			{/* Drop zone */}
			<div
				{...getRootProps()}
				className={cn(
					"bg-accent/50 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-20 text-center transition-colors",
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
					<p className="text-muted-foreground mt-1 text-xs">Supports multiple files at once</p>
				</div>
				<div className="flex flex-wrap justify-center gap-1.5">
					{ACCEPTED_EXTENSIONS.map(ext => (
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

			{/* File list */}
			{files.length > 0 && (
				<ul className="space-y-1.5">
					{files.map(f => (
						<li
							key={f.name}
							className="border-border/40 bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2"
						>
							{getFileIcon(f.name)}
							<span className="text-foreground flex-1 truncate text-sm" title={f.name}>
								{f.name}
							</span>
							<span className="text-muted-foreground shrink-0 text-xs tabular-nums">
								{formatSize(f.size)}
							</span>
							<button
								onClick={() => removeFile(f.name)}
								disabled={busy}
								aria-label={`Remove ${f.name}`}
								className="text-muted-foreground hover:text-destructive shrink-0 rounded p-0.5 transition-colors disabled:pointer-events-none"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Status message */}
			{message && (
				<div
					className={cn(
						"flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm",
						isSuccess
							? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
							: "border-destructive/30 bg-destructive/5 text-destructive"
					)}
				>
					{isSuccess ? (
						<CheckCircle2 className="h-4 w-4 shrink-0" />
					) : (
						<AlertCircle className="h-4 w-4 shrink-0" />
					)}
					<span>{message}</span>
				</div>
			)}

			{/* Progress bar (visible only while uploading) */}
			{isUploading && <Progress value={undefined} className="h-0.75" />}

			{/* Upload button */}
			<Button onClick={handleUpload} disabled={!files.length || busy} className="w-full gap-2">
				{isUploading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Uploading…
					</>
				) : (
					<>
						<CloudUpload className="h-4 w-4" />
						Upload to ChromaDB
					</>
				)}
			</Button>

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="bg-border/50 h-px flex-1" />
				<span className="text-muted-foreground text-[11px]">collection</span>
				<div className="bg-border/50 h-px flex-1" />
			</div>

			{/* Clear button */}
			<Button
				variant="outline"
				onClick={() => setShowClearDialog(true)}
				disabled={busy}
				className="border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive w-full gap-2"
			>
				{isClearing ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Clearing…
					</>
				) : (
					<>
						<Trash2 className="h-4 w-4" />
						Clear ChromaDB collection
					</>
				)}
			</Button>

			{/* Clear confirmation dialog */}
			<AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear ChromaDB collection?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete all chunks from{" "}
							<span className="text-foreground font-medium">office_dataset</span>. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleClearConfirm}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Yes, clear it
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
