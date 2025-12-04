import type { DocumentationRecommendedItemsResponse } from "@/assets/customTypes";
import { formatError } from "~/utils/format";

export const useFetchDocumentationRecommendedItems = async (language: string, type: string): Promise<DocumentationRecommendedItemsResponse> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/getRecommendedItems/${language}/${type}`, {
            method: "GET"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}