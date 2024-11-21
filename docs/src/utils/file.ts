import { Dirent, readdirSync, readFileSync, Stats, statSync } from "fs";
import { logError } from "./logger";
import { DocumentationFileParent, IndexItem, RecommendedItem } from "../customTypes";
import { parse } from "node-html-parser";
import { queryDatabase } from "./networking";

/**
 * Fetch a specific Documentation page from the file system.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns HTML data as string or status code on error.
 */
export async function getFile(folder: string, name: string, version: string, language: string, type: string): Promise<DocumentationFileParent | number> {
    try {
        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language, type);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        const rawFile: Array<Dirent> = readdirSync(`${__dirname}/../../data/html/${version}/${language}/${type}/${rawFolders[0].name}`, { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name !== "00_Default.html" && entity.name.slice(3, -5) === name);
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

        // Retrieve & Send File
        const fileMetaData: Stats = statSync(`${rawFile[0].parentPath}/${rawFile[0].name}`);
        const databaseMetaData: Array<any> | number = await queryDatabase("SELECT * FROM documentation_page WHERE category = ? AND name = ? UNION ALL SELECT dp.* FROM documentation_page dp JOIN ( SELECT related FROM documentation_page WHERE category = ? AND name = ?) AS target_related ON FIND_IN_SET(dp.id, target_related.related) > 0;", [folder, name, folder, name]);
        if (typeof databaseMetaData === "number") return databaseMetaData;
        return {
            "file": {
                "name": rawFile[0].name,
                "fileContents": fileContents,
                "size": fileMetaData.size,
                "viewCount": 0,
                "accessTime": new Date(fileMetaData.atimeMs),
                "modificationTime": new Date(fileMetaData.mtimeMs),
                "creationTime": new Date(fileMetaData.birthtimeMs),
                "chapters": chapters,
                "description": root.querySelector(".page-description")?.innerText.replace(/\\n/g, " ").replace(/\s+/g, " ") || ""
            },
            "metadata": databaseMetaData
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
 * Fetch the landing page for a specific category.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @param type Documentation (Doc) or Guides (Guide)
 * @returns HTML data as string or status code on error.
 */
export async function getDefaultFile(folder: string, version: string, language: string, type: string): Promise<DocumentationFileParent | number> {
    try {
        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language, type);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        const rawFile: Array<Dirent> = readdirSync(`${__dirname}/../../data/html/${version}/${language}/${type}/${rawFolders[0].name}`, { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name === "00_Default.html");
        if (rawFile.length === 0) return 404;
        const fileContents: string = readFileSync(`${rawFile[0].parentPath}/${rawFile[0].name}`, "utf8");
        const root = parse(fileContents);

        // Retrieve & Send File
        const fileMetaData: Stats = statSync(`${rawFile[0].parentPath}/${rawFile[0].name}`);
        const databaseMetaData: Array<any> | number = await queryDatabase("SELECT * FROM documentation_page WHERE category = ? AND name = 'Default' UNION ALL SELECT dp.* FROM documentation_page dp JOIN ( SELECT related FROM documentation_page WHERE category = ? AND name = 'Default') AS target_related ON FIND_IN_SET(dp.id, target_related.related) > 0;", [folder, folder]);
        if (typeof databaseMetaData === "number") return databaseMetaData;
        return {
            "file": {
                "name": rawFile[0].name,
                "fileContents": fileContents,
                "size": fileMetaData.size,
                "viewCount": 0,
                "accessTime": new Date(fileMetaData.atimeMs),
                "modificationTime": new Date(fileMetaData.mtimeMs),
                "creationTime": new Date(fileMetaData.birthtimeMs),
                "chapters": [],
                "description": root.querySelector(".page-description")?.innerText.replace(/\\n/g, " ").replace(/\s+/g, " ") || ""
            },
            "metadata": databaseMetaData
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
                "children": readdirSync(folderPath).filter(fileName => fileName.endsWith(".html") && fileName !== "00_Default.html").map(fileName => fileName.slice(3, -5))
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