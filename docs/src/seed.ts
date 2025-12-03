import { Dirent, readdirSync, readFileSync, writeFileSync } from "fs";
import { SeedIndexItem, SeedItem } from "./customTypes";
import { logData } from "@svkruik/sk-platform-formatters";
logData("Starting search index export.", "info");

// Command Arguments Setup
const args: Array<string> = process.argv.slice(2);
if (args.length < 2) throw new Error("Invalid amount of command arguments provided. Requires valid version@0 and language@1.");

// Version Setup
const version: string = args[0].replace("..", "");
const validVersions: Array<string> = ["v1"];
if (!validVersions.includes(version)) throw new Error("Invalid version provided.");

// Language Setup
const language: string = args[1].replace("..", "");
const validLanguages: Array<string> = ["en-US"];
if (!validLanguages.includes(language)) throw new Error("Invalid language provided.");
const validFullLanguages: Array<string> = ["English"];
const humanLanguage: string = validFullLanguages[validLanguages.indexOf(language)];

// Overwrite Setup
const overwrite: string = args[2];
const validOverwrites: Array<string> = ["w", "ax"];
if (!validOverwrites.includes(overwrite)) throw new Error("Invalid overwrite option provided. Use 'w' to enable overwriting existing files, 'ax' to disable.");

// Root Folder
logData(`Search indexing export in version ${version} in ${humanLanguage}@${language}.`, "info");
const rootFolders: Array<Dirent> = readdirSync(`${__dirname}/../data/html/${version}/${language}`, {
    withFileTypes: true
}).filter(entity => entity.isDirectory());

// Index Items
// Types (Doc, Guide)
const seedItems: Array<SeedItem> = [];
for (const rootFolder of rootFolders) {
    logData(`Reading ${rootFolder.name} sub-folder.`, "info");
    const subRoots: Array<Dirent> = readdirSync(`${__dirname}/../data/html/${version}/${language}/${rootFolder.name}`, {
        withFileTypes: true
    }).filter(entity => entity.isDirectory());

    // Categories (Get Started, Products)
    for (const subRoot of subRoots) {
        seedItems.push({
            "type": rootFolder.name,
            "category": subRoot.name,

            // Individual HTML Files
            "children": readdirSync(`${__dirname}/../data/html/${version}/${language}/${rootFolder.name}/${subRoot.name}`, {
                withFileTypes: true
            }).filter(entity => entity.isFile() && entity.name.endsWith(".html")).map(file => file.name)
        });
    }
}

// Read Files
const index: Array<SeedIndexItem> = [];
let seedItemIndex: number = 1;
for (let i = 0; i < seedItems.length; i++) {
    const seedItem = seedItems[i];

    for (let j = 0; j < seedItem.children.length; j++) {
        const file = seedItem.children[j];
        index.push({
            "id": seedItemIndex++,
            "type": seedItem.type,
            "category": seedItem.category.slice(3).replace(/_/g, " "),
            "page": file.slice(3, -5).replace(/_/g, " "),
            "content": readFileSync(`${__dirname}/../data/html/${version}/${language}/${seedItem.type}/${seedItem.category}/${file}`, "utf-8")
                .replace(/(<([^>]+)>)/ig, "") // HTML
                .replace(/\\./ig, "").trim() // Escape Characters
        });
    }
}

// Write Output
try {
    writeFileSync(`${__dirname}/../exports/${version}_${language}.json`, JSON.stringify(index).replace(/\\n\s*/ig, " "), {
        "encoding": "utf-8",
        "flag": overwrite
    });
    logData(`Successfully wrote Documentation index to the exports directory: ../exports/${version}_${language}.json`, "info");
} catch (error: any) {
    if (error.code === "EEXIST") throw new Error("File already exists, and overwriting is disabled with option 'ax'. Use 'w' to overwrite existing files.");
    console.error(error);
}

