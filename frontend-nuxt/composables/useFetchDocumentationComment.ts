export const useFetchDocumentationComment = (ticket: string, comment: string) => {
    return useState('fetchDocumentationComment', async (): Promise<boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/votes/comment?ticket=${ticket}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "comment": comment
                })
            });
            if (response.ok) {
                return true;
            } else return false;
        } catch (error) {
            return false;
        }
    });
}