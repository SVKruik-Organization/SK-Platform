// User Details
export type UserData = {
    "username": string,
    "token": string,
}

// User Details
export type UserDataResponse = {
    "access_token": string
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

// Single Documentation File
export type DocumentationFile = {
    "name": string,
    "fileContents": string,
    "size": number,
    "access_time": string,
    "modification_time": string,
    "creation_time": string,
    "chapters": Array<string>,
    "description": string,
    "products": Array<DocumentationProduct>,
    "related": Array<RecommendedItem>
}

// Raw File Index/TOC Item Response
export type DocumentationIndexResponse = {
    "index": Array<DocumentationIndexItem>
}

// Single Index/TOC Item
export type DocumentationIndexItem = {
    "category_icon": string
    "category": string,
    "children": Array<string>
}

//  Raw Page Categories Response
export type DocumentationCategoriesResponse = {
    "categories": Array<FolderItem>
}

// Single Folder Only
export type FolderItem = {
    "category_icon": string,
    "category": string
}

// Raw Recommended Item Response
export type DocumentationRecommendedItemsResponse = {
    "recommended_items": Array<RecommendedItem>
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

// Raw Full Refresh Response
export type DocumentationRefreshResponse = {
    "docIndex": Array<DocumentationIndexItem>,
    "guideIndex": Array<DocumentationIndexItem>,
    "recommendedDocItems": Array<RecommendedItem>,
    "recommendedGuideItems": Array<RecommendedItem>
}

// Vue Dropdowns Toggle State
export enum DropdownStates {
    version = "versionDropdownVisible",
    language = "languageDropdownVisible",
    information = "informationDropdownVisible",
    product = "productDropdownVisible",
    navigation = "navigationDropdownVisible"
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