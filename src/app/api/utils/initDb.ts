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

export async function createCartTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
                Id INT AUTO_INCREMENT PRIMARY KEY,
                UserId INT NOT NULL,
                ProductId INT NOT NULL,
                FOREIGN KEY (UserId) REFERENCES user(Id),
                FOREIGN KEY (ProductId) REFERENCES product(Id),
                UNIQUE KEY unique_cart_item (UserId, ProductId)
            )
        `);
        console.log("Cart table created successfully");
    } catch (error) {
        console.error("Error creating cart table:", error);
        throw error;
    }
} 