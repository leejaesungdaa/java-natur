import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        
        if (!username) {
            return NextResponse.json({ available: false }, { status: 400 });
        }

        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
            const { getFirestore } = await import('firebase-admin/firestore');
            const { adminApp } = await import('@/lib/firebase/admin');
            
            if (adminApp) {
                const db = getFirestore(adminApp);
                const adminsRef = db.collection('admins');
                const snapshot = await adminsRef.where('username', '==', username).limit(1).get();
                
                return NextResponse.json({ 
                    available: snapshot.empty 
                });
            }
        }
        
        return NextResponse.json({ available: true });
    } catch (error) {
        console.error('Username check error:', error);
        return NextResponse.json({ available: true });
    }
}