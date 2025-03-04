import type { DocumentationIndexResponse } from "~/assets/customTypes";

export const useFetchDocumentationIndex = async (version: string, language: string, type: string): Promise<string | DocumentationIndexResponse> => {
    const documentationIndex = ref<string | DocumentationIndexResponse>("Error");
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getIndex/${version}/${language}/${type}`, {
                    method: "GET"
                });
                if (response.ok) documentationIndex.value = await response.json();
            } catch (error: any) {
                documentationIndex.value = "Something went wrong while fetching the documentation index. Please try again later.";
            }
            resolve();
        });
    });

    return documentationIndex.value;
}