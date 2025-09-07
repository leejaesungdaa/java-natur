import { db, storage, auth } from './firebaseConfig';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    deleteDoc, 
    updateDoc, 
    DocumentData, 
    CollectionReference, 
    Query, 
    DocumentReference,
    writeBatch,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject, 
    StorageReference,
    listAll,
    getMetadata
} from 'firebase/storage';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    User
} from 'firebase/auth';
import { Locale } from '@/lib/i18n/config';

// Error handling utility
export class FirebaseError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: any
    ) {
        super(message);
        this.name = 'FirebaseError';
    }
}

// Logging utility for development (will be removed in production)
const isDevelopment = process.env.NODE_ENV === 'development';

const logError = (operation: string, error: any) => {
    if (isDevelopment) {
        console.error(`Firebase ${operation} error:`, error);
    }
    // In production, you might want to send this to a logging service
};

const logInfo = (operation: string, message: string) => {
    if (isDevelopment) {
        console.info(`Firebase ${operation}:`, message);
    }
};

// Base service class with common functionality
abstract class BaseFirebaseService {
    protected handleError(operation: string, error: any): never {
        const message = error.message || 'Unknown error occurred';
        const code = error.code || 'unknown';
        logError(operation, error);
        throw new FirebaseError(message, code, operation, error);
    }

    protected logOperation(operation: string, message?: string) {
        logInfo(operation, message || 'Operation completed');
    }
}

// Authentication Service
export class AuthService extends BaseFirebaseService {
    async signIn(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.logOperation('signIn', `User signed in: ${email}`);
            return userCredential.user;
        } catch (error) {
            this.handleError('signIn', error);
        }
    }

    async signUp(email: string, password: string, displayName?: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            if (displayName && userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
            }
            
            this.logOperation('signUp', `User created: ${email}`);
            return userCredential.user;
        } catch (error) {
            this.handleError('signUp', error);
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(auth);
            this.logOperation('signOut', 'User signed out');
        } catch (error) {
            this.handleError('signOut', error);
        }
    }

    getCurrentUser(): User | null {
        return auth.currentUser;
    }

    async getIdToken(): Promise<string | null> {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;
            return await user.getIdToken();
        } catch (error) {
            this.handleError('getIdToken', error);
        }
    }
}

// Storage Service
export class StorageService extends BaseFirebaseService {
    async uploadFile(file: File, path: string, metadata?: Record<string, any>): Promise<string> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file, { customMetadata: metadata });
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            this.logOperation('uploadFile', `File uploaded: ${path}`);
            return downloadURL;
        } catch (error) {
            this.handleError('uploadFile', error);
        }
    }

    async getFileUrl(path: string): Promise<string> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            const url = await getDownloadURL(storageRef);
            this.logOperation('getFileUrl', `URL retrieved: ${path}`);
            return url;
        } catch (error) {
            this.handleError('getFileUrl', error);
        }
    }

    async deleteFile(path: string): Promise<void> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            await deleteObject(storageRef);
            this.logOperation('deleteFile', `File deleted: ${path}`);
        } catch (error) {
            this.handleError('deleteFile', error);
        }
    }

    async listFiles(path: string): Promise<Array<{ name: string; url: string; size: number; timeCreated: string }>> {
        try {
            const storageRef: StorageReference = ref(storage, path);
            const result = await listAll(storageRef);
            
            const files = await Promise.all(
                result.items.map(async (itemRef) => {
                    const [url, metadata] = await Promise.all([
                        getDownloadURL(itemRef),
                        getMetadata(itemRef)
                    ]);
                    
                    return {
                        name: itemRef.name,
                        url,
                        size: metadata.size,
                        timeCreated: metadata.timeCreated
                    };
                })
            );
            
            this.logOperation('listFiles', `Listed ${files.length} files in ${path}`);
            return files;
        } catch (error) {
            this.handleError('listFiles', error);
        }
    }
}

// Firestore Service
export class FirestoreService extends BaseFirebaseService {
    async create<T extends DocumentData>(collectionName: string, data: T, docId?: string): Promise<string> {
        try {
            const timestamp = serverTimestamp();
            const docData = { ...data, createdAt: timestamp, updatedAt: timestamp };
            
            if (docId) {
                const docRef = doc(db, collectionName, docId);
                await setDoc(docRef, docData);
                this.logOperation('create', `Document created with ID: ${docId}`);
                return docId;
            } else {
                const docRef = await addDoc(collection(db, collectionName), docData);
                this.logOperation('create', `Document created with ID: ${docRef.id}`);
                return docRef.id;
            }
        } catch (error) {
            this.handleError('create', error);
        }
    }

    async read(collectionName: string, docId: string): Promise<DocumentData | null> {
        try {
            const docRef: DocumentReference = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                this.logOperation('read', `Document retrieved: ${docId}`);
                return data;
            } else {
                this.logOperation('read', `Document not found: ${docId}`);
                return null;
            }
        } catch (error) {
            this.handleError('read', error);
        }
    }

    async update(collectionName: string, docId: string, data: Partial<DocumentData>): Promise<void> {
        try {
            const docRef: DocumentReference = doc(db, collectionName, docId);
            const updateData = { ...data, updatedAt: serverTimestamp() };
            await updateDoc(docRef, updateData);
            this.logOperation('update', `Document updated: ${docId}`);
        } catch (error) {
            this.handleError('update', error);
        }
    }

    async delete(collectionName: string, docId: string): Promise<void> {
        try {
            const docRef: DocumentReference = doc(db, collectionName, docId);
            await deleteDoc(docRef);
            this.logOperation('delete', `Document deleted: ${docId}`);
        } catch (error) {
            this.handleError('delete', error);
        }
    }

    async list(
        collectionName: string, 
        filters?: Array<{ field: string; operator: any; value: any }>,
        orderByField?: string,
        orderDirection: 'asc' | 'desc' = 'asc',
        limitCount?: number
    ): Promise<DocumentData[]> {
        try {
            const collectionRef: CollectionReference = collection(db, collectionName);
            let q: Query = collectionRef;

            // Apply filters
            if (filters) {
                filters.forEach(filter => {
                    q = query(q, where(filter.field, filter.operator, filter.value));
                });
            }

            // Apply ordering
            if (orderByField) {
                q = query(q, orderBy(orderByField, orderDirection));
            }

            // Apply limit
            if (limitCount) {
                q = query(q, limit(limitCount));
            }

            const snapshot = await getDocs(q);
            const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            this.logOperation('list', `Retrieved ${documents.length} documents from ${collectionName}`);
            return documents;
        } catch (error) {
            this.handleError('list', error);
        }
    }

    async batchWrite(operations: Array<{
        type: 'set' | 'update' | 'delete';
        collection: string;
        docId: string;
        data?: DocumentData;
    }>): Promise<void> {
        try {
            const batch = writeBatch(db);

            operations.forEach(operation => {
                const docRef = doc(db, operation.collection, operation.docId);
                
                switch (operation.type) {
                    case 'set':
                        if (operation.data) {
                            batch.set(docRef, { ...operation.data, updatedAt: serverTimestamp() });
                        }
                        break;
                    case 'update':
                        if (operation.data) {
                            batch.update(docRef, { ...operation.data, updatedAt: serverTimestamp() });
                        }
                        break;
                    case 'delete':
                        batch.delete(docRef);
                        break;
                }
            });

            await batch.commit();
            this.logOperation('batchWrite', `Batch operation completed with ${operations.length} operations`);
        } catch (error) {
            this.handleError('batchWrite', error);
        }
    }
}

// Specialized services
export class ProductService extends BaseFirebaseService {
    private firestore = new FirestoreService();

    async getAllProducts(locale: Locale): Promise<DocumentData[]> {
        try {
            return await this.firestore.list(
                'products',
                [{ field: 'locales', operator: 'array-contains', value: locale }],
                'order',
                'asc'
            );
        } catch (error) {
            this.logOperation('getAllProducts', 'Failed to retrieve products, returning empty array');
            return [];
        }
    }

    async getFeaturedProducts(locale: Locale): Promise<DocumentData[]> {
        try {
            return await this.firestore.list(
                'products',
                [
                    { field: 'locales', operator: 'array-contains', value: locale },
                    { field: 'featured', operator: '==', value: true }
                ],
                'order',
                'asc'
            );
        } catch (error) {
            this.logOperation('getFeaturedProducts', 'Failed to retrieve featured products, returning empty array');
            return [];
        }
    }

    async getProductById(id: string): Promise<DocumentData | null> {
        try {
            return await this.firestore.read('products', id);
        } catch (error) {
            return null;
        }
    }

    async createProduct(productData: DocumentData): Promise<string> {
        return await this.firestore.create('products', productData);
    }

    async updateProduct(id: string, productData: Partial<DocumentData>): Promise<void> {
        return await this.firestore.update('products', id, productData);
    }

    async deleteProduct(id: string): Promise<void> {
        return await this.firestore.delete('products', id);
    }
}

export class AdminService extends BaseFirebaseService {
    private firestore = new FirestoreService();

    async createAdmin(adminData: {
        username: string;
        name: string;
        password: string;
        role: string;
        status: number;
    }): Promise<string> {
        return await this.firestore.create('admins', adminData);
    }

    async getAdminById(id: string): Promise<DocumentData | null> {
        return await this.firestore.read('admins', id);
    }

    async updateAdmin(id: string, adminData: Partial<DocumentData>): Promise<void> {
        return await this.firestore.update('admins', id, adminData);
    }

    async updateLastLogin(id: string, loginTime: string): Promise<void> {
        return await this.firestore.update('admins', id, { lastLogin: loginTime });
    }
}

export class InquiryService extends BaseFirebaseService {
    private firestore = new FirestoreService();

    async createInquiry(inquiry: {
        name: string;
        email: string;
        subject: string;
        message: string;
        locale: string;
    }): Promise<string> {
        return await this.firestore.create('inquiries', inquiry);
    }

    async getAllInquiries(): Promise<DocumentData[]> {
        return await this.firestore.list('inquiries', undefined, 'createdAt', 'desc');
    }

    async markInquiryAsRead(id: string): Promise<void> {
        return await this.firestore.update('inquiries', id, { read: true });
    }
}

export class SettingsService extends BaseFirebaseService {
    private firestore = new FirestoreService();

    async getSiteImages(): Promise<{ [key: string]: string }> {
        try {
            const result = await this.firestore.read('settings', 'images');
            return result?.data || {};
        } catch (error) {
            return {};
        }
    }

    async updateSiteImages(images: { [key: string]: string }): Promise<void> {
        return await this.firestore.update('settings', 'images', images);
    }

    async getStoreOptions(): Promise<DocumentData[]> {
        try {
            return await this.firestore.list('stores', undefined, 'order', 'asc');
        } catch (error) {
            return [];
        }
    }

    async getHomePageData(locale: Locale): Promise<DocumentData | null> {
        try {
            const result = await this.firestore.read('homepage_content', 'main');
            if (result) {
                return {
                    hero: {
                        title: result[`hero_title_${locale}`] || result.hero_title || '',
                        subtitle: result[`hero_subtitle_${locale}`] || result.hero_subtitle || '',
                        highlightedText: result[`hero_highlighted_${locale}`] || result.hero_highlighted || '',
                        backgroundImage: result.hero_background_image || '/images/hero-bg.jpg'
                    },
                    about: {
                        title: result[`about_title_${locale}`] || result.about_title || '',
                        subtitle: result[`about_subtitle_${locale}`] || result.about_subtitle || '',
                        description: result[`about_description_${locale}`] || result.about_description || '',
                        image: result.about_image || '/images/about-image.jpg'
                    },
                    benefits: {
                        title: result[`benefits_title_${locale}`] || result.benefits_title || '',
                        subtitle: result[`benefits_subtitle_${locale}`] || result.benefits_subtitle || '',
                        items: result.benefits_items || []
                    },
                    testimonials: {
                        title: result[`testimonials_title_${locale}`] || result.testimonials_title || '',
                        subtitle: result[`testimonials_subtitle_${locale}`] || result.testimonials_subtitle || '',
                        items: result.testimonials_items || []
                    }
                };
            }
            return null;
        } catch (error) {
            this.logOperation('getHomePageData', 'Failed to retrieve homepage data, returning null');
            return null;
        }
    }

    async getContactInfo(locale: Locale): Promise<DocumentData | null> {
        try {
            const result = await this.firestore.list('contact_info', undefined, undefined, 'asc', 1);
            if (result && result.length > 0) {
                const data = result[0];
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
            this.logOperation('getContactInfo', 'Failed to retrieve contact info, returning null');
            return null;
        }
    }

    async getCompanyHistory(locale: Locale): Promise<DocumentData[]> {
        try {
            const result = await this.firestore.list(
                'company_history',
                undefined,
                'year',
                'desc'
            );
            return result.map(item => ({
                year: item.year || '',
                month: item.month || '',
                title: item.year + (item.month ? `.${item.month}` : ''),
                description: item[`description_${locale}`] || item.description || '',
                order: item.order || 0
            }));
        } catch (error) {
            this.logOperation('getCompanyHistory', 'Failed to retrieve company history, returning empty array');
            return [];
        }
    }
}

// Export service instances
export const authService = new AuthService();
export const storageService = new StorageService();
export const firestoreService = new FirestoreService();
export const productService = new ProductService();
export const adminService = new AdminService();
export const inquiryService = new InquiryService();
export const settingsService = new SettingsService();

export const homePageService = {
    getHomePageData: settingsService.getHomePageData.bind(settingsService),
    getContactInfo: settingsService.getContactInfo.bind(settingsService),
    getCompanyHistory: settingsService.getCompanyHistory.bind(settingsService)
};

// Legacy compatibility - re-export existing services
export const imageService = {
    uploadImage: storageService.uploadFile.bind(storageService),
    getImageUrl: storageService.getFileUrl.bind(storageService),
    deleteImage: storageService.deleteFile.bind(storageService)
};

export const siteImageService = {
    getSiteImages: settingsService.getSiteImages.bind(settingsService)
};

export const settingService = {
    getStoreOptions: settingsService.getStoreOptions.bind(settingsService)
};

// Default export for convenience
export default {
    auth: authService,
    storage: storageService,
    firestore: firestoreService,
    products: productService,
    admin: adminService,
    inquiries: inquiryService,
    settings: settingsService
};