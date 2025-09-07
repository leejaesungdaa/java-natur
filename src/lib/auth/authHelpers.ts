import { auth, db } from '@/lib/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const checkAuthStatus = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

export const getCookieValue = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export const clearAuthCookies = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
};

export interface AdminUserInfo {
    uid: string;
    username: string;
    name: string;
}

export const getCurrentAdminInfo = async (): Promise<AdminUserInfo | null> => {
    try {
        const user = auth.currentUser;
        if (!user) return null;
        
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (!adminDoc.exists()) return null;
        
        const data = adminDoc.data();
        return {
            uid: user.uid,
            username: data.username || 'Unknown',
            name: data.name || 'Unknown User'
        };
    } catch (error) {
        console.error('Error getting admin info:', error);
        return null;
    }
};