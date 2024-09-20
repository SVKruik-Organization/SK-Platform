import type { DocumentationFile } from "~/assets/customTypes";
import { parseDocumentationFile } from "~/utils/documentation";

export const useFetchDocumentationDefault = async (folder: string, version: string, language: string, type: string) => {
    const documentationDefault = ref<DocumentationFile | boolean>(false);
    await new Promise<void>(async (resolve) => {
        watchEffect(async () => {
            try {
                const runtimeConfig = useRuntimeConfig();
                const response = await fetch(`${runtimeConfig.public.docsApiBase}/getDefault/${version}/${language}/${type}?folder=${folder}`, {
                    method: "GET"
                });
                if (response.ok) {
                    documentationDefault.value = await parseDocumentationFile(await response.json());
                } else documentationDefault.value = false;
            } catch (error) {
                documentationDefault.value = false;
            }
            resolve();
        });
    });

    return documentationDefault;
}