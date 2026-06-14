export async function DELETE() {
	const chromaUrl = process.env.NEXT_PUBLIC_CHROMA_URL || "http://localhost:8000";
	const collection = process.env.NEXT_PUBLIC_N8N_COLLECTION_NAME || "office_dataset";
	const base = `${chromaUrl}/api/v2/tenants/default_tenant/databases/default_database`;

	try {
		const delRes = await fetch(`${base}/collections/${collection}`, {
			method: "DELETE"
		});

		if (delRes.ok) {
			return Response.json({
				success: true,
				message: `Collection "${collection}" deleted successfully.`
			});
		}

		if (delRes.status === 404) {
			return Response.json({
				success: true,
				message: "Collection does not exist, nothing to delete."
			});
		}

		const err = await delRes.text().catch(() => "unknown");
		return Response.json({ success: false, message: err }, { status: delRes.status });
	} catch (err: any) {
		return Response.json({ success: false, message: err.message }, { status: 500 });
	}
}

