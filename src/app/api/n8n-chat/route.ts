export async function POST(req: Request) {
	const { chatInput } = await req.json();
	const baseUrl = process.env.N8N_CHAT_WEBHOOK || "http://localhost:5678";
	const n8nUrl = `${baseUrl}/webhook/${process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_ID}`;

	const res = await fetch(n8nUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			chatInput
		})
	});

	const text = await res.text();

	if (!res.ok) {
		console.error("N8N Error:", res.status, text);
		return Response.json({ error: text || "N8N request failed" }, { status: res.status });
	}

	// N8N returns plain text, not JSON
	return Response.json({ text }, { status: res.status });
}

