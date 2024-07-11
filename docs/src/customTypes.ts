// Get File
export type FileRequest = {
    "folder": string,
    "name": string
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