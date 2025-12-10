// User Details
export type UserData = {
    "username": string,
    "token": string,
}

// User Details
export type UserDataResponse = {
    "accessToken": string
}

// HTML Head Link
export type HeadLink = {
    "rel": string,
    "href": string
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

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "size": number,
    "viewCount": number,
    "accessTime": string,
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

// Raw Featured Item Response
export type DocumentationFeaturedItemsResponse = {
    "featuredItems": Array<FeaturedItem>
}

// Documentation Homepage Featured
export type FeaturedItem = {
    "id": number,
    "category": string,
    "page": string,
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
    "icon": string,
    "type": string,
    "imageUrl": string | null
}

// Raw Full Refresh Response
export type DocumentationRefreshResponse = {
    "docIndex": Array<DocumentationIndexItem>,
    "guideIndex": Array<DocumentationIndexItem>,
    "featuredDocItems": Array<FeaturedItem>,
    "featuredGuideItems": Array<FeaturedItem>
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
    theme = "themeDropdownVisible",
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

// Documentation Category Placeholder
export const IndexPlaceholder: Array<DocumentationIndexItem> = [{
    "categoryIcon": "",
    "category": "None_Available",
    "children": []
}];

// Documentation Folder Placeholder
export const FeaturedPlaceholder: Array<FeaturedItem> = [{
    "id": 1,
    "anchor": null,
    "category": "None_Available",
    "page": "None_Available",
    "time": null,
    "icon": "",
    "type": ""
}];

// Toast Message Item
export type ToastItem = {
    "id": string,
    "type": ToastTypes,
    "duration": number,
    "message": string
}

// Toast Message Types
export enum ToastTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger"
}