"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
	role: "user" | "bot";
	text: string;
};

export default function ChatBot() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

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
				body: JSON.stringify({ chatInput: question })
			});

			const data = await res.json();

			setMessages(prev => [...prev, { role: "bot", text: data.text || "No response" }]);
		} catch (err) {
			setMessages(prev => [...prev, { role: "bot", text: "Error: Could not reach N8N." }]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto flex h-120 w-2xl flex-col overflow-hidden rounded-lg border">
			{/* Messages */}
			<div className="flex-1 space-y-3 overflow-y-auto p-4">
				{messages.length === 0 && (
					<p className="mt-8 text-center text-sm text-gray-400">
						Ask anything about Apple Tree Gents Parlour
					</p>
				)}
				{messages.map((msg, i) => (
					<div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
						<div
							className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
								msg.role === "user"
									? "rounded-br-sm bg-black text-white"
									: "rounded-bl-sm bg-gray-100 text-gray-800"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				{loading && (
					<div className="flex justify-start">
						<div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm text-gray-400">
							thinking…
						</div>
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<div className="flex gap-2 border-t p-3">
				<input
					type="text"
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => e.key === "Enter" && sendMessage()}
					placeholder="Type your message…"
					className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-300"
				/>
				<button
					onClick={sendMessage}
					disabled={!input.trim() || loading}
					className="rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Send
				</button>
			</div>
		</div>
	);
}

