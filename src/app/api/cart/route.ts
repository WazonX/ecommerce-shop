import { pool, createResponse, createErrorResponse } from "../utils/db";

function processImageData(rows: any[]): any[] {
    return rows.map((row) => ({
        ...row,
        image: row.image ? row.image.toString("base64") : null,
    }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const [rows] = await pool.query(
      `SELECT 
        p.Id as id,
        p.Title as title,
        p.Price as price,
        p.Description as description,
        p.Discount as discount,
        p.Image as image,
        p.Rating as rating
       FROM product p
       INNER JOIN cart c ON p.Id = c.ProductId
       WHERE c.UserId = ?`,
      [userId]
    );

    const processedRows = processImageData(rows as any[]);
    return createResponse(processedRows);
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to fetch cart items");
  }
} 