import type { DocumentationSearchResponse } from "~/assets/customTypes";

export const useFetchDocumentationSearch = async (version: string, language: string, query: string, limit: number, offset: number, scope: string) => {
    const documentationSearch = ref<DocumentationSearchResponse | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/search/all/${version}/${language}?query=${query}&limit=${limit}&offset=${offset}&scope=${scope}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationSearch.value = await response.json();
                } else if (response.status !== 429) documentationSearch.value = false;
            } catch (error) {
                documentationSearch.value = false;
            }
            resolve();
        });
    });

    return documentationSearch;
}

