import type { DocumentationIndexItem } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationIndex = async (version: string, language: string, type: string): Promise<Array<DocumentationIndexItem>> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { endpoint: `/getIndex/${version}/${language}/${type}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}