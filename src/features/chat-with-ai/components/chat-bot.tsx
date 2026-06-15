"use client";

import { useSendMessageMutation } from "../actions/chat.mutations";
import { useChatHistoryQuery } from "../actions/chat.queries";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import Markdown from "react-markdown";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function getSessionId(): string {
	const key = "n8n-chat-session-id";
	let id = localStorage.getItem(key);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(key, id);
	}
	return id;
}

export default function ChatBot() {
	const [input, setInput] = useState("");
	const sessionId = useSyncExternalStore(
		() => () => {},
		() => getSessionId(),
		() => ""
	);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data: messages = [], isLoading } = useChatHistoryQuery(sessionId);
	const sendMessageMutation = useSendMessageMutation(sessionId);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, sendMessageMutation.isPending]);

	const sendMessage = () => {
		const question = input.trim();
		if (!question || sendMessageMutation.isPending) return;

		setInput("");
		sendMessageMutation.mutate(question);
	};

	return (
		<Card className="mx-auto flex h-140 w-full max-w-2xl flex-col gap-0 border shadow-md">
			<CardHeader className="border-b">
				<CardTitle className="flex items-center gap-2.5 text-base">
					<div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
						<Sparkles className="text-primary size-4" />
					</div>
					AI Assistant
				</CardTitle>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden px-0">
				<ScrollArea className="h-full">
					<div className="space-y-5 p-5">
						{messages.length === 0 && !isLoading && (
							<div className="flex flex-col items-center justify-center py-20 text-center">
								<div className="bg-muted/50 mb-5 flex size-14 items-center justify-center rounded-full">
									<Bot className="text-muted-foreground size-7" />
								</div>
								<p className="text-foreground text-sm font-semibold">
									Welcome to Apple Tree Gents Parlour
								</p>
								<p className="text-muted-foreground mt-1.5 max-w-xs text-xs leading-relaxed">
									Ask about our services, pricing, appointments, or anything else &mdash; we&apos;re
									here to help!
								</p>
							</div>
						)}

						{messages.map(msg => {
							const isUser = msg.message.type === "human";

							return (
								<div
									key={msg.id}
									className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
								>
									<Avatar size="sm" className="mt-0.5 shrink-0">
										<AvatarFallback>
											{isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
										</AvatarFallback>
									</Avatar>

									<div
										className={cn(
											"max-w-[78%] px-4 py-2.5 text-sm leading-relaxed",
											isUser
												? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
												: "bg-muted text-foreground rounded-2xl rounded-tl-sm"
										)}
									>
										{isUser ? (
											msg.message.content
										) : (
											<div className="prose prose-sm dark:prose-invert max-w-none">
												<Markdown
													components={{
														a: ({ children, ...props }) => (
															<a {...props} target="_blank" rel="noopener noreferrer">
																{children}
															</a>
														),
													}}
												>
													{msg.message.content}
												</Markdown>
											</div>
										)}
									</div>
								</div>
							);
						})}

						{sendMessageMutation.isPending && (
							<div className="flex gap-3">
								<Avatar size="sm" className="mt-0.5 shrink-0">
									<AvatarFallback>
										<Bot className="size-3.5" />
									</AvatarFallback>
								</Avatar>
								<div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
									<span className="flex gap-1">
										<span className="bg-muted-foreground/40 size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
										<span className="bg-muted-foreground/40 size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
										<span className="bg-muted-foreground/40 size-1.5 animate-bounce rounded-full" />
									</span>
									<span className="text-xs">Thinking</span>
								</div>
							</div>
						)}

						<div ref={bottomRef} />
					</div>
				</ScrollArea>
			</CardContent>

			<CardFooter className="border-t">
				<form
					onSubmit={e => {
						e.preventDefault();
						sendMessage();
					}}
					className="flex w-full gap-2"
				>
					<Input
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder="Type your message…"
						disabled={sendMessageMutation.isPending}
						className="flex-1"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={!input.trim() || sendMessageMutation.isPending}
					>
						{sendMessageMutation.isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Send className="size-4" />
						)}
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
}

