import { pool, createResponse, createErrorResponse } from "../utils/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createErrorResponse("Email and password are required", 400);
    }

    // Get user by email
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE Email = ?",
      [email]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return createErrorResponse("Invalid email or password", 401);
    }

    const user = users[0];

    // Special case for admin user
    if (email === "admin@admin.com" && password === "admin") {
      return createResponse({ message: "Login successful", user });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return createErrorResponse("Invalid email or password", 401);
    }

    return createResponse({ message: "Login successful", user });
  } catch (error) {
    console.error("Authentication Error:", error);
    return createErrorResponse("Failed to authenticate");
  }
} 