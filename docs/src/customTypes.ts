// Get File
export type FileRequest = {
    "folder": string,
    "name": string
}

// Cast Vote
export type VoteRequest = {
    "ticket": string,
    "value": boolean,
    "type": string | null,
    "category": string | null,
    "page": string | null
}

// Add Comment
export type CommentRequest = {
    "ticket": string,
    "commment": string
}

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "size": number,
    "access_time": Date,
    "modification_time": Date,
    "creation_time": Date,
    "chapters": Array<string>,
    "description": string
}

// Database-Persisted Metadata
export type DocumentationFileMetadata = {
    "description": string,
    "products": string,
    "related": string
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
    "anchor": string | null,
    "icon": string,
    "time": number | null,
    "type": string
}

// Search All Pages Request
export type SearchAllRequest = {
    "query": string,
    "limit": string | undefined,
    "offset": string | undefined,
    "scope": string
}

// Search Specific Page Request
export type SearchPageRequest = {
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

// Sitemap Export Item
export type SitemapFile = {
    "url": string,
    "modificationDate": string
}