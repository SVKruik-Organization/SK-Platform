import type { DocumentationCategoriesResponse, DocumentationFile, DocumentationIndexResponse, DocumentationProduct, DocumentationRecommendedItemsResponse, DocumentationRefreshResponse, RecommendedItem, RelatedItem, UserDataResponse } from "@/assets/customTypes";
import { getDate } from "./date";
import { useDocumentationStore } from '@/stores/DocumentationStore';

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
        return false;
    }
}

/**
 * Refresh both indices & recommended items in one fetch.
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @returns Data or false on error.
 */
export async function fetchDocumentationRefresh(version: string, language: string): Promise<DocumentationRefreshResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/refresh/${version}/${language}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return false;
        } else return false;
    } catch (error) {
        return false
    }
}

/**
 * Fetch a specific Documentation page.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns HTML data as string or false on error.
 */
export async function fetchDocumentationPage(folder: string, name: string, version: string, language: string, type: string): Promise<DocumentationFile | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getFile/${version}/${language}/${type}?folder=${folder}&name=${name}`, {
            method: "GET"
        });
        if (response.ok) {
            return parseDocumentationFile(await response.json());
        } else if (response.status === 404) {
            return true;
        } else return false;
    } catch (error) {
        return false
    }
}

/**
 * Fetch all pages for a specific category.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns List of pages for the category or status code on error.
 */
export async function fetchDocumentationPages(folder: string, version: string, language: string, type: string): Promise<DocumentationFile | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getFiles/${version}/${language}/${type}?folder=${folder}`, {
            method: "GET"
        });
        if (response.ok) {
            return parseDocumentationFile(await response.json());
        } else if (response.status === 404) {
            return false;
        } else return false;
    } catch (error) {
        return false
    }
}

/**
 * Fetch the landing page for a specific category.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns HTML data as string or false on error.
 */
export async function fetchDocumentationDefault(folder: string, version: string, language: string, type: string): Promise<DocumentationFile | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getDefault/${version}/${language}/${type}?folder=${folder}`, {
            method: "GET"
        });
        if (response.ok) {
            return parseDocumentationFile(await response.json());
        } else if (response.status === 404) {
            return false;
        } else return false;
    } catch (error) {
        return false
    }
}

/**
 * Fetch the index/table of contents.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns Data or false on error.
 */
export async function fetchDocumentationIndex(version: string, language: string, type: string): Promise<DocumentationIndexResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getIndex/${version}/${language}/${type}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return { "index": [{ "category": "Not_Found", "category_icon": "", "children": [] }] };
        } else return false;
    } catch (error) {
        return false;
    }
}

/**
 * Fetch the current recommended items.
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns Data or false on error.
 */
export async function fetchRecommendedItems(language: string, type: string): Promise<DocumentationRecommendedItemsResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getRecommendedItems/${language}/${type}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return { "recommended_items": [{ "title": "Not_Found", "anchor": "", "category": "", "id": 1, "page": "", "time": 1, "icon": "", "type": "" }] };
        } else return false;
    } catch (error) {
        return false;
    }
}

/**
 * Fetch the icons and names of the categories.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns Data or status code on error.
 */
export async function fetchDocumentationCategories(version: string, language: string, type: string): Promise<DocumentationCategoriesResponse | boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_DOCS_API_BASE}/getCategories/${version}/${language}/${type}`, {
            method: "GET"
        });
        if (response.ok) {
            return await response.json();
        } else if (response.status === 404) {
            return { "categories": [] };
        } else return false;
    } catch (error) {
        return false;
    }
}

/**
 * Convert the API response to a DocumentationFile typed object.
 * @param input Raw documentation file.
 * @param type Documentation (Doc) or Guides (Guide)
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @returns The usable parsed DocumentationFile.
 */
async function parseDocumentationFile(input: any): Promise<DocumentationFile> {
    return {
        "name": input.file.name,
        "fileContents": input.file.fileContents,
        "size": input.file.size,
        "access_time": getDate(input.file.access_time).fullDate,
        "modification_time": getDate(input.file.modification_time).fullDate,
        "creation_time": getDate(input.file.creation_time).fullDate,
        "chapters": input.file.chapters,
        "description": input.meta ? input.meta.description : "",
        "products": (input.meta && input.meta.products) ? await parseDocumentationProducts(input) : [],
        "related": parseRelatedItems(input.related)
    }
}

/**
 * Convert the API response to a RecommendedItem typed object.
 * @param input Raw related items from the database.
 * @returns The processed related items.
 */
function parseRelatedItems(input: any): Array<RelatedItem> {
    if (!input) return [];
    const relatedItems: Array<RelatedItem> = [];
    input.forEach((item: any) => {
        // Random Product Image
        let imageUrl: string | null = null;
        if (item.products !== "") {
            const parsedProducts: Array<string> = item.products.split(",");
            const randomProduct: string = parsedProducts[Math.floor(Math.random() * parsedProducts.length)];
            imageUrl = `https://files.stefankruik.com/Products/100/${randomProduct}.png`;
        }

        relatedItems.push({
            "id": item.id,
            "category": item.category,
            "page": item.name,
            "title": item.name,
            "icon": item.icon,
            "type": item.type,
            "description": item.description,
            "image_url": imageUrl
        });
    });
    return relatedItems;
}

/**
 * Convert the API response to a DocumentationProduct typed object.
 * @param input The raw product string from the database.
 * @returns The list of products with their documentation URLs.
 */
async function parseDocumentationProducts(input: any): Promise<DocumentationProduct[]> {
    // Setup
    const rawProducts: Array<string> = input.meta.products.split(",");
    const parsedProducts: Array<DocumentationProduct> = [];
    const store = useDocumentationStore();
    const index = await store.getIndex(false, "Doc");

    // Valid Products
    const validBots: Array<string> = ["Apricaria", "Stelleri", "Ispidina", "Interpres"];
    const products: Array<string> = index.find((item) => item.category === "Products")?.children || [];
    const services: Array<string> = index.find((item) => item.category === "Services")?.children || [];

    rawProducts.forEach((product: string) => {
        let productURL: string = "/documentation/read/Doc/";
        let folder: string = "Products";
        if (validBots.includes(product)) {
            productURL += `Products/Discord-Bots#${product}`;
        } else if (products.includes(product)) {
            productURL += `Products/${product}`;
        } else if (services.includes(product)) {
            productURL += `Services/${product}`;
            folder = "Services";
        }

        if (!store.validatePage(folder, product, "Doc")) productURL = "#";
        parsedProducts.push({
            "name": product,
            "url": productURL
        });
    });
    return parsedProducts;
}