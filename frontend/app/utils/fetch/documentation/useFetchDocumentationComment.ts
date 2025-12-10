import { formatError } from "@/utils/format";

export const useFetchDocumentationComment = async (ticket: string, comment: string): Promise<void> => {
    try {
        return await $fetch("/api/docs_proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            query: { ticket, comment },
            body: { endpoint: "/votes/comment" }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}