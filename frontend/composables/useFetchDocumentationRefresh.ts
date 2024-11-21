import type { DocumentationRefreshResponse } from "~/assets/customTypes";

export const useFetchDocumentationRefresh = async (version: string, language: string): Promise<string | DocumentationRefreshResponse> => {
    const documentationRefresh = ref<string | DocumentationRefreshResponse>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/refresh/${version}/${language}`, {
                    method: "GET"
                });
                if (response.ok) documentationRefresh.value = await response.json();
            } catch (error) {
                documentationRefresh.value = "Error";
            }
            resolve();
        });
    });

    return documentationRefresh.value;
}