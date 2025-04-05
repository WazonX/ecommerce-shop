import { pool, createResponse, createErrorResponse } from "../../utils/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const [rows] = await pool.query(
      "SELECT Id as id, Email as email, Country as country, City as city, ZipCode as zipCode, Street as street, FirstName as firstName, LastName as lastName FROM user WHERE Id = ?",
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return createErrorResponse("User not found", 404);
    }

    return createResponse({ user: users[0] });
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to fetch user information");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    // First check if the user exists
    const [existingUsers] = await pool.query(
      "SELECT Id FROM user WHERE Id = ?",
      [userId]
    );

    const users = existingUsers as any[];
    if (users.length === 0) {
      return createErrorResponse("User not found", 404);
    }

    // Delete the user
    await pool.query(
      "DELETE FROM user WHERE Id = ?",
      [userId]
    );

    return createResponse({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to delete user");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { country, city, zipCode, street } = await request.json();

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    if (!country || !city || !zipCode || !street) {
      return createErrorResponse("All address fields are required", 400);
    }

    await pool.query(
      "UPDATE user SET Country = ?, City = ?, ZipCode = ?, Street = ? WHERE Id = ?",
      [country, city, zipCode, street, userId]
    );

    const [rows] = await pool.query(
      "SELECT Country as country, City as city, ZipCode as zipCode, Street as street FROM user WHERE Id = ?",
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return createErrorResponse("User not found", 404);
    }

    return createResponse({ user: users[0] });
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to update address");
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { firstName, lastName, email, country, city, zipCode, street } = await request.json();

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    await pool.query(
      "UPDATE user SET FirstName = ?, LastName = ?, Email = ?, Country = ?, City = ?, ZipCode = ?, Street = ? WHERE Id = ?",
      [firstName, lastName, email, country, city, zipCode, street, userId]
    );

    const [rows] = await pool.query(
      "SELECT Id as id, Email as email, Country as country, City as city, ZipCode as zipCode, Street as street, FirstName as firstName, LastName as lastName FROM user WHERE Id = ?",
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return createErrorResponse("User not found", 404);
    }

    return createResponse({ user: users[0] });
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to update user information");
  }
} 