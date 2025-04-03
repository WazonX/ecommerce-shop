import { pool } from '../api/utils/db';
import { Product } from '../types/product';

export class ProductService {
    private static instance: ProductService;
    private constructor() {}

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    private processImageData(rows: any[]): Product[] {
        console.log('Processing image data from database:', rows.map(row => ({
            id: row.id,
            hasImage: !!row.image,
            imageType: row.image ? typeof row.image : 'null'
        })));
        
        const processedRows = rows.map((row) => ({
            ...row,
            image: row.image ? row.image.toString("base64") : null,
        }));
        
        console.log('Processed rows:', processedRows.map(row => ({
            id: row.id,
            hasImage: !!row.image,
            imageType: row.image ? typeof row.image : 'null'
        })));
        
        return processedRows;
    }

    public async getAllProducts(): Promise<Product[]> {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    Id AS id,
                    Title AS title,
                    Price AS price,
                    Image AS image,
                    Rating AS rating,
                    Discount AS discount
                FROM product
            `);
            return this.processImageData(rows as any[]);
        } catch (error) {
            console.error("Database Error:", error);
            throw new Error("Failed to fetch products");
        }
    }

    public async getProductsByQuery(query: string, params: any[] = []): Promise<Product[]> {
        try {
            const [rows] = await pool.query(query, params);
            return this.processImageData(rows as any[]);
        } catch (error) {
            console.error("Database Error:", error);
            throw new Error("Failed to fetch products");
        }
    }

    public async getProductsByCategory(categoryId: number): Promise<Product[]> {
        const query = `
            SELECT 
                p.Id AS id,
                p.Title AS title,
                p.Price AS price,
                p.Image AS image,
                p.Rating AS rating,
                p.Discount AS discount
            FROM product p
            WHERE Category = ?
        `;
        return this.getProductsByQuery(query, [categoryId]);
    }

    public async getProductsBySearch(searchTerm: string): Promise<Product[]> {
        const query = `
            SELECT 
                Id AS id,
                Title AS title,
                Price AS price,
                Image AS image,
                Rating AS rating,
                Discount AS discount
            FROM product
            WHERE Title LIKE ?
        `;
        return this.getProductsByQuery(query, [`%${searchTerm}%`]);
    }

    static async getProductById(id: number): Promise<Product | null> {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    p.Id AS id,
                    p.Title AS title,
                    p.Description AS description,
                    p.Specification AS specification,
                    p.Price AS price,
                    p.Discount AS discount,
                    p.Rating AS rating,
                    p.Category AS category,
                    p.Image AS image,
                    p.ImagesPath AS imagesPath
                FROM product p
                WHERE p.Id = ?`,
                [id]
            );

            if (!rows || (rows as any[]).length === 0) {
                return null;
            }

            const product = (rows as any[])[0];

            // Clean up imagesPath by removing forward slashes
            const cleanImagesPath = product.imagesPath.replace(/\//g, '');

            // For now, assume we have 4 images named 1.jpg, 2.jpg, 3.jpg, 4.jpg
            const additionalImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];

            console.log('Product image data:', {
                id: product.id,
                title: product.title,
                hasMainImage: !!product.image,
                rawImagesPath: product.imagesPath,
                cleanImagesPath,
                mainImageType: product.image ? typeof product.image : 'null',
                additionalImages
            });

            return {
                id: product.id,
                title: product.title,
                description: product.description,
                specification: product.specification,
                price: product.price,
                discount: product.discount,
                rating: product.rating,
                category: product.category,
                image: product.image ? product.image.toString("base64") : null,
                imagesPath: cleanImagesPath,
                images: additionalImages
            };
        } catch (error) {
            console.error('Error in getProductById:', error);
            throw error;
        }
    }
} 