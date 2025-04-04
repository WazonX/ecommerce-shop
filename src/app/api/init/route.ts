import { createResponse, createErrorResponse } from "../utils/db";
import { createAdminUser, createCartTable, createCommentsTable } from "../utils/initDb";

export async function POST() {
    try {
        await createAdminUser();
        await createCartTable();
        await createCommentsTable();
        return createResponse({ message: "Database initialized successfully" });
    } catch (error) {
        console.error("Database Initialization Error:", error);
        return createErrorResponse("Failed to initialize database");
    }
} 