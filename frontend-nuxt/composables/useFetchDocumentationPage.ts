import type { DocumentationFile } from "~/assets/customTypes";
import { parseDocumentationFile } from "~/utils/documentation";

export const useFetchDocumentationPage = async (folder: string, name: string, version: string, language: string, type: string) => {
    const documentationPage = ref<DocumentationFile | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getFile/${version}/${language}/${type}?folder=${folder}&name=${name}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationPage.value = await parseDocumentationFile(await response.json());
                } else documentationPage.value = false;
            } catch (error) {
                documentationPage.value = false;
            }
            resolve();
        });
    });

    return documentationPage;
}