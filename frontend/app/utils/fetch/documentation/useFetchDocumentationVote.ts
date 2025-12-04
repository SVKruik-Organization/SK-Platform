import { formatError } from "~/utils/format";

export const useFetchDocumentationVote = async (version: string, language: string, value: boolean, type: string | null, category: string | null, page: string | null, ticket: string): Promise<void> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/votes/new/${version}/${language}?value=${value}&type=${type}&category=${category}&page=${page}&ticket=${ticket}`, {
            method: "POST"
        });
    } catch (error: any) {
        throw formatError(error);
    }
}