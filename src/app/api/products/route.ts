import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});

export async function GET() {
    try {
        const [rows] = await pool.query(`
                SELECT 
                Id AS productId,
                Title AS title,
                Price AS price,
                Image AS image
            FROM product`);
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Database Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}