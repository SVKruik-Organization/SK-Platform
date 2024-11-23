import { Dirent, readdirSync, readFileSync, Stats, statSync } from "fs";
import { logError } from "./logger";
import { DocumentationFile, DocumentationProduct, IndexItem, RawRelatedItem, RecommendedItem, RelatedItem } from "../customTypes";
import { parse } from "node-html-parser";
import { queryDatabase } from "./networking";

/**
 * Fetch a specific Documentation page from the file system.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @param newFetch Whether to update the view count in the database.
 * @returns HTML data as string or status code on error.
 */
export async function getFile(folder: string, name: string, version: string, language: string, type: string, newFetch: boolean): Promise<DocumentationFile | number> {
    try {
        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language, type);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        const rawFile: Array<Dirent> = readdirSync(`${__dirname}/../../data/html/${version}/${language}/${type}/${rawFolders[0].name}`, { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name.slice(3, -5) === name);
        if (rawFile.length === 0) return 404;
        const fileContents: string = readFileSync(`${rawFile[0].parentPath}/${rawFile[0].name}`, "utf8");

        // Retrieve Chapters
        const root = parse(fileContents);
        const chapters: Array<string> = root.querySelectorAll("a.chapter")
            .reduce((acc: Array<string>, link) => {
                const href = link.getAttribute("href");
                if (href) acc.push(href);
                return acc;
            }, []);

        // Retrieve Local File Data
        const fileMetaData: Stats = statSync(`${rawFile[0].parentPath}/${rawFile[0].name}`);

        // Query & View Count
        let query = "SELECT * FROM documentation_page WHERE type = ? AND category = ? AND name = ? UNION ALL SELECT dp.* FROM documentation_page dp JOIN ( SELECT related FROM documentation_page WHERE type = ? AND category = ? AND name = ?) AS target_related ON FIND_IN_SET(dp.id, target_related.related) > 0;";
        if (newFetch) query += " UPDATE documentation_page SET view_count = view_count + 1 WHERE type = ? AND category = ? AND name = ?;";

        // Retrieve Database File Data
        const rawDatabaseMetaData: Array<any> | number = await queryDatabase(query, [type, folder, name, type, folder, name, type, folder, name]);
        if (typeof rawDatabaseMetaData === "number") return rawDatabaseMetaData;
        const databaseMetaData = newFetch ? rawDatabaseMetaData[0] : rawDatabaseMetaData;
        return {
            "name": rawFile[0].name,
            "fileContents": fileContents,
            "size": fileMetaData.size,
            "viewCount": 0,
            "accessTime": new Date(fileMetaData.atimeMs),
            "modificationTime": new Date(fileMetaData.mtimeMs),
            "creationTime": new Date(fileMetaData.birthtimeMs),
            "chapters": chapters,
            "description": root.querySelector(".page-description")?.innerText.replace(/\\n/g, " ").replace(/\s+/g, " ") || "",
            "products": databaseMetaData.length ? parseDocumentationProducts(databaseMetaData[0].products, version, language) : [],
            "related": databaseMetaData.length ? parseRelatedItems(databaseMetaData.slice(1), databaseMetaData[0].products) : []
        }
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return 404;
        } else {
            logError(error);
            return 500;
        }
    }
}

/**
 * Fetch the index/table of contents.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns Data or status code on error.
 */
export function getIndex(version: string, language: string, type: string): Array<IndexItem> | number {
    try {
        // Retrieve Folder Names
        const rawFolders: Array<string> = readdirSync(`${__dirname}/../../data/html/${version}/${language}/${type}`, { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => directory.name);

        // Retrieve & Format Files
        const index: Array<IndexItem> = [];
        for (const rawFolderName of rawFolders) {
            const folderPath = `${__dirname}/../../data/html/${version}/${language}/${type}/${rawFolderName}`;
            const indexItem: IndexItem = {
                "categoryIcon": getFolderIcon(rawFolderName.slice(3)),
                "category": rawFolderName.slice(3),
                "children": readdirSync(folderPath).filter((fileName: string) => fileName.endsWith(".html")).map(fileName => fileName.slice(3, -5))
            }
            index.push(indexItem);
        }
        return index;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return 404;
        } else {
            logError(error);
            return 500;
        }
    }
}

/**
 * Read the contents of a specified directory.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns The folders in Dirent format.
 */
