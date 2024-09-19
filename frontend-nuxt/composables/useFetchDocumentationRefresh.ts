import type { DocumentationRefreshResponse } from "~/assets/customTypes";

export const useFetchDocumentationRefresh = (version: string, language: string) => {
    return useState('fetchDocumentationRefresh', async (): Promise<DocumentationRefreshResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/refresh/${version}/${language}`, {
                method: "GET"
            });
            if (response.ok) {
                return await response.json();
            } else return false;
        } catch (error) {
            return false
        }
    });
}