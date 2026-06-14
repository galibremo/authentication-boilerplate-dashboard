import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { getUserErrorMessage } from "@/features/users/utils/user-errors";

interface ApiKeysErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

export function ApiKeysErrorAlert({
	error,
	title = "API key request failed",
	onRetry
}: ApiKeysErrorAlertProps) {
	return (
		<Alert variant="destructive" className="py-4">
			<LuCircleAlert className="mt-0.5 shrink-0" />
			<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 space-y-1">
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{getUserErrorMessage(error)}</AlertDescription>
				</div>
				{onRetry ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive w-fit"
						onClick={onRetry}
					>
						Retry
					</Button>
				) : null}
			</div>
		</Alert>
	);
}

