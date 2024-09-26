export const useFetchDocumentationComment = async (ticket: string, comment: string) => {
    const documentationComment = ref<boolean>(false);
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
                if (response.ok) {
                    documentationComment.value = true;
                } else documentationComment.value = false;
            } catch (error) {
                documentationComment.value = false;
            }
            resolve();
        });
    });

    return documentationComment;
}