import type { DocumentationIndexItem } from "@/assets/customTypes";
import { formatError } from "@/utils/format";

export const useFetchDocumentationIndex = async (version: string, language: string, type: string): Promise<Array<DocumentationIndexItem>> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/getIndex/${version}/${language}/${type}`, {
            method: "GET"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}