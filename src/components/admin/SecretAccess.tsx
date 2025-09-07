'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SECRET_ADMIN_PATH } from '@/lib/auth/config';

export default function SecretAccess() {
    const router = useRouter();
    
    useEffect(() => {
        let keys: string[] = [];
        const keyMap: { [key: string]: string } = {
            'Control': 'ctrl',
            'Shift': 'shift',
            'a': 'a',
            'A': 'a'
        };
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.key) return;
            
            const key = keyMap[e.key] || (typeof e.key === 'string' ? e.key.toLowerCase() : '');
            if (key && !keys.includes(key)) {
                keys.push(key);
            }
            
            if (keys.includes('ctrl') && keys.includes('shift') && keys.includes('a')) {
                e.preventDefault();
                router.push('/admin/login');
                keys = [];
            }
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.key) return;
            
            const key = keyMap[e.key] || (typeof e.key === 'string' ? e.key.toLowerCase() : '');
            if (key) {
                keys = keys.filter(k => k !== key);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [router]);
    
    return null;
}