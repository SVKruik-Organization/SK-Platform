import type { DocumentationRefreshResponse } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationRefresh = async (version: string, language: string): Promise<DocumentationRefreshResponse> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { endpoint: `/refresh/${version}/${language}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}