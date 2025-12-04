import type { DocumentationSearchResponse } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationSearch = async (version: string, language: string, query: string, limit: number, offset: number, scope: string): Promise<DocumentationSearchResponse> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/search/all/${version}/${language}?query=${query}&limit=${limit}&offset=${offset}&scope=${scope}`, {
            method: "GET"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}

