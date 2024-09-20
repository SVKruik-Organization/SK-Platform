import type { DocumentationFile } from "~/assets/customTypes";
import { parseDocumentationFile } from "~/utils/documentation";

export const useFetchDocumentationPages = async (folder: string, version: string, language: string, type: string) => {
    const documentationPages = ref<DocumentationFile | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getFiles/${version}/${language}/${type}?folder=${folder}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationPages.value = await parseDocumentationFile(await response.json());
                } else documentationPages.value = false;
            } catch (error) {
                documentationPages.value = false;
            }
            resolve();
        });
    });

    return documentationPages;
}