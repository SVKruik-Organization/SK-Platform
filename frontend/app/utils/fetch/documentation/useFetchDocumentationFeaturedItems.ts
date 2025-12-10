import type { FeaturedItem } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationFeaturedItems = async (language: string, type: string): Promise<Array<FeaturedItem>> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { endpoint: `/getFeaturedItems/${language}/${type}` }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}