import type { DocumentationCategoriesResponse } from "~/assets/customTypes";

export const useFetchDocumentationCategories = async (version: string, language: string, type: string) => {
    const documentationCategories = ref<DocumentationCategoriesResponse | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getCategories/${version}/${language}/${type}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationCategories.value = await response.json();
                } else documentationCategories.value = false;
            } catch (error) {
                documentationCategories.value = false;
            }
            resolve();
        });
    });

    return documentationCategories;
}