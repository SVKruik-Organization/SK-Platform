import fs, { Dirent } from "fs";
import path from "path";
import { logError } from "./logger";
import { FolderItem, IndexItem } from "../customTypes";

/**
 * Fetch a specific Documentation page from the file system.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param name The name of the specific HTML file to retrieve, without `.html`. Examples: Introduction, Collaborating
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns HTML data as string or status code on error.
 */
export function getFile(folder: string, name: string, version: string, language: string): string | number {
    try {
        // TODO: Add metadata (GitHub/Git API?)

        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        const rawFile: Array<Dirent> = fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}/${rawFolders[0].name}`), { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name !== "0_Default.html" && entity.name.slice(2, -5) === name);
        if (rawFile.length === 0) return 404;

        // Retrieve & Send File
        return fs.readFileSync(`${rawFile[0].parentPath}/${rawFile[0].name}`, "utf8");
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
 * Fetch all pages for a specific category.
 * @param folder The name of the folder with underscores instead of spaces. Examples: Get_Started, Community
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns List of pages for the category or status code on error.
 */
export function getFiles(folder: string, version: string, language: string): Array<string> | number {
    try {
        // TODO: Add metadata (GitHub/Git API?)

        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        return fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}/${rawFolders[0].name}`), { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name !== "0_Default.html")
            .map(file => file.name.slice(2, -5));
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
 * @returns HTML data as string or status code on error.
 */
export function getDefaultFile(folder: string, version: string, language: string): string | number {
    try {
        // TODO: Add metadata (GitHub/Git API?)

        // Retrieve Correct Folder
        const rawFolders: Array<Dirent> = readDirectory(folder, version, language);
        if (rawFolders.length === 0) return 404;

        // Retrieve Correct File
        const rawFile: Array<Dirent> = fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}/${rawFolders[0].name}`), { withFileTypes: true })
            .filter(entity => entity.isFile() && entity.name === "0_Default.html");
        if (rawFile.length === 0) return 404;

        // Retrieve & Send File
        return fs.readFileSync(`${rawFile[0].parentPath}/${rawFile[0].name}`, "utf8");
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
 * @returns Data or status code on error.
 */
export function getIndex(version: string, language: string): Array<IndexItem> | number {
    try {
        // Retrieve Folder Names
        const rawFolders: Array<string> = fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}`), { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => directory.name);

        // Retrieve & Format Files
        const index: Array<IndexItem> = [];
        for (const rawFolderName of rawFolders) {
            const folderPath = path.join(__dirname, `../../html/${version}/${language}/${rawFolderName}`);
            const indexItem: IndexItem = {
                "category_icon": getFolderIcon(rawFolderName.slice(2)),
                "category": rawFolderName.replace("_", " ").slice(2),
                "children": fs.readdirSync(folderPath).filter(fileName => fileName.endsWith(".html") && fileName !== "0_Default.html").map(fileName => fileName.slice(2, -5))
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
 * Fetch the icons and names of the categories.
 * @param version The version number of the index. Examples: v1, v2
 * @param language The language of the documentation. Examples: en-US, nl-NL
 * @returns Data or status code on error.
 */
export function getCategories(version: string, language: string): Array<FolderItem> | number {
    try {
        // Retrieve & Format Folder Names
        return fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}`), { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => {
                return {
                    "category_icon": getFolderIcon(directory.name.slice(2)),
                    "category": directory.name.replace("_", " ").slice(2)
                }
            });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return 404;
        } else {
            logError(error);
            return 500;
        }
    }
}

function readDirectory(folder: string, version: string, language: string): Array<Dirent> {
    return fs.readdirSync(path.resolve(__dirname, `../../html/${version}/${language}`), { withFileTypes: true })
        .filter(entity => entity.isDirectory() && entity.name.slice(2) === folder);
}

/**
 * Get the icon for the specified folder/category.
 * @param name The folder name excluding order number.
 * @returns 
 */
export function getFolderIcon(name: string): string {
    switch (name) {
        case "Community":
            return "fa-users";
        case "Developers":
            return "fa-code";
        case "Get_Started":
            return "fa-rocket-launch";
        case "Operations":
            return "fa-gear";
        case "Operator":
            return "fa-user-crown";
        case "Parties":
            return "fa-user-group-crown";
        case "Plans":
            return "fa-gem";
        case "Products":
            return "fa-conveyor-belt";
        case "Other":
            return "fa-cloud";
        default:
            return "fa-check";
    }
}