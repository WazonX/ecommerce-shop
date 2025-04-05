import { pool, createResponse, createErrorResponse } from "../utils/db";

export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT Id as id, Name as name FROM category"
        );

        return createResponse({ categories: rows });
    } catch (error) {
        console.error("Database Error:", error);
        return createErrorResponse("Failed to fetch categories");
    }
} 