import type { DocumentationFile } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationFile = async (version: string, language: string, type: string, folder: string, name?: string): Promise<DocumentationFile> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            query: { folder, name },
            body: { endpoint: `/getFile/${version}/${language}/${type}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}