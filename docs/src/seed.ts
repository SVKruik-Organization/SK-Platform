import { Dirent, readdirSync } from "fs";
import path from "path";
import { log } from "./utils/logger";
log("Starting search index export.", "info");

// Command Arguments Setup
const args: Array<string> = process.argv.slice(2);
if (args.length < 2) throw new Error("Invalid amount of command arguments provided. Requires valid version@0 and language@1.");

// Version Setup
const version: string = args[0];
const validVersions: Array<string> = ["v1"];
if (!validVersions.includes(version)) throw new Error("Invalid version provided.");

// Language Setup
const language: string = args[1];
const validLanguages: Array<string> = ["en-US"];
if (!validLanguages.includes(language)) throw new Error("Invalid language provided.");
const validFullLanguages: Array<string> = ["English"];
const humanLanguage: string = validFullLanguages[validLanguages.indexOf(language)];

// Root Folder
log(`Search indexing export in version ${version} in ${humanLanguage}@${language}.`, "info");
const rootFolders: Array<Dirent> = readdirSync(`${__dirname}/../data/html/${version}/${language}`, {
    withFileTypes: true
}).filter(entity => entity.isDirectory());

// Sub-Folders
for (const folder of rootFolders) {
    log(`Reading ${folder.name} sub-folder.`, "info");
    const subFolder: Array<Dirent> = readdirSync(`${__dirname}/../data/html/${version}/${language}/${folder.name}`, {
        withFileTypes: true
    }).filter(entity => entity.isDirectory());
    console.log(subFolder);
}

