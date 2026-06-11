"use client";

import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Api Keys", isCurrent: true }
];

export default function ApiKeysPage() {
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-normal">Api Keys</h1>
					<p className="text-muted-foreground text-sm">
						Manage your API keys and their permissions.
					</p>
				</div>
			</div>
		</>
	);
}
