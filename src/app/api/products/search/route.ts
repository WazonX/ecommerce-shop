import { NextResponse } from 'next/server';
import { ProductService } from '../../../Services/ProductService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        const productService = ProductService.getInstance();
        let products;

        if (!query) {
            // If no query is provided, return all products
            products = await productService.getAllProducts();
        } else {
            // If query is provided, search for matching products
            products = await productService.getProductsBySearch(query);
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
} 