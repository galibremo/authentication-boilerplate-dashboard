export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const sessionId = searchParams.get("sessionId");

	if (!sessionId) {
		return Response.json({ error: "sessionId is required" }, { status: 400 });
	}

	const baseUrl = process.env.NEXT_PUBLIC_N8N_API_URL || "http://localhost:5678";
	const n8nUrl = `${baseUrl}/webhook-test/${process.env.NEXT_PUBLIC_N8N_FETCH_CHAT_WEBHOOK_ID}`;

	const res = await fetch(`${n8nUrl}?sessionId=${encodeURIComponent(sessionId)}`, {
		method: "GET"
	});

	const text = await res.text();

	if (!res.ok) {
		console.error("N8N Fetch Error:", res.status, text);
		return Response.json({ error: text || "Failed to fetch chat history" }, { status: res.status });
	}

	return Response.json({ text }, { status: res.status });
}

