import { pool, createResponse, createErrorResponse } from "../utils/db";

export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT Id as id, Email as email, FirstName as firstName, LastName as lastName, Country as country, City as city, ZipCode as zipCode, Street as street FROM user"
        );

        const users = rows as any[];
        return createResponse({ users });
    } catch (error) {
        console.error("Database Error:", error);
        return createErrorResponse("Failed to fetch users");
    }
} 