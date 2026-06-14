"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useApiKeyQuery } from "@/features/api-keys/actions/api-keys.queries";
import { ApiKeys } from "@/features/api-keys/types/api-keys.types";

interface ApiKeysDetailsDialogProps {
	apiKey: ApiKeys;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ApiKeysDetailsDialog({ apiKey, open, onOpenChange }: ApiKeysDetailsDialogProps) {
	const userQuery = useApiKeyQuery(apiKey.id, open);
	const detailKey = userQuery.data ?? apiKey;
	const displayName = detailKey.name;
	const showSkeleton = userQuery.isLoading && !userQuery.data;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>API key details</DialogTitle>
					<DialogDescription>{apiKey.name}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-5">
					{showSkeleton ? (
						<ApiKeysDetailsSkeleton />
					) : (
						<>
							<section className="flex min-w-0 items-start gap-4">
								<div className="min-w-0 flex-1">
									<div className="truncate text-base font-medium">{displayName}</div>
									<div className="text-muted-foreground truncate text-sm">{detailKey.key}</div>
								</div>
							</section>
						</>
					)}
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ApiKeysDetailsSkeleton() {
	return (
		<div className="grid gap-5">
			<div className="flex items-start gap-4">
				<Skeleton className="size-12 rounded-full" />
				<div className="grid flex-1 gap-2">
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-4 w-64 max-w-full" />
				</div>
			</div>
			<Separator />
			<div className="grid gap-3 sm:grid-cols-2">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="grid gap-1">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-4 w-full max-w-52" />
					</div>
				))}
			</div>
		</div>
	);
}

