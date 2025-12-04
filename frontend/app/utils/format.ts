import { H3Error } from "h3";
import { logError } from "@svkruik/sk-platform-formatters";

/**
 * Formats an H3 (backend) error for the popup.
 * Use this function only in the backend.
 * Specifically for backend errors.
 * @param error The error to handle.
 * @returns Formatted H3 error.
 */
export function formatApiError(error: any): H3Error {
    const statusCode = error?.cause?.statusCode || (() => { logError(error); return 500; })();
    const internalErrorMessage = "Something went wrong on our end. Please try again later.";
    const formattedErrorMessage = statusCode === 500 ? internalErrorMessage : error?.message || internalErrorMessage;
    return createError({
        "statusCode": statusCode > 1000 ? statusCode - 1000 : statusCode,
        "message": formattedErrorMessage
    });
}

/**
 * Formats an error for the popup notification.
 * @param error The error to handle.
 */
export function formatError(error: any): Error {
    if (!error.statusCode) { // Unknown error
        return createError({
            "statusCode": 500,
            "message": "Something went wrong. Please try again later.",
        });
    } else return createError({
        "statusCode": error.statusCode,
        "message": error?.data?.message || error?.message || "Something went wrong. Please try again later.",
    });
};
