import type { DocumentationRecommendedItemsResponse } from "~/assets/customTypes";

export const useFetchDocumentationRecommendedItems = (language: string, type: string) => {
    return useState('fetchDocumentationRecommendedItems', async (): Promise<DocumentationRecommendedItemsResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/getRecommendedItems/${language}/${type}`, {
                method: "GET"
            });
            if (response.ok) {
                return await response.json();
            } else return false;
        } catch (error) {
            return false;
        }
    });
}