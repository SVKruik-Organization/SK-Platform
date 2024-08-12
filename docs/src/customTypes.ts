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
    "creation_time": Date,
    "chapters": Array<string>
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

// Search All Pages Request
export type SearchAllRequest = {
    "index": string,
    "query": string,
    "limit": string | undefined,
    "offset": string | undefined,
}

// Search Specific Page Request
export type SearchPageRequest = {
    "index": string,
    "query": string,
    "type": string,
    "category": string,
    "page": string,
    "limit": string | undefined,
    "offset": string | undefined
}

// Pre-Read Seed Item
export type SeedItem = {
    "type": string,
    "category": string,
    "children": Array<string>
}

// Read Seed Item
export type SeedIndexItem = {
    "id": number,
    "type": string,
    "category": string,
    "page": string,
    "content": string
}

// Uplink Network Payload
export type UplinkMessage = {
    "sender": string,
    "recipient": string,
    "trigger_source": string,
    "reason": string,
    "task": string,
    "content": string,
    "timestamp": Date
}