import { formatError } from "@/utils/format";

export const useFetchDocumentationVote = async (version: string, language: string, value: boolean, type: string | null, category: string | null, page: string | null, ticket: string): Promise<void> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            query: { value, type, category, page, ticket },
            body: { endpoint: `/votes/new/${version}/${language}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}