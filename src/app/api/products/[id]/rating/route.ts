import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../utils/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { rating } = body;

        if (rating === undefined || rating === null) {
            return NextResponse.json(
                { error: 'Rating is required' },
                { status: 400 }
            );
        }

        // Update the product rating in the database
        const [result] = await pool.query(
            'UPDATE product SET Rating = ? WHERE Id = ?',
            [rating, id]
        );

        // Check if the update was successful
        if ((result as any).affectedRows === 0) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, rating });
    } catch (error) {
        console.error('Error updating product rating:', error);
        return NextResponse.json(
            { error: 'Failed to update product rating' },
            { status: 500 }
        );
    }
} 