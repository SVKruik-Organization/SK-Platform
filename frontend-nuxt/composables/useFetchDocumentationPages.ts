import type { DocumentationFile } from "~/assets/customTypes";
import { parseDocumentationFile } from "~/utils/documentation";

export const useFetchDocumentationPages = (folder: string, version: string, language: string, type: string) => {
    return useState('fetchDocumentationPages', async (): Promise<DocumentationFile | boolean> => {
        try {
            const runtimeConfig = useRuntimeConfig();
            const response = await fetch(`${runtimeConfig.public.docsApiBase}/getFiles/${version}/${language}/${type}?folder=${folder}`, {
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