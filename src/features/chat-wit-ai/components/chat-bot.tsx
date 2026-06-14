"use client";

import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
	role: "user" | "bot";
	text: string;
};

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
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [sessionId] = useState(getSessionId);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!sessionId) return;

		const fetchHistory = async () => {
			try {
				const res = await fetch(`/api/n8n-fetch-chat?sessionId=${sessionId}`);
				const data = await res.json();

				if (res.ok && data.text) {
					let parsed: Message[] = [];

					try {
						const json = JSON.parse(data.text);

						if (Array.isArray(json)) {
							parsed = json.map((m: any) => ({
								role: m.role === "user" ? "user" : "bot",
								text: m.text || m.message || m.content || ""
							}));
						} else if (json.messages && Array.isArray(json.messages)) {
							parsed = json.messages.map((m: any) => ({
								role: m.role === "user" ? "user" : "bot",
								text: m.text || m.message || m.content || ""
							}));
						}
					} catch {
						if (data.text.trim()) {
							parsed = [{ role: "bot", text: data.text }];
						}
					}

					if (parsed.length) {
						setMessages(parsed);
					}
				}
			} catch (err) {
				console.error("Failed to load chat history:", err);
			}
		};

		fetchHistory();
	}, [sessionId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		const question = input.trim();
		if (!question || loading) return;

		setMessages(prev => [...prev, { role: "user", text: question }]);
		setInput("");
		setLoading(true);

		try {
			const res = await fetch("/api/n8n-chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chatInput: question, sessionId })
			});

			const data = await res.json();

			setMessages(prev => [...prev, { role: "bot", text: data.text || "No response" }]);
		} catch {
			setMessages(prev => [...prev, { role: "bot", text: "Error: Could not reach N8N." }]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="mx-auto flex h-140 w-full max-w-2xl flex-col shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center gap-2.5 text-base">
					<Sparkles className="text-primary size-4" />
					AI Assistant
				</CardTitle>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden border-y px-0">
				<ScrollArea className="h-full">
					<div className="space-y-4 p-5">
						{messages.length === 0 && (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="bg-muted/60 mb-4 flex size-12 items-center justify-center rounded-full">
									<Bot className="text-muted-foreground size-6" />
								</div>
								<p className="text-muted-foreground text-sm font-medium">
									Ask anything about Apple Tree Gents Parlour
								</p>
								<p className="text-muted-foreground/70 mt-1 text-xs">
									Get instant answers powered by AI
								</p>
							</div>
						)}

						{messages.map((msg, i) => (
							<div
								key={i}
								className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
							>
								<Avatar size="sm" className="mt-0.5 shrink-0">
									<AvatarFallback>
										{msg.role === "user" ? (
											<User className="size-3.5" />
										) : (
											<Bot className="size-3.5" />
										)}
									</AvatarFallback>
								</Avatar>

								<div
									className={cn(
										"max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
										msg.role === "user"
											? "bg-primary text-primary-foreground rounded-tr-sm"
											: "bg-muted text-foreground rounded-tl-sm"
									)}
								>
									{msg.text}
								</div>
							</div>
						))}

						{loading && (
							<div className="flex gap-3">
								<Avatar size="sm" className="mt-0.5 shrink-0">
									<AvatarFallback>
										<Bot className="size-3.5" />
									</AvatarFallback>
								</Avatar>
								<div className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
									<Loader2 className="size-3.5 animate-spin" />
									Thinking…
								</div>
							</div>
						)}

						<div ref={bottomRef} />
					</div>
				</ScrollArea>
			</CardContent>

			<CardFooter>
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
						disabled={loading}
						className="flex-1"
					/>
					<Button type="submit" size="icon" disabled={!input.trim() || loading}>
						{loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
}

