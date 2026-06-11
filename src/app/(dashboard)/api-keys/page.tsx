import ApiKeysPage from "@/features/api-keys/components/api-keys-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Api Keys",
	description: "Api keys page of the Next.js boilerplate."
};

export default function ApiKeys() {
	return <ApiKeysPage />;
}
