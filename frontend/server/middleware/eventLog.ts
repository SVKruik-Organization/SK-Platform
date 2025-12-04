import { logData, logError } from "@svkruik/sk-platform-formatters";

export default defineEventHandler(async (event) => {
    // Only for CUD operations
    if (event.node.req.method !== "GET") {
        try {
            const data = {
                objectType: "not-logged-in",
                objectId: null as number | null,
                description: null as string | null,
                endpoint: event.node.req.url || null,
            }
            logData(`New request: ${JSON.stringify(data)}`, "info");
        } catch (error: any) {
            logError(error);
        }
    };
});