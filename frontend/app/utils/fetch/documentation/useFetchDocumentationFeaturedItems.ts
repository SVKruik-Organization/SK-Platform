import type { FeaturedItem } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationFeaturedItems = async (language: string, type: string): Promise<Array<FeaturedItem>> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/getFeaturedItems/${language}/${type}`, {
            method: "GET"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}