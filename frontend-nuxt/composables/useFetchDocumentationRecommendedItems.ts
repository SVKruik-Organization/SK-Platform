import type { DocumentationRecommendedItemsResponse } from "~/assets/customTypes";

export const useFetchDocumentationRecommendedItems = async (language: string, type: string) => {
    const documentationRecommendedItems = ref<DocumentationRecommendedItemsResponse | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getRecommendedItems/${language}/${type}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationRecommendedItems.value = await response.json();
                } else documentationRecommendedItems.value = false;
            } catch (error) {
                documentationRecommendedItems.value = false;
            }
            resolve();
        });
    });

    return documentationRecommendedItems;
}