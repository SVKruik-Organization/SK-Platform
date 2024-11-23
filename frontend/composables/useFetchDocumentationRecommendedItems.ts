import type { DocumentationRecommendedItemsResponse } from "~/assets/customTypes";

export const useFetchDocumentationRecommendedItems = async (language: string, type: string): Promise<string | DocumentationRecommendedItemsResponse> => {
    const documentationRecommendedItems = ref<string | DocumentationRecommendedItemsResponse>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getRecommendedItems/${language}/${type}`, {
                    method: "GET"
                });
                if (response.ok) documentationRecommendedItems.value = await response.json();
            } catch (error: any) {
                documentationRecommendedItems.value = "Something went wrong while fetching the recommended items. Please try again later.";
            }
            resolve();
        });
    });

    return documentationRecommendedItems.value;
}