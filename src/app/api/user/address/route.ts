import { pool, createResponse, createErrorResponse } from "../../utils/db";

export async function POST(request: Request) {
  try {
    const { userId, country, city, zipCode, street } = await request.json();

    console.log('Received data:', { userId, country, city, zipCode, street });

    if (!userId || !country || !city || !zipCode || !street) {
      console.log('Missing fields:', { userId, country, city, zipCode, street });
      return createErrorResponse("Missing required fields", 400);
    }

    // First check if user exists
    const [existingUser] = await pool.query(
      "SELECT Id FROM user WHERE Id = ?",
      [userId]
    );

    console.log('Existing user check:', existingUser);

    if (!existingUser || (existingUser as any[]).length === 0) {
      console.log('User not found:', userId);
      return createErrorResponse("User not found", 404);
    }

    // Update the user's address
    await pool.query(
      "UPDATE user SET Country = ?, City = ?, ZipCode = ?, Street = ? WHERE Id = ?",
      [country, city, zipCode, street, userId]
    );

    // Fetch the updated record
    const [rows] = await pool.query(
      "SELECT Country as country, City as city, ZipCode as zipCode, Street as street FROM user WHERE Id = ?",
      [userId]
    );

    const address = (rows as any[])[0];
    console.log('Fetched address:', address);

    return createResponse({ address });
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse("Failed to save address");
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const [rows] = await pool.query(
      "SELECT Country as country, City as city, ZipCode as zipCode, Street as street FROM user WHERE Id = ?",
      [userId]
    );

    const address = (rows as any[])[0];
    
    if (!address) {
      return createErrorResponse("Address not found", 404);
    }

    return createResponse({ address });
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createErrorResponse("Failed to fetch address");
  }
}