import { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentData } from 'firebase/firestore';
import { firestoreService } from '@/lib/firebase/firebaseService';

interface UseFirestoreState<T = DocumentData> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseFirestoreListState<T = DocumentData> {
    data: T[];
    loading: boolean;
    error: string | null;
}

export const useFirestoreDoc = <T = DocumentData>(
    collection: string,
    docId: string | null,
    dependencies: any[] = []
) => {
    const [state, setState] = useState<UseFirestoreState<T>>({
        data: null,
        loading: false,
        error: null
    });

    const fetchDoc = useCallback(async () => {
        if (!docId) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const data = await firestoreService.read(collection, docId);
            setState({ data: data as T, loading: false, error: null });
        } catch (error: any) {
            setState({ 
                data: null, 
                loading: false, 
                error: error.message || 'Failed to fetch document' 
            });
        }
    }, [collection, docId, ...dependencies]);

    useEffect(() => {
        fetchDoc();
    }, [fetchDoc]);

    const update = useCallback(async (updateData: Partial<T>) => {
        if (!docId) throw new Error('No document ID provided');
        
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            await firestoreService.update(collection, docId, updateData);
            await fetchDoc(); // Refresh data
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Failed to update document' 
            }));
            throw error;
        }
    }, [collection, docId, fetchDoc]);

    const remove = useCallback(async () => {
        if (!docId) throw new Error('No document ID provided');
        
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            await firestoreService.delete(collection, docId);
            setState({ data: null, loading: false, error: null });
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Failed to delete document' 
            }));
            throw error;
        }
    }, [collection, docId]);

    const refetch = useCallback(() => {
        fetchDoc();
    }, [fetchDoc]);

    return useMemo(() => ({
        ...state,
        update,
        remove,
        refetch
    }), [state, update, remove, refetch]);
};

export const useFirestoreList = <T = DocumentData>(
    collection: string,
    filters?: Array<{ field: string; operator: any; value: any }>,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limit?: number,
    dependencies: any[] = []
) => {
    const [state, setState] = useState<UseFirestoreListState<T>>({
        data: [],
        loading: false,
        error: null
    });

    const fetchList = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const data = await firestoreService.list(
                collection,
                filters,
                orderBy,
                orderDirection,
                limit
            );
            setState({ data: data as T[], loading: false, error: null });
        } catch (error: any) {
            setState({ 
                data: [], 
                loading: false, 
                error: error.message || 'Failed to fetch list' 
            });
        }
    }, [collection, JSON.stringify(filters), orderBy, orderDirection, limit, ...dependencies]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const add = useCallback(async (newData: Omit<T, 'id'>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            await firestoreService.create(collection, newData);
            await fetchList(); // Refresh list
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Failed to add document' 
            }));
            throw error;
        }
    }, [collection, fetchList]);

    const update = useCallback(async (docId: string, updateData: Partial<T>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            await firestoreService.update(collection, docId, updateData);
            await fetchList(); // Refresh list
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Failed to update document' 
            }));
            throw error;
        }
    }, [collection, fetchList]);

    const remove = useCallback(async (docId: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            await firestoreService.delete(collection, docId);
            await fetchList(); // Refresh list
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Failed to delete document' 
            }));
            throw error;
        }
    }, [collection, fetchList]);

    const refetch = useCallback(() => {
        fetchList();
    }, [fetchList]);

    return useMemo(() => ({
        ...state,
        add,
        update,
        remove,
        refetch
    }), [state, add, update, remove, refetch]);
};

export const useFirestoreCreate = <T = DocumentData>(collection: string) => {
    const [state, setState] = useState<{
        loading: boolean;
        error: string | null;
    }>({
        loading: false,
        error: null
    });

    const create = useCallback(async (data: Omit<T, 'id'>, docId?: string) => {
        setState({ loading: true, error: null });
        
        try {
            const id = await firestoreService.create(collection, data, docId);
            setState({ loading: false, error: null });
            return id;
        } catch (error: any) {
            setState({ 
                loading: false, 
                error: error.message || 'Failed to create document' 
            });
            throw error;
        }
    }, [collection]);

    return useMemo(() => ({
        ...state,
        create
    }), [state, create]);
};

// Specialized hooks for specific collections
export const useProducts = (locale?: string) => {
    const filters = useMemo(() => 
        locale ? [{ field: 'locales', operator: 'array-contains', value: locale }] : undefined,
        [locale]
    );
    
    return useFirestoreList('products', filters, 'order', 'asc', undefined, [locale]);
};

export const useFeaturedProducts = (locale?: string) => {
    const filters = useMemo(() => {
        const baseFilters: Array<{ field: string; operator: string; value: any }> = [
            { field: 'featured', operator: '==', value: true }
        ];
        if (locale) {
            baseFilters.push({ field: 'locales', operator: 'array-contains', value: locale });
        }
        return baseFilters;
    }, [locale]);
    
    return useFirestoreList('products', filters, 'order', 'asc', undefined, [locale]);
};

export const useInquiries = () => {
    return useFirestoreList('inquiries', undefined, 'createdAt', 'desc');
};

export const useStores = () => {
    return useFirestoreList('stores', undefined, 'order', 'asc');
};