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

// Documentation Product
export type DocumentationProduct = {
    "name": string,
    "url": string
}

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "description": string,
    "size": number,
    "viewCount": number,
    "accessTime": Date,
    "modificationTime": Date,
    "creationTime": Date,
    "chapters": Array<string>,
    "products": Array<DocumentationProduct>,
    "related": Array<RelatedItem>
}

// Raw Documentation Readpage Related
export type RawRelatedItem = {
    "id": number
    "type": string
    "category": string
    "name": string
    "products": string
    "related": string
    "icon": string
    "view_count": number
}

// Documentation Readpage Related
export type RelatedItem = {
    "id": number,
    "category": string,
    "page": string,
    "icon": string,
    "type": string,
    "imageUrl": string | null
}

// Get Files
export type FilesRequest = {
    "folder": string
}

// File Index/TOC Item
export type IndexItem = {
    "categoryIcon": string,
    "category": string,
    "children": Array<string>
}

// Folder-Only
export type FolderItem = {
    "categoryIcon": string,
    "category": string
}

// Documentation Homepage Recommended
export type RecommendedItem = {
    "id": number,
    "category": string,
    "page": string,
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

// Sitemap Export Item
export type SitemapFile = {
    "url": string,
    "modificationDate": string
}

// Validation Object
export type UrlParams = {
    "version": string,
    "language": string,
    "type": string
}