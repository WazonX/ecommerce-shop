import { ProductService } from '../../Services/ProductService';
import { pool, createResponse, createErrorResponse } from '../utils/db';

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

    return new Response(JSON.stringify({ products }), {
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

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.title || !productData.description || !productData.price) {
      return createErrorResponse("Missing required fields", 400);
    }

    // Convert base64 image to Buffer if present
    let imageBuffer = null;
    if (productData.image) {
      imageBuffer = Buffer.from(productData.image, 'base64');
    }

    // Insert product into database
    const [result] = await pool.query(
      `INSERT INTO product (
        Title, Description, Specification, Price, Discount, Rating, 
        Category, Subcategory, Image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.title,
        productData.description,
        productData.specification || '',
        productData.price,
        productData.discount || 0,
        productData.rating || 0,
        productData.category || 0,
        productData.subcategory || 0,
        imageBuffer
      ]
    );

    const insertResult = result as any;
    const productId = insertResult.insertId;

    // Fetch the created product
    const [rows] = await pool.query(
      `SELECT 
        Id as id,
        Title as title,
        Description as description,
        Specification as specification,
        Price as price,
        Discount as discount,
        Rating as rating,
        Category as category,
        Subcategory as subcategory,
        Image as image
      FROM product WHERE Id = ?`,
      [productId]
    );

    const products = rows as any[];
    if (products.length === 0) {
      return createErrorResponse("Failed to create product", 500);
    }

    // Convert image to base64 for response
    const product = {
      ...products[0],
      image: products[0].image ? products[0].image.toString('base64') : null
    };

    return createResponse({ 
      message: "Product created successfully", 
      product 
    });
  } catch (error) {
    console.error("Database Error:", error);
    return createErrorResponse("Failed to create product");
  }
}
