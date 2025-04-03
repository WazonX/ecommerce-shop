export interface Product {
    id: string;
    title: string;
    description: string;
    specification: string;
    price: number;
    imagesPath: string;
    image: string | null;
    discount: number;
    rating: number;
    images: string[];
    imageCount: number;
    CategoryName: string;
    BrandName: string;
    CategoryId: number;
    BrandId: number;
} 