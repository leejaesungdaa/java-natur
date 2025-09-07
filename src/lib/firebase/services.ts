import { db, storage } from './firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where, orderBy, limit, deleteDoc, updateDoc, DocumentData, CollectionReference, Query, DocumentReference } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, StorageReference } from 'firebase/storage';
import { Locale } from '@/lib/i18n/config';

export const imageService = {
    async uploadImage(file: File, path: string): Promise<string> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        } catch (error) {
            throw error;
        }
    },

    async getImageUrl(path: string): Promise<string> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            return await getDownloadURL(storageRef);
        } catch (error) {
            throw error;
        }
    },

    async deleteImage(path: string): Promise<void> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            throw error;
        }
    }
};

export const productService = {
    async getAllProducts(locale: Locale): Promise<DocumentData[]> {
        try {
            const productsRef: CollectionReference = collection(db, 'products');
            const q: Query = query(productsRef, orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            return snapshot.docs
                .filter(doc => !doc.data().isDeleted)
                .map(doc => {
                    const data = doc.data();
                    
                    return {
                        id: doc.id,
                        name: data[`name_${locale}`] || data.name_ko || data.name_en || data.name || '',
                        description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                        imageUrl: data.imageUrl || '',
                        productLink: data.productLink || '',
                        shopeeLink: data.shopeeLink || '',
                        tokopediaLink: data.tokopediaLink || '',
                        featured: data.featured || false,
                        order: data.order || 0
                    };
                });
        } catch (error) {
            console.error('Error fetching all products:', error);
            return [];
        }
    },

    async getFeaturedProducts(locale: Locale): Promise<DocumentData[]> {
        try {
            const productsRef: CollectionReference = collection(db, 'products');
            const q: Query = query(
                productsRef,
                where('featured', '==', true),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs
                .filter(doc => !doc.data().isDeleted)
                .map(doc => {
                    const data = doc.data();
                    
                    return {
                        id: doc.id,
                        name: data[`name_${locale}`] || data.name_ko || data.name_en || data.name || '',
                        description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                        imageUrl: data.imageUrl || '',
                        productLink: data.productLink || '',
                        shopeeLink: data.shopeeLink || '',
                        tokopediaLink: data.tokopediaLink || '',
                        featured: data.featured,
                        order: data.order || 0
                    };
                });
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    },

    async getProductById(id: string, locale: Locale): Promise<DocumentData | null> {
        try {
            const docRef: DocumentReference = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check if not deleted
                if (data.isDeleted) return null;
                
                return {
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
                };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }
};

export const siteImageService = {
    async getSiteImages(): Promise<{ [key: string]: string }> {
        try {
            const docRef: DocumentReference = doc(db, 'settings', 'images');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as { [key: string]: string };
            } else {
                return {};
            }
        } catch (error) {
            return {};
        }
    }
};

export const settingService = {
    async getStoreOptions(): Promise<DocumentData[]> {
        try {
            const storesRef: CollectionReference = collection(db, 'stores');
            const q: Query = query(storesRef, orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    }
};

export const inquiryService = {
    async addInquiry(inquiry: {
        name: string;
        email: string;
        subject: string;
        message: string;
        locale: string;
        createdAt: Date;
    }): Promise<string> {
        try {
            const inquiryRef = await addDoc(collection(db, 'inquiries'), inquiry);
            return inquiryRef.id;
        } catch (error) {
            throw error;
        }
    }
};

export const homePageService = {
    async getHomePageData(locale: Locale): Promise<DocumentData | null> {
        try {
            const docRef: DocumentReference = doc(db, 'homepage_content', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    hero: {
                        title: data[`hero_title_${locale}`] || data.hero_title || '',
                        subtitle: data[`hero_subtitle_${locale}`] || data.hero_subtitle || '',
                        highlightedText: data[`hero_highlighted_${locale}`] || data.hero_highlighted || '',
                        backgroundImage: data.hero_background_image || '/images/hero-bg.jpg'
                    },
                    about: {
                        title: data[`about_title_${locale}`] || data.about_title || '',
                        subtitle: data[`about_subtitle_${locale}`] || data.about_subtitle || '',
                        description: data[`about_description_${locale}`] || data.about_description || '',
                        whyTitle: data[`about_why_title_${locale}`] || data.about_why_title || '',
                        image: data.about_image || '/images/about-image.jpg'
                    },
                    benefits: data.benefits || [],
                    testimonials: data.testimonials || []
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    },

    async getContactInfo(locale: Locale): Promise<DocumentData | null> {
        try {
            const q: Query = query(collection(db, 'contact_info'), limit(1));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                const addressKey = locale === 'en' ? 'addressEnglish' : 'address';
                return {
                    address: data[addressKey] || data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    latitude: data.latitude || -6.5510,
                    longitude: data.longitude || 107.4840
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    },

    async getCompanyHistory(locale: Locale): Promise<DocumentData[]> {
        try {
            const q: Query = query(collection(db, 'company_history'), orderBy('year', 'desc'));
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map(doc => {
                const data = doc.data();
                const descriptionKey = `description_${locale}`;
                return {
                    year: data.year || '',
                    month: data.month || '',
                    title: data.year + (data.month ? `.${data.month}` : ''),
                    description: data[descriptionKey] || data.description || '',
                    order: data.order || 0
                };
            });
            
            results.sort((a, b) => {
                if (a.year === b.year) {
                    return (a.order || 0) - (b.order || 0);
                }
                return parseInt(b.year) - parseInt(a.year);
            });
            
            return results;
        } catch (error) {
            return [];
        }
    },
    
    async getVinegarInfo(locale: Locale) {
        try {
            const q = query(collection(db, 'vinegar_info'), orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            const results: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isDeleted) {
                    const titleKey = `title_${locale}`;
                    const descriptionKey = `description_${locale}`;
                    const benefitsKey = `benefits_${locale}`;
                    
                    results.push({
                        id: doc.id,
                        title: data[titleKey] || data.title || '',
                        description: data[descriptionKey] || data.description || '',
                        benefits: data[benefitsKey] || data.benefits || [],
                        order: data.order || 0,
                        ...data
                    });
                }
            });
            
            return results.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error('Error loading vinegar info:', error);
            return [];
        }
    },

    async getVinegarStories(locale: Locale) {
        try {
            const q = query(collection(db, 'vinegar_stories'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const items: any[] = [];
            const featuredItems: any[] = [];
            
            querySnapshot.forEach((doc) => {
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
            
            return [...featuredItems, ...items];
        } catch (error) {
            console.error('Error fetching vinegar stories:', error);
            return [];
        }
    },

    async getVinegarVideos(locale: Locale) {
        try {
            const q = query(collection(db, 'vinegar_videos'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const items: any[] = [];
            const featuredItems: any[] = [];
            
            querySnapshot.forEach((doc) => {
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
            
            return [...featuredItems, ...items];
        } catch (error) {
            console.error('Error fetching vinegar videos:', error);
            return [];
        }
    },

    async getVinegarProcess(locale: Locale) {
        try {
            const q = query(collection(db, 'vinegar_process'), orderBy('step', 'asc'));
            const querySnapshot = await getDocs(q);
            const items: any[] = [];
            const featuredItems: any[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isDeleted) {
                    const item = {
                        id: doc.id,
                        title: data[`title_${locale}`] || data.title_ko || data.title_en || data.title || '',
                        description: data[`description_${locale}`] || data.description_ko || data.description_en || data.description || '',
                        imageUrl: data.imageUrl || '',
                        step: data.step || 1,
                        createdAt: data.createdAt || ''
                    };
                    items.push(item);
                }
            });
            
            // Return processes sorted by step
            return items;
        } catch (error) {
            console.error('Error fetching vinegar process:', error);
            return [];
        }
    }
};

export {
    authService,
    storageService,
    firestoreService,
    productService as productsService,
    adminService,
    settingsService
} from './firebaseService';