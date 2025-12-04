import type { DocumentationRefreshResponse } from "@/assets/customTypes";
import { formatError } from "~/utils/format";

export const useFetchDocumentationRefresh = async (version: string, language: string): Promise<DocumentationRefreshResponse> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/refresh/${version}/${language}`, {
            method: "GET"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}