import { pool, createResponse, createErrorResponse } from "../utils/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createErrorResponse("Email and password are required", 400);
    }

    // Special case for admin login
    if (email === "admin@admin.com") {
      if (password === "admin") {
        // Get admin user data with proper field mapping
        const [rows] = await pool.query(
          "SELECT Id as id, Email as email, FirstName as firstName, LastName as lastName, Country as country, City as city, ZipCode as zipCode, Street as street FROM user WHERE Email = ?",
          [email]
        );

        const users = rows as any[];
        if (users.length === 0) {
          // Create admin user if it doesn't exist
          await pool.query(
            "INSERT INTO user (Email, Password, FirstName, LastName) VALUES (?, ?, ?, ?)",
            [email, password, "Admin", "User"]
          );
          
          // Fetch the newly created admin user with all fields
          const [newRows] = await pool.query(
            "SELECT Id as id, Email as email, FirstName as firstName, LastName as lastName, Country as country, City as city, ZipCode as zipCode, Street as street FROM user WHERE Email = ?",
            [email]
          );
          
          const newUsers = newRows as any[];
          return createResponse({ 
            message: "Login successful", 
            user: {
              ...newUsers[0],
              isAdmin: true
            }
          });
        }

        // Return existing admin user with proper field mapping
        return createResponse({ 
          message: "Login successful", 
          user: {
            ...users[0],
            isAdmin: true
          }
        });
      }
      return createErrorResponse("Invalid admin credentials", 401);
    }

    // Regular user login
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE Email = ?",
      [email]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return createErrorResponse("Invalid email or password", 401);
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return createErrorResponse("Invalid email or password", 401);
    }

    return createResponse({ 
      message: "Login successful", 
      user: {
        ...user,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error("Authentication Error:", error);
    return createErrorResponse("Failed to authenticate");
  }
} 