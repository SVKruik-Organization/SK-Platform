import type { DocumentationFile } from "~/assets/customTypes";

/**
 * Convert the API response to a DocumentationFile typed object.
 * @param input Raw documentation file.
 * @returns The usable parsed DocumentationFile.
 */
export async function parseDocumentationFile(input: any): Promise<DocumentationFile | null> {
    if (!input || !input.file) return null;

    return {
        "name": input.file.name,
        "fileContents": input.file.fileContents,
        "description": input.file.description,
        "size": input.file.size,
        "viewCount": input.file.viewCount,
        "accessTime": getDate(input.file.accessTime).fullDate,
        "modificationTime": getDate(input.file.modificationTime).fullDate,
        "creationTime": getDate(input.file.creationTime).fullDate,
        "chapters": input.file.chapters,
        "products": input.file.products,
        "related": input.file.related
    }
}
