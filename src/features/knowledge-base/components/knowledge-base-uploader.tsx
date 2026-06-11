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
import { useKnowledgeBaseUploader } from "../hooks/use-knowledge-base-uploader";

export default function KnowledgeBaseUploader() {
	const {
		files,
		status,
		message,
		showClearDialog,
		inputRef,
		addFiles,
		removeFile,
		handleUpload,
		handleClearConfirm,
		setShowClearDialog,
		busy
	} = useKnowledgeBaseUploader();

	return (
		<div className="mx-auto max-w-lg p-6">
			{/* Drop zone */}
			<div
				onClick={() => inputRef.current?.click()}
				onDragOver={e => e.preventDefault()}
				onDrop={e => {
					e.preventDefault();
					addFiles([...e.dataTransfer.files]);
				}}
				className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:bg-gray-50"
			>
				<p className="text-sm text-gray-500">Drop files here or click to browse</p>
				<p className="mt-1 text-xs text-gray-400">.txt, .pdf, .docx, .csv, .json</p>
			</div>

			<input
				ref={inputRef}
				type="file"
				multiple
				accept=".txt,.pdf,.docx,.csv,.json,.md"
				className="hidden"
				onChange={e => addFiles([...e.target.files!])}
			/>

			{/* File list */}
			{files.length > 0 && (
				<ul className="mt-4 space-y-2">
					{files.map(f => (
						<li
							key={f.name}
							className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm"
						>
							<span className="truncate">{f.name}</span>
							<button
								onClick={() => removeFile(f.name)}
								className="ml-4 text-xs text-gray-400 hover:text-red-500"
							>
								remove
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Status message */}
			{message && (
				<p className={`mt-3 text-sm ${status === "success" ? "text-green-600" : "text-red-500"}`}>
					{message}
				</p>
			)}

			{/* Upload button */}
			<button
				onClick={handleUpload}
				disabled={!files.length || busy}
				className="mt-4 w-full rounded bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{status === "uploading" ? "Uploading…" : "Upload to ChromaDB"}
			</button>

			{/* Divider */}
			<div className="my-4 flex items-center gap-3">
				<div className="h-px flex-1 bg-gray-200" />
				<span className="text-xs text-gray-400">database</span>
				<div className="h-px flex-1 bg-gray-200" />
			</div>

			{/* Clear button */}
			<button
				onClick={() => setShowClearDialog(true)}
				disabled={busy}
				className="w-full rounded border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{status === "clearing" ? "Clearing…" : "Clear ChromaDB Collection"}
			</button>

			{/* Clear confirmation dialog */}
			<AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear ChromaDB collection?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete all chunks from office_dataset.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleClearConfirm} className="bg-red-500 hover:bg-red-600">
							Yes, clear it
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
