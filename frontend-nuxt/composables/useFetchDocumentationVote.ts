export const useFetchDocumentationVote = (version: string, language: string, value: boolean, type: string | null, category: string | null, page: string | null, ticket: string) => {
    return useState('fetchDocumentationVote', async (): Promise<boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/votes/new/${version}/${language}?value=${value}&type=${type}&category=${category}&page=${page}&ticket=${ticket}`, {
                method: "POST"
            });
            if (response.ok) {
                return true;
            } else return false;
        } catch (error) {
            return false;
        }
    });
}