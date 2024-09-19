import type { DocumentationSearchResponse } from "~/assets/customTypes";

export const useFetchDocumentationSearch = (version: string, language: string, query: string, limit: number, offset: number, scope: string) => {
    return useState('fetchDocumentationSearch', async (): Promise<DocumentationSearchResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/search/all/${version}/${language}?query=${query}&limit=${limit}&offset=${offset}&scope=${scope}`, {
                method: "GET"
            });
            if (response.ok) {
                return await response.json();
            } else if (response.status !== 429) return false;
            return true;
        } catch (error) {
            return false;
        }
    });
}

