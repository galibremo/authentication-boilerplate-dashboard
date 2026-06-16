"use client";

import KnowledgeBaseForm from "@/features/knowledge-base/components/knowledge-base-form";
import KnowledgeBaseUploader from "@/features/knowledge-base/components/knowledge-base-uploader";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Knowledge Base", isCurrent: true }
];

export default function KnowledgeBasePage() {
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-normal">Knowledge Base</h1>
					<p className="text-muted-foreground text-sm">
						Access our knowledge base for help and support.
					</p>
				</div>
				<div className="flex w-full flex-col gap-4 xl:flex-row">
					<KnowledgeBaseForm />
					<KnowledgeBaseUploader />
				</div>
			</div>
		</>
	);
}
