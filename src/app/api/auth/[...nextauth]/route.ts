import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateAdminCredentials } from '@/lib/auth/config';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                
                const isValid = await validateAdminCredentials(
                    credentials.email,
                    credentials.password
                );
                
                if (isValid) {
                    return {
                        id: '1',
                        email: credentials.email,
                        name: 'Administrator',
                        role: 'admin'
                    };
                }
                
                return null;
            }
        })
    ],
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };