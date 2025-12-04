import { logError } from "@svkruik/sk-platform-formatters";

/**
 * Custom error format for the frontend.
 */
export interface ApiError {
    statusCode: number;
    message: string;
}

/**
 * Formats an error for the frontend.
 * Specifically for backend errors.
 * @param error The error to handle.
 * @returns Formatted API error.
 */
export function formatApiError(error: any): ApiError {
    const statusCode = error?.cause?.statusCode || (() => { logError(error); return 500; })();
    const internalErrorMessage = "Something went wrong on our end. Please try again later.";
    const formattedErrorMessage = statusCode === 500 ? internalErrorMessage : error?.message || internalErrorMessage;

    return {
        statusCode: statusCode > 1000 ? statusCode - 1000 : statusCode,
        message: formattedErrorMessage
    };
}