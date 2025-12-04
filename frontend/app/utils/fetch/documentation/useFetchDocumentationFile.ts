import type { DocumentationFile } from "~/assets/customTypes";
import { formatError } from "~/utils/format";

export const useFetchDocumentationFile = async (version: string, language: string, type: string, folder: string, name: string): Promise<DocumentationFile> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/getFile/${version}/${language}/${type}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            params: { folder, name }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}