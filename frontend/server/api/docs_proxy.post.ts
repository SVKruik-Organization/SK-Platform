import { z } from "zod";
import { formatApiError } from "@/utils/format";

// Validation schema for the request body
const bodySchema = z.object({
    endpoint: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
});

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The endpoint and/or method are missing.", { cause: { statusCode: 1400 } });
        const { endpoint, method } = parseResult.data;
        const config = useRuntimeConfig();

        let payload: {
            method: "GET" | "POST" | "PUT" | "DELETE";
            headers: Record<string, string>;
            body?: Record<string, any>;
            query?: Record<string, any>;
        } = {
            method: method,
            headers: {
                "Authorization": `Bearer ${config.docsApiKey}`,
                "Content-Type": "application/json",
            },
            body: {},
            query: {}
        }

        const query = Object.assign({}, getQuery(event));
        if (method === "GET") {
            payload.query = query;
            delete payload.body;
        } else {
            payload.body = query
            delete payload.query;
        }
        return await $fetch(`${config.docsApiBase}${endpoint}`, payload);
    } catch (error: any) {
        throw formatApiError(error);
    }
});