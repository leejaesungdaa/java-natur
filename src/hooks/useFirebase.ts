import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { productService, imageService, settingService, siteImageService, homePageService } from '@/lib/firebase/services';
import { DocumentData, collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';

export function useProducts(locale: Locale) {
    const [products, setProducts] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for products
        const q = query(
            collection(db, 'products'),
            orderBy('order', 'asc')
        );
        
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const data = snapshot.docs
                    .filter(doc => !doc.data().isDeleted)
                    .map(doc => {
                        const docData = doc.data();
                        return {
                            id: doc.id,
                            name: docData[`name_${locale}`] || docData.name_ko || docData.name_en || docData.name || '',
                            description: docData[`description_${locale}`] || docData.description_ko || docData.description_en || docData.description || '',
                            imageUrl: docData.imageUrl || '',
                            productLink: docData.productLink || '',
                            shopeeLink: docData.shopeeLink || '',
                            tokopediaLink: docData.tokopediaLink || '',
                            featured: docData.featured || false,
                            order: docData.order || 0
                        };
                    });
                setProducts(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("제품 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { products, loading, error };
}

export function useFeaturedProducts(locale: Locale) {
    const [products, setProducts] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for featured products
        const q = query(
            collection(db, 'products'),
            where('featured', '==', true),
            orderBy('order', 'asc')
        );
        
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const data = snapshot.docs
                    .filter(doc => !doc.data().isDeleted)
                    .map(doc => {
                        const docData = doc.data();
                        return {
                            id: doc.id,
                            name: docData[`name_${locale}`] || docData.name_ko || docData.name_en || docData.name || '',
                            description: docData[`description_${locale}`] || docData.description_ko || docData.description_en || docData.description || '',
                            imageUrl: docData.imageUrl || '',
                            productLink: docData.productLink || '',
                            shopeeLink: docData.shopeeLink || '',
                            tokopediaLink: docData.tokopediaLink || '',
                            featured: docData.featured,
                            order: docData.order || 0
                        };
                    });
                setProducts(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("추천 제품 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { products, loading, error };
}

export function useProduct(id: string, locale: Locale) {
    const [product, setProduct] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        
        // Real-time listener for single product
        const docRef = doc(db, 'products', id);
        
        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (!data.isDeleted) {
                        setProduct({
                            id: docSnap.id,
                            name: data[`name_${locale}`] || data.name_ko || data.name_en || data.name || '',
                            description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                            imageUrl: data.imageUrl || '',
                            productLink: data.productLink || '',
                            shopeeLink: data.shopeeLink || '',
                            tokopediaLink: data.tokopediaLink || '',
                            featured: data.featured || false,
                            order: data.order || 0,
                            ...data
                        });
                    } else {
                        setProduct(null);
                    }
                } else {
                    setProduct(null);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error(`제품 ID(${id}) 로드 중 오류:`, err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id, locale]);

    return { product, loading, error };
}

export function useStoreOptions() {
    const [stores, setStores] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for store options
        const q = query(collection(db, 'store_options'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStores(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("스토어 옵션 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { stores, loading, error };
}

export function useSiteImages() {
    const [images, setImages] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for site images
        const docRef = doc(db, 'site_images', 'images');
        
        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setImages(docSnap.data() as { [key: string]: string });
                } else {
                    setImages({});
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("사이트 이미지 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { images, loading, error };
}

export function useHomePageData(locale: Locale) {
    const [data, setData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for homepage data
        const docRef = doc(db, 'homepage_content', 'main');
        
        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setData({
                        hero: {
                            title: docData[`hero_title_${locale}`] || docData.hero_title || '',
                            subtitle: docData[`hero_subtitle_${locale}`] || docData.hero_subtitle || '',
                            highlightedText: docData[`hero_highlighted_${locale}`] || docData.hero_highlighted || '',
                            backgroundImage: docData.hero_background_image || '/images/hero-bg.jpg'
                        },
                        about: {
                            title: docData[`about_title_${locale}`] || docData.about_title || '',
                            subtitle: docData[`about_subtitle_${locale}`] || docData.about_subtitle || '',
                            description: docData[`about_description_${locale}`] || docData.about_description || '',
                            whyTitle: docData[`about_why_title_${locale}`] || docData.about_why_title || '',
                            image: docData.about_image || '/images/about-image.jpg'
                        },
                        benefits: docData.benefits || [],
                        testimonials: docData.testimonials || []
                    });
                } else {
                    setData(null);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("홈페이지 데이터 로듌 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { data, loading, error };
}

export function useContactInfo(locale: Locale) {
    const [contactInfo, setContactInfo] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for contact info
        const q = query(collection(db, 'contact_info'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    const addressKey = locale === 'en' ? 'addressEnglish' : 'address';
                    setContactInfo({
                        address: data[addressKey] || data.address || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        latitude: data.latitude || -6.5510,
                        longitude: data.longitude || 107.4840
                    });
                } else {
                    setContactInfo(null);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("연락처 정보 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { contactInfo, loading, error };
}

export function useCompanyHistory(locale: Locale) {
    const [history, setHistory] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for company history
        const q = query(collection(db, 'company_history'), orderBy('order', 'asc'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs
                    .filter(doc => !doc.data().isDeleted)
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                setHistory(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("회사 연혁 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { history, loading, error };
}

export function useVinegarInfo(locale: Locale) {
    const [vinegarInfo, setVinegarInfo] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for vinegar info
        const q = query(collection(db, 'vinegar_info'), orderBy('order', 'asc'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs
                    .filter(doc => !doc.data().isDeleted)
                    .map(doc => {
                        const docData = doc.data();
                        return {
                            id: doc.id,
                            title: docData[`title_${locale}`] || docData.title || '',
                            ingredients: docData[`ingredients_${locale}`] || docData.ingredients || '',
                            healthEffects: docData[`healthEffects_${locale}`] || docData.healthEffects || [],
                            feature: docData[`feature_${locale}`] || docData.feature || '',
                            imageUrl: docData.imageUrl || '',
                            order: docData.order || 0
                        };
                    });
                setVinegarInfo(data);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("식초 정보 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { vinegarInfo, loading, error };
}

export function useVinegarStories(locale: Locale) {
    const [stories, setStories] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for vinegar stories
        const q = query(collection(db, 'vinegar_stories'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const items: any[] = [];
                const featuredItems: any[] = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!data.isDeleted) {
                        const item = {
                            id: doc.id,
                            title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                            summary: data[`summary_${locale}`] || data.summary_ko || data.summary_en || data.summary || '',
                            content: data[`content_${locale}`] || data.content_ko || data.content_en || data.content || '',
                            imageUrl: data.imageUrl || '',
                            isFeatured: data.isFeatured || false,
                            category: data.category || 'health',
                            createdAt: data.createdAt || ''
                        };
                        
                        if (item.isFeatured) {
                            featuredItems.push(item);
                        } else {
                            items.push(item);
                        }
                    }
                });
                
                featuredItems.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                });
                
                setStories([...featuredItems, ...items]);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("식초 이야기 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { stories, loading, error };
}

export function useVinegarVideos(locale: Locale) {
    const [videos, setVideos] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for vinegar videos
        const q = query(collection(db, 'vinegar_videos'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const items: any[] = [];
                const featuredItems: any[] = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!data.isDeleted) {
                        const item = {
                            id: doc.id,
                            title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                            description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                            videoUrl: data.videoUrl || '',
                            thumbnailUrl: data.thumbnailUrl || '',
                            isFeatured: data.isFeatured || false,
                            createdAt: data.createdAt || ''
                        };
                        
                        if (item.isFeatured) {
                            featuredItems.push(item);
                        } else {
                            items.push(item);
                        }
                    }
                });
                
                featuredItems.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                });
                
                setVideos([...featuredItems, ...items]);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("식초 동영상 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { videos, loading, error };
}

export function useVinegarProcess(locale: Locale) {
    const [processes, setProcesses] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        
        // Real-time listener for vinegar process
        const q = query(collection(db, 'vinegar_process'), orderBy('step', 'asc'));
        
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const items: any[] = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!data.isDeleted) {
                        items.push({
                            id: doc.id,
                            title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                            description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                            imageUrl: data.imageUrl || '',
                            step: data.step || 1,
                            createdAt: data.createdAt || ''
                        });
                    }
                });
                
                setProcesses(items);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("제조 과정 로드 중 오류:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [locale]);

    return { processes, loading, error };
}