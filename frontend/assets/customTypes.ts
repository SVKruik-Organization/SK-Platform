// User Details
export type UserData = {
    "username": string,
    "token": string,
}

// User Details
export type UserDataResponse = {
    "accessToken": string
}

// Date Formatter
export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date,
    "fullDate": string
}

// Prompt/Informational Message Types
export enum PromptTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger"
}

// Valid Page Types
export enum DocumentationTypes {
    doc = "Doc",
    guide = "Guide"
}

// Image Error Types
export enum ImageErrorTypes {
    icon = "icon",
    banner = "banner"
}

// Uplink Network Payload
export type UplinkMessage = {
    "sender": string,
    "recipient": string,
    "triggerSource": string,
    "reason": string,
    "task": string,
    "content": string,
    "timestamp": Date
}

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "size": number,
    "access_time": string,
    "modificationTime": string,
    "creationTime": string,
    "chapters": Array<string>,
    "description": string,
    "products": Array<DocumentationProduct>,
    "related": Array<RelatedItem>
}

// Raw File Index/TOC Item Response
export type DocumentationIndexResponse = {
    "index": Array<DocumentationIndexItem>
}

// Single Index/TOC Item
export type DocumentationIndexItem = {
    "categoryIcon": string
    "category": string,
    "children": Array<string>
}

//  Raw Page Categories Response
export type DocumentationCategoriesResponse = {
    "categories": Array<FolderItem>
}

// Single Folder Only
export type FolderItem = {
    "categoryIcon": string,
    "category": string
}

// Raw Recommended Item Response
export type DocumentationRecommendedItemsResponse = {
    "recommendedItems": Array<RecommendedItem>
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

// Documentation Readpage Related
export type RelatedItem = {
    "id": number,
    "category": string,
    "page": string,
    "title": string,
    "icon": string,
    "type": string,
    "description": string,
    "imageUrl": string | null
}

// Raw Full Refresh Response
export type DocumentationRefreshResponse = {
    "docIndex": Array<DocumentationIndexItem>,
    "guideIndex": Array<DocumentationIndexItem>,
    "recommendedDocItems": Array<RecommendedItem>,
    "recommendedGuideItems": Array<RecommendedItem>
}

// Raw Search Response
export type DocumentationSearchResponse = {
    "results": Array<SearchResultItem>,
    "count": number,
    "durationMs": number,
    "query": string,
    "offset": number
}

// Search Result Item
export type SearchResultItem = {
    "id": number,
    "type": string,
    "category": string,
    "content": string,
    "page": string,
}

// Vue Dropdowns Toggle State
export enum DropdownStates {
    version = "versionDropdownVisible",
    language = "languageDropdownVisible",
    information = "informationDropdownVisible",
    product = "productDropdownVisible",
    navigation = "navigationDropdownVisible",
    comment = "commentOverlayVisible",
}

// Documentation Chapter
export type DocChapterItem = {
    "title": string,
    "height": number,
    "active": boolean
}

// Documentation Product
export type DocumentationProduct = {
    "name": string,
    "url": string
}

export const IndexPlaceholder: Array<DocumentationIndexItem> = [{
    "categoryIcon": "",
    "category": "None_Available",
    "children": []
}]

export const RecommendedPlaceholder: Array<RecommendedItem> = [{
    "id": 1,
    "title": "None_Available",
    "anchor": null,
    "category": "",
    "page": "",
    "time": null,
    "icon": "",
    "type": ""
}];