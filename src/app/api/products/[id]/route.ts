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

        // Get the singleton instance of ProductService
        const productService = ProductService.getInstance();
        const product = await productService.getProductById(productId);
        
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

export async function DELETE(
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

        // Get the singleton instance of ProductService
        const productService = ProductService.getInstance();
        const deleteResult = await productService.deleteProductById(productId);

        if (!deleteResult) {
            return NextResponse.json(
                { error: 'Product not found or could not be deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
} 