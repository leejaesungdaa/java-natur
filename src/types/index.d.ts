export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    imageSrc: string;
    featured: boolean;
    price?: string;
    ingredients?: string[];
    details?: {
        longDescription?: string;
        features?: string[];
        benefits?: string[];
        usage?: string;
    };
    images?: string[];
    relatedProducts?: string[];
}

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    imageSrc: string;
    date: string;
    author?: string;
    tags?: string[];
}

export interface Video {
    id: string;
    title: string;
    description?: string;
    thumbnailSrc: string;
    videoUrl?: string;
    duration: string;
    date?: string;
    category?: string;
    featured?: boolean;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export type FormStatus = null | 'sending' | 'success' | 'error';

export interface NavigationItem {
    key: string;
    path: string;
    label: string;
    children?: NavigationItem[];
}

export interface SocialLink {
    name: string;
    icon: string;
    url: string;
}

export interface Store {
    name: string;
    url: string;
    logo?: string;
    featured?: boolean;
}