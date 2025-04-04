import { pool, createResponse, createErrorResponse } from "../utils/db";

// Get comments for a product
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return createErrorResponse("Product ID is required", 400);
        }

        console.log('Fetching comments for product ID:', productId);

        const [rows] = await pool.query(
            `SELECT 
                c.Id as id,
                c.Text as text,
                c.Rating as rating,
                u.FirstName as firstName,
                u.LastName as lastName
            FROM comments c
            INNER JOIN user u ON c.UserId = u.Id
            INNER JOIN product p ON c.ProductId = p.Id
            WHERE p.Id = ?
            `,
            [productId]
        );

        console.log('Found comments:', rows);

        return createResponse({ comments: rows });
    } catch (error) {
        console.error("Database Error:", error);
        return createErrorResponse("Failed to fetch comments");
    }
}

// Add a new comment
export async function POST(request: Request) {
    try {
        const { userId, productId, text, rating } = await request.json();

        if (!userId || !productId || !text || rating === undefined) {
            return createErrorResponse("Missing required fields", 400);
        }

        if (rating < 1 || rating > 5) {
            return createErrorResponse("Rating must be between 1 and 5", 400);
        }

        console.log('Adding comment:', { userId, productId, text, rating });

        const [result] = await pool.query(
            "INSERT INTO comments (UserId, ProductId, Text, Rating) VALUES (?, ?, ?, ?)",
            [userId, productId, text, rating]
        );

        const insertResult = result as any;
        const commentId = insertResult.insertId;

        const [rows] = await pool.query(
            `SELECT 
                c.Id as id,
                c.Text as text,
                c.Rating as rating,
                u.FirstName as firstName,
                u.LastName as lastName
            FROM comments c
            INNER JOIN user u ON c.UserId = u.Id
            WHERE c.Id = ?`,
            [commentId]
        );

        const comments = rows as any[];
        if (comments.length === 0) {
            return createErrorResponse("Failed to create comment", 500);
        }

        console.log('Created comment:', comments[0]);

        return createResponse({ 
            message: "Comment added successfully", 
            comment: comments[0] 
        });
    } catch (error) {
        console.error("Database Error:", error);
        return createErrorResponse("Failed to add comment");
    }
} 