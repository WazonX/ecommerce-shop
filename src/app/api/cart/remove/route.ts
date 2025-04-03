import { NextResponse } from 'next/server';
import { pool } from '../../utils/db';

export async function DELETE(request: Request) {
    try {
        const { userId, items } = await request.json();

        if (!userId || !items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        
        try {
            // Start transaction
            await connection.beginTransaction();

            // Remove items from cart
            for (const item of items) {
                const { productId, quantity } = item;
                
                // Get current quantity in cart
                const [rows] = await connection.query(
                    'SELECT COUNT(*) as count FROM cart WHERE UserId = ? AND ProductId = ?',
                    [userId, productId]
                );
                
                const currentQuantity = (rows as any[])[0].count;
                const removeCount = Math.min(quantity, currentQuantity);

                // Remove specified quantity
                await connection.query(
                    'DELETE FROM cart WHERE UserId = ? AND ProductId = ? LIMIT ?',
                    [userId, productId, removeCount]
                );
            }

            // Commit transaction
            await connection.commit();

            return NextResponse.json({ 
                message: 'Items removed from cart successfully',
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
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove items from cart' },
            { status: 500 }
        );
    }
} 