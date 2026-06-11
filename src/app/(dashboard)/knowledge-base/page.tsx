import KnowledgeBasePage from "@/features/knowledge-base/components/knowledge-base-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Knowledge Base",
    description: "Knowledge base page of the Next.js boilerplate."
};

export default function KnowledgeBase() {
    return <KnowledgeBasePage />;
}
