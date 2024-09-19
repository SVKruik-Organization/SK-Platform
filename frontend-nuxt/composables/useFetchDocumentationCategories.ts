import type { DocumentationCategoriesResponse } from "~/assets/customTypes";

export const useFetchDocumentationCategories = (version: string, language: string, type: string) => {
    return useState('fetchDocumentationCategories', async (): Promise<DocumentationCategoriesResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/getCategories/${version}/${language}/${type}`, {
                method: "GET"
            });
            if (response.ok) {
                return await response.json();
            } return false;
        } catch (error) {
            return false;
        }
    });
}