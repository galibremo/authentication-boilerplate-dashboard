export async function POST(req: Request) {
	const baseUrl = process.env.NEXT_PUBLIC_N8N_API_URL || "http://localhost:5678";
	const n8nUrl = `${baseUrl}/webhook/${process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_ID}`;

	const formData = await req.formData();
	const file = formData.get("data") as File;

	if (!file) {
		return Response.json({ message: "No file provided" }, { status: 400 });
	}

	// Read file as plain text and send directly
	const text = await file.text();

	const res = await fetch(n8nUrl, {
		method: "POST",
		body: text,
		headers: {
			"Content-Type": "text/plain"
		}
	});

	const data = await res.json().catch(() => ({}));
	return Response.json(data, { status: res.status });
}

