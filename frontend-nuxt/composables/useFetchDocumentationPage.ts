import type { DocumentationFile } from "~/assets/customTypes";
import { parseDocumentationFile } from "~/utils/documentation";

export const useFetchDocumentationPage = (folder: string, name: string, version: string, language: string, type: string) => {
    return useState('fetchDocumentationPage', async (): Promise<DocumentationFile | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/getFile/${version}/${language}/${type}?folder=${folder}&name=${name}`, {
                method: "GET"
            });
            if (response.ok) {
                return parseDocumentationFile(await response.json());
            } else return false;
        } catch (error) {
            return false
        }
    });
}