import bcrypt from 'bcryptjs';

export const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin@naturjava.com',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('Admin@2025!', 10)
};

export const SECRET_ADMIN_PATH = process.env.SECRET_ADMIN_PATH || 'ctrl-shift-a';

export const validateAdminCredentials = async (email: string, password: string): Promise<boolean> => {
    if (email !== ADMIN_CREDENTIALS.email) return false;
    return bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
};