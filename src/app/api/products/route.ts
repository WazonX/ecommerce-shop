import { ProductService } from '../../Services/ProductService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const productService = ProductService.getInstance();

    let products;
    if (category) {
      products = await productService.getProductsByCategory(parseInt(category));
    } else {
      products = await productService.getAllProducts();
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
