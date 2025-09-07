import { useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
import { authService, adminService } from '@/lib/firebase/firebaseService';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface AdminData {
    username: string;
    name: string;
    role: string;
    status: number;
    lastLogin?: string;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthState({
                user,
                loading: false,
                error: null
            });
        });

        return unsubscribe;
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = await authService.signIn(email, password);
            return user;
        } catch (error: any) {
            setAuthState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Authentication failed' 
            }));
            throw error;
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = await authService.signUp(email, password, displayName);
            return user;
        } catch (error: any) {
            setAuthState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Registration failed' 
            }));
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            await authService.signOut();
        } catch (error: any) {
            setAuthState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error.message || 'Sign out failed' 
            }));
            throw error;
        }
    }, []);

    const getIdToken = useCallback(async () => {
        if (!authState.user) return null;
        try {
            return await authService.getIdToken();
        } catch (error: any) {
            setAuthState(prev => ({ 
                ...prev, 
                error: error.message || 'Token retrieval failed' 
            }));
            return null;
        }
    }, [authState.user]);

    return {
        ...authState,
        signIn,
        signUp,
        signOut,
        getIdToken,
        isAuthenticated: !!authState.user
    };
};

export const useAdminAuth = () => {
    const { user, loading: authLoading, error: authError, signIn, signOut } = useAuth();
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAdminData = async () => {
            if (!user) {
                setAdminData(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await adminService.getAdminById(user.uid);
                if (data) {
                    setAdminData(data as AdminData);
                } else {
                    setError('Admin data not found');
                }
            } catch (error: any) {
                setError(error.message || 'Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, [user]);

    const adminSignIn = useCallback(async (username: string, password: string) => {
        setError(null);
        try {
            const adminEmail = `${username}@admin.naturjava.local`;
            const user = await signIn(adminEmail, password);
            
            if (user) {
                const data = await adminService.getAdminById(user.uid);
                if (!data) {
                    await signOut();
                    throw new Error('Admin account not found');
                }
                
                const adminInfo = data as AdminData;
                if (adminInfo.status !== 1) {
                    await signOut();
                    if (adminInfo.status === 0) {
                        throw new Error('Account pending approval');
                    } else {
                        throw new Error('Account blocked');
                    }
                }
                
                // Update last login
                await adminService.updateLastLogin(user.uid, new Date().toISOString());
                
                setAdminData(adminInfo);
            }
            
            return user;
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    }, [signIn, signOut]);

    const adminSignOut = useCallback(async () => {
        try {
            await signOut();
            setAdminData(null);
            setError(null);
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    }, [signOut]);

    return {
        user,
        adminData,
        loading: authLoading || loading,
        error: authError || error,
        adminSignIn,
        adminSignOut,
        isAuthenticated: !!user,
        isApprovedAdmin: !!adminData && adminData.status === 1
    };
};