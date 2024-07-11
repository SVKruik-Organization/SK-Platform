// Get File
export type FileRequest = {
    "folder": string,
    "name": string
}

// File Index/TOC Item
export type IndexItem = {
    "category": string,
    "children": Array<string>
}