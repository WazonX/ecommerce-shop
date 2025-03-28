import { pool } from "./db";

export async function createAdminUser() {
    try {
        // Check if admin user exists
        const [rows] = await pool.query(
            "SELECT * FROM user WHERE Email = ?",
            ["admin@admin.com"]
        );

        const users = rows as any[];

        if (users.length === 0) {
            // Create admin user if it doesn't exist
            await pool.query(
                "INSERT INTO user (Email, Password, FirstName, LastName, Country, City, ZipCode, Street) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ["admin@admin.com", "admin", "Admin", "User", "Admin Country", "Admin City", "00000", "Admin Street"]
            );
            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        throw error;
    }
} 