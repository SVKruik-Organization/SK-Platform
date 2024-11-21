export const useFetchDocumentationComment = async (ticket: string, comment: string): Promise<string | number> => {
    const documentationComment = ref<string | number>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
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
                if (response.ok) documentationComment.value = 200;
            } catch (error) {
                documentationComment.value = "Error";
            }
            resolve();
        });
    });

    return documentationComment.value;
}