"use client";

import ChatBot from "@/features/chat-wit-ai/components/chat-bot";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Chat With AI", isCurrent: true }
];

export default function ChatWithAIPage() {
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-normal">Chat With AI</h1>
					<p className="text-muted-foreground text-sm">
						Chat with our AI assistant for help and support.
					</p>
				</div>
				<ChatBot />
			</div>
		</>
	);
}

