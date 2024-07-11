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
    "file": string | undefined
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