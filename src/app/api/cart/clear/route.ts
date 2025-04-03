import { pool, createResponse, createErrorResponse } from "../../utils/db";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    // Delete all items from cart for the user
    await pool.query(
      "DELETE FROM cart WHERE UserId = ?",
      [userId]
    );

    return createResponse({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse("Failed to clear cart");
  }
} 