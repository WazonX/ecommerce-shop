import { pool, createResponse, createErrorResponse } from "../../utils/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return createErrorResponse("Email and password are required", 400);
        }

        // Check if email already exists
        const [existingUsers] = await pool.query(
            "SELECT * FROM user WHERE Email = ?",
            [email]
        );

        const users = existingUsers as any[];
        if (users.length > 0) {
            return createErrorResponse("Email already exists", 400);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user with hashed password
        const [result] = await pool.query(
            "INSERT INTO user (Email, Password, FirstName, LastName) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, "New", "User"]
        );

        const insertResult = result as any;
        const userId = insertResult.insertId;

        // Fetch the created user
        const [newUser] = await pool.query(
            "SELECT Id as id, Email as email, FirstName as firstName, LastName as lastName FROM user WHERE Id = ?",
            [userId]
        );

        const createdUser = (newUser as any[])[0];

        return createResponse({ message: "User registered successfully", user: createdUser });
    } catch (error) {
        console.error("Registration Error:", error);
        return createErrorResponse("Failed to register user");
    }
} 