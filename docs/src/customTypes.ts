// Get File
export type FileRequest = {
    "folder": string,
    "name": string
}

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "size": number,
    "access_time": Date,
    "modification_time": Date,
    "creation_time": Date
}

// Get Files
export type FilesRequest = {
    "folder": string
}

// File Index/TOC Item
export type IndexItem = {
    "category_icon": string,
    "category": string,
    "children": Array<string>
}

// Folder-Only
export type FolderItem = {
    "category_icon": string,
    "category": string
}

// Documentation Homepage Recommended
export type RecommendedItem = {
    "id": number,
    "category": string,
    "page": string,
    "title": string,
    "anchor": string,
    "icon": string,
    "time": number
}