export interface Product {
    id: string;
    title: string;
    description: string;
    specification: string,
    category: number,
    price: number;
    imagesPath: string,
    image?: string;
    discount?: number;
    quantity?: number;
    rating?: number;
} 