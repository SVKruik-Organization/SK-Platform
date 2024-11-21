import type { DocumentationSearchResponse } from "~/assets/customTypes";

export const useFetchDocumentationSearch = async (version: string, language: string, query: string, limit: number, offset: number, scope: string): Promise<string | DocumentationSearchResponse> => {
    const documentationSearch = ref<string | DocumentationSearchResponse>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/search/all/${version}/${language}?query=${query}&limit=${limit}&offset=${offset}&scope=${scope}`, {
                    method: "GET"
                });
                if (response.ok) documentationSearch.value = await response.json();
            } catch (error) {
                documentationSearch.value = "An error occurred while fetching the search results.";
            }
            resolve();
        });
    });

    return documentationSearch.value;
}

