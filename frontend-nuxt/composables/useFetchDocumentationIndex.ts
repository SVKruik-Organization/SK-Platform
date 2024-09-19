import type { DocumentationIndexResponse } from "~/assets/customTypes";

export const useFetchDocumentationIndex = (version: string, language: string, type: string) => {
    return useState('fetchDocumentationIndex', async (): Promise<DocumentationIndexResponse | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/getIndex/${version}/${language}/${type}`, {
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