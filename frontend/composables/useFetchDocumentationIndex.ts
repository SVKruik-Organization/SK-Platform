import type { DocumentationIndexResponse } from "~/assets/customTypes";

export const useFetchDocumentationIndex = async (version: string, language: string, type: string) => {
    const documentationIndex = ref<DocumentationIndexResponse | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getIndex/${version}/${language}/${type}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationIndex.value = await response.json();
                } else documentationIndex.value = false;
            } catch (error) {
                documentationIndex.value = false;
            }
            resolve();
        });
    });

    return documentationIndex;
}