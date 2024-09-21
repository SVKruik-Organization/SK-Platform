import type { DocumentationFile, DocumentationProduct, RelatedItem } from "~/assets/customTypes";

/**
 * Convert the API response to a DocumentationFile typed object.
 * @param input Raw documentation file.
 * @param type Documentation (Doc) or Guides (Guide)
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @returns The usable parsed DocumentationFile.
 */
export async function parseDocumentationFile(input: any): Promise<DocumentationFile> {
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
    const documentationStore = useDocumentationStore();
    const index = await documentationStore.getIndex(false, "Doc");

    // Valid Products
    const validBots: Array<string> = ["Apricaria", "Stelleri", "Ispidina", "Interpres"];
    const vOneValidBots: Array<string> = ["Luscinia", "Ciconia"];
    const products: Array<string> = index.find((item) => item.category === "Products")?.children || [];
    const services: Array<string> = index.find((item) => item.category === "Services")?.children || [];

    rawProducts.forEach((product: string) => {
        let productURL: string = "/documentation/read/Doc/";
        let folder: string = "Products";
        if (validBots.includes(product)) {
            productURL += `Products/Bots#${product}`;
        } else if (vOneValidBots.includes(product)) {
            productURL += `More/V_One#${product}`;
        } else if (products.includes(product)) {
            productURL += `Products/${product}`;
        } else if (services.includes(product)) {
            productURL += `Services/${product}`;
            folder = "Services";
        }

        if (!documentationStore.validatePage(folder, product, "Doc")) productURL = "#";
        parsedProducts.push({
            "name": product,
            "url": productURL
        });
    });
    return parsedProducts;
}