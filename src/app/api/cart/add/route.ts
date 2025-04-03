import { NextResponse } from 'next/server';
import { pool } from '../../utils/db';

export async function POST(request: Request) {
    try {
        const { userId, productId, quantity } = await request.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        
        try {
            // Start transaction
            await connection.beginTransaction();

            // Add items to cart
            for (let i = 0; i < quantity; i++) {
                await connection.query(
                    'INSERT INTO cart (UserId, ProductId) VALUES (?, ?)',
                    [userId, productId]
                );
            }

            // Commit transaction
            await connection.commit();

            return NextResponse.json({ 
                message: `Added ${quantity} item(s) to cart`,
                success: true 
            });
        } catch (error) {
            // Rollback transaction on error
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add item to cart' },
            { status: 500 }
        );
    }
} 