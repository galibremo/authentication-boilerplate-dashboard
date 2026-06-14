"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ApiKeysErrorAlert } from "@/features/api-keys/components/api-keys-error-alert";
import { ApiKeysTable } from "@/features/api-keys/components/api-keys-table";
import { CreateApiKeysDialog } from "@/features/api-keys/components/create-api-keys-dialog";
import { ApiKeysListProvider, useApiKeysList } from "@/features/api-keys/hooks/use-api-keys-list";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Api Keys", isCurrent: true }
];

export function ApiKeysPage() {
	return (
		<ApiKeysListProvider>
			<ApiKeysPageContent />
		</ApiKeysListProvider>
	);
}

export default function ApiKeysPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useApiKeysList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load API keys");
	}, [error, router]);
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-normal">Api Keys</h1>
						<p className="text-muted-foreground text-sm">
							Manage your API keys and their permissions.
						</p>
					</div>
					<CreateApiKeysDialog />
				</div>
				<Card>
					<CardHeader>
						<CardTitle>API Keys</CardTitle>
						<CardDescription>Search, filter, and manage API key access.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <ApiKeysErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<ApiKeysTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

