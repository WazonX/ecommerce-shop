import { NextResponse } from 'next/server';
import { ProductService } from '../../../Services/ProductService';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const productId = parseInt(params.id);
        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const product = await ProductService.getProductById(productId);
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
} 