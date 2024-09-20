import type { DocumentationRefreshResponse } from "~/assets/customTypes";

export const useFetchDocumentationRefresh = async (version: string, language: string) => {
    const documentationRefresh = ref<DocumentationRefreshResponse | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/refresh/${version}/${language}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationRefresh.value = await response.json();
                } else documentationRefresh.value = false;
            } catch (error) {
                documentationRefresh.value = false;
            }
            resolve();
        });
    });

    return documentationRefresh;
}