import type { DocumentationFile, DocumentationIndexItem, DocumentationIndexResponse, UserDataResponse } from "@/assets/customTypes";

/**
 * Validates user session.
 * @returns True if still valid, false if not.
 */
export async function fetchBase(token: string): Promise<boolean> {
    try {
        const response = await fetch(import.meta.env.VITE_API_BASE, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch a JWT token if credentials are correct.
 * @returns Data or false on error.
 */
export async function fetchLogin(username: string, password: string): Promise<UserDataResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        if (response.ok) {
            return await response.json();
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch a specific Documentation page.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns Data or an error status text.
 */
export async function fetchDocumentationPage(folder: string, name: string, version: string, language: string): Promise<DocumentationFile | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getFile/${version}/${language}?folder=${folder}&name=${name}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return { "file": undefined }
        } else return false;
    } catch (error) {
        console.log(error);
        return false
    }
}

/**
 * Fetch the index/table of contents.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns Data or false on error.
 */
export async function fetchDocumentationIndex(version: string, language: string): Promise<DocumentationIndexResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getIndex/${version}/${language}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return { "index": [] };
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}