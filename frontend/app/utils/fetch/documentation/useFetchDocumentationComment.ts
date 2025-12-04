import { formatError } from "~/utils/format";

export const useFetchDocumentationComment = async (ticket: string, comment: string): Promise<void> => {
    try {
        const runtimeConfig = useRuntimeConfig();
        return await $fetch(`${runtimeConfig.public.docsApiBase}/votes/comment?ticket=${ticket}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: { comment }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}