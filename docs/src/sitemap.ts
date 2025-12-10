import { Dirent, readdirSync, Stats, statSync, writeFileSync } from "fs";
import { SitemapFile } from "./customTypes";
import { logData } from "@svkruik/sk-platform-formatters";
const XMLWriter = require('xml-writer');

// Setup
const baseURL = "https://platform.stefankruik.com/documentation";
logData("Starting sitemap export.", "info");

/**
 * Formats a date into a YYYY-MM-DD format.
 * @param overwriteDate Overwrite the format date.
 * @returns YYYY-MM-DD formatted date.
 */
function dateFormatter(overwriteDate: Date | null): string {
    let date: Date = overwriteDate || new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

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

// Documenation Folders
const documentationTypes: Array<Dirent> = readdirSync(`${__dirname}/../data/pages/${version}/${language}`, {
    withFileTypes: true
}).filter(entity => entity.isDirectory());
logData(`Found ${documentationTypes.length} documentation types.`, "info");

// Categories
let categories: Array<Dirent> = [];
documentationTypes.forEach((folder: Dirent) => {
    categories = categories.concat(readdirSync(`${__dirname}/../data/pages/${version}/${language}/${folder.name}`, {
        withFileTypes: true
    }).filter(entity => entity.isDirectory()));
});
logData(`Found ${categories.length} categories.`, "info");

// Raw Pages
let rawPages: Array<Dirent> = [];
categories.forEach((folder: Dirent) => {
    const split = folder.parentPath.split("/");
    const type = split[split.length - 1];
    rawPages = rawPages.concat(readdirSync(`${__dirname}/../data/pages/${version}/${language}/${type}/${folder.name}`, {
        withFileTypes: true
    }).filter(entity => entity.isFile() && entity.name.endsWith(".html")));
});

// Processed Pages
let pages: Array<SitemapFile> = [];
rawPages.forEach((page: Dirent) => {
    const split = page.parentPath.split("/");
    const type = split[split.length - 2];
    const category = split[split.length - 1];
    const metadata: Stats = statSync(`${__dirname}/../data/pages/${version}/${language}/${type}/${category}/${page.name}`);

    pages.push({
        "url": `https://platform.stefankruik.com/documentation/read/${type}/${category.slice(3)}${page.name === "00_Default.html" ? "" : `/${page.name.slice(3, -5)}`}`,
        "modificationDate": dateFormatter(new Date(metadata.mtime))
    });
});
pages.unshift({
    "url": baseURL,
    "modificationDate": dateFormatter(null)
});
logData(`Found ${pages.length} pages.`, "info");

// XML
const xw = new XMLWriter(true);
xw.startDocument().startElement('urlset').writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

pages.forEach((page: SitemapFile) => {
    xw.startElement('url')
        .writeElement('loc', page.url)
        .writeElement('lastmod', page.modificationDate);
    if (page.url === baseURL) {
        xw.writeElement('changefreq', 'weekly')
            .writeElement('priority', '1.0')
            .endElement();
    } else {
        xw.writeElement('changefreq', 'monthly')
            .writeElement('priority', '0.8')
            .endElement();
    }
});
xw.endElement().endDocument();
const xml: string = xw.toString();
logData(`Exporting sitemap with ${xml.length} characters.`, "info");

// Write Output
writeFileSync(`${__dirname}/../exports/${version}_${language}_sitemap.xml`, xml, {
    "encoding": "utf-8",
    "flag": "w"
});

logData(`Successfully wrote sitemap to the exports directory: ../exports/${version}_${language}_sitemap.xml`, "info");