function readDirectory(folder: string, version: string, language: string, type: string): Array<Dirent> {
    return readdirSync(`${__dirname}/../../data/html/${version}/${language}/${type}`, { withFileTypes: true })
        .filter(entity => entity.isDirectory() && entity.name.slice(3) === folder);
}

/**
 * Get the icon for the specified folder/category.
 * @param name The folder name excluding order number including underscores.
 * @returns 
 */
export function getFolderIcon(name: string): string {
    switch (name) {
        // Docs
        case "Get_Started":
            return "fa-rocket-launch";
        case "Products":
            return "fa-conveyor-belt";
        case "Services":
            return "fa-tower-cell";
        case "Community":
            return "fa-users";
        case "Developers":
            return "fa-code";
        case "Operator":
            return "fa-user-crown";
        case "Parties":
            return "fa-user-group-crown";
        case "Operations":
            return "fa-gear";
        case "Contributing":
            return "fa-handshake-angle";
        case "Plans":
            return "fa-gem";
        case "More":
            return "fa-cloud";
        case "Legal":
            return "fa-scale-balanced"

        // Guides
        case "Technical":
            return "fa-compass-drafting";
        case "Management":
            return "fa-chart-mixed";
        case "Customization":
            return "fa-swatchbook"
        case "Self_Hosting":
            return "fa-server"
        default:
            return "fa-check";
    }
}

/**
 * Retrieve recommended items from the JSON file.
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns The current recommended items.
 */
export function getRecommendedItems(language: string, type: string): Array<RecommendedItem> | number {
    try {
        return JSON.parse(readFileSync(`${__dirname}/../../data/json/${language}/${type}.json`, "utf8"));
    } catch (error: any) {
        return 404;
    }
}

/**
 * Convert the API response to a RecommendedItem typed object.
 * @param rawRelatedItems Raw related items from the database.
 * @param rawProducts Raw products from the database.
 * @returns The processed related items.
 */
function parseRelatedItems(rawRelatedItems: Array<RawRelatedItem>, rawProducts: string): Array<RelatedItem> {
    const relatedItems: Array<RelatedItem> = [];
    rawRelatedItems.forEach((item: RawRelatedItem) => {
        // Random Product Image
        let imageUrl: string | null = null;
        if (rawProducts !== "") {
            const parsedProducts: Array<string> = rawProducts.split(",");
            const randomProduct: string = parsedProducts[Math.floor(Math.random() * parsedProducts.length)];
            imageUrl = `https://files.stefankruik.com/Products/100/${randomProduct}.png`;
        }

        relatedItems.push({
            "id": item.id,
            "category": item.category,
            "page": item.name,
            "icon": item.icon,
            "type": item.type,
            "imageUrl": imageUrl
        });
    });
    return relatedItems;
}

/**
 * Convert the API response to a DocumentationProduct typed object.
 * @param input The raw product string from the database.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns The list of products with their documentation URLs.
 */
function parseDocumentationProducts(input: string, version: string, language: string): Array<DocumentationProduct> {
    // Setup
    const rawProducts: Array<string> = input.split(",");
    if (rawProducts.length === 0) return [];
    const parsedProducts: Array<DocumentationProduct> = [];
    const index = getIndex(version, language, "Doc");
    if (typeof index === "number") throw new Error(index.toString());

    // Valid Products
    const validBots: Array<string> = ["Apricaria", "Stelleri", "Ispidina", "Interpres"];
    const vOneValidBots: Array<string> = ["Luscinia", "Ciconia"];
    const products: Array<string> = index.find((item: any) => item.category === "Products")?.children || [];
    const services: Array<string> = index.find((item: any) => item.category === "Services")?.children || [];

    rawProducts.forEach((product: string) => {
        let productURL: string = "/documentation/read/Doc/";
        if (validBots.includes(product)) {
            productURL += `Products/Bots#${product}`;
        } else if (vOneValidBots.includes(product)) {
            productURL += `More/V_One#${product}`;
        } else if (products.includes(product)) {
            productURL += `Products/${product}`;
        } else if (services.includes(product)) {
            productURL += `Services/${product}`;

            // Exclude Invalid Products
        } else return;

        parsedProducts.push({
            "name": product,
            "url": productURL
        });
    });

    // Filter Duplicate Products
    if (parsedProducts.length > 1) {
        return parsedProducts.filter((product, index, self) => self.findIndex(p => p.name === product.name) === index);
    } else return parsedProducts;
}