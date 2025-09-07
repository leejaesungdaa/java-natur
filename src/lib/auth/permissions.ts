import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';

export interface UserPermissions {
    employeeManagement?: boolean;
    websiteManagement?: boolean;
    dashboard?: boolean;
    media?: boolean;
}

export async function getUserPermissions(): Promise<UserPermissions | null> {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            return null;
        }
        
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        
        if (!adminDoc.exists()) {
            return null;
        }
        
        const data = adminDoc.data();
        return data.permissions || {};
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return null;
    }
}

export async function checkPermission(permission: keyof UserPermissions): Promise<boolean> {
    const permissions = await getUserPermissions();
    
    if (!permissions) {
        return false;
    }
    
    return permissions[permission] === true;
}

export async function checkPagePermission(page: string): Promise<boolean> {
    switch(page) {
        case '/admin/employees':
            return await checkPermission('employeeManagement');
        case '/admin/website':
            return await checkPermission('websiteManagement');
        case '/admin/dashboard':
            return await checkPermission('dashboard');
        case '/admin/media':
            return await checkPermission('media');
        default:
            return true; // Allow access to other pages by default
    }
}