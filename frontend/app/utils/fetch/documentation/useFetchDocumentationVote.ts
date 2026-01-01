import { formatError } from "@/utils/format";

export const useFetchDocumentationVote = async (version: string, language: string, value: boolean, ticket: string, type?: string, category?: string, page?: string): Promise<void> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            query: { value, type, category, page, ticket },
            body: { endpoint: `/votes/new/${version}/${language}`, method: "POST" }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}