/**
 * Badging for README's etc.
 * 
 * @see https://shields.io/
 */
export default defineEventHandler((): object | undefined => {
    return {
        "schemaVersion": 1,
        "label": "SK Platform Status",
        "message": "online",
        "color": "brightgreen"
    }
});