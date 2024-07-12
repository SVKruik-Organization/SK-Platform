// User Details
export type UserData = {
    "username": string,
    "token": string,
}

// User Details
export type UserDataResponse = {
    "access_token": string
}

// JavaScript Types
export enum ObjectTypes {
    bigint = "bigint",
    boolean = "boolean",
    function = "function",
    number = "number",
    object = "object",
    string = "string",
    symbol = "symbol",
    undefined = "undefined"
}

// Date Formatter
export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date
}

// Prompt/Informational Message Types
export enum PromptTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger"
}

// Documentation File
export type DocumentationFile = {
    "file": string
}

// Raw File Index/TOC Item Response
export type DocumentationIndexResponse = {
    "index": Array<DocumentationIndexItem>
}

// File Index/TOC Item
export type DocumentationIndexItem = {
    "category_icon": string
    "category": string,
    "children": Array<string>
}

export type DocumentationCategoriesRepsponse = {
    "categories": Array<FolderItem>
}

// Folder-Only
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
    "anchor": string,
    "icon": string,
    "time": number
}