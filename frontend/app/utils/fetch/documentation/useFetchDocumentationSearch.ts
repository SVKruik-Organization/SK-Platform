import type { DocumentationSearchResponse } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationSearch = async (version: string, language: string, query: string, limit: number, offset: number, scope: string): Promise<DocumentationSearchResponse> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            query: { query, limit, offset, scope },
            body: { endpoint: `/query/all/${version}/${language}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}

