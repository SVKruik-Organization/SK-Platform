export const useFetchDocumentationVote = async (version: string, language: string, value: boolean, type: string | null, category: string | null, page: string | null, ticket: string): Promise<string | number> => {
    const documentationVote = ref<string | number>("Error");
    await new Promise<void>(async (resolve) => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/votes/new/${version}/${language}?value=${value}&type=${type}&category=${category}&page=${page}&ticket=${ticket}`, {
                method: "POST"
            });
            if (response.ok) documentationVote.value = 200;
        } catch (error) {
            documentationVote.value = "Error";
        }
        resolve();
    });

    return documentationVote.value;
}