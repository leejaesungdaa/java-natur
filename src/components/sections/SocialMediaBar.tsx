'use client';

import { motion } from 'framer-motion';

interface SocialMedia {
    name: string;
    icon: React.ReactNode;
    url: string;
}

interface SocialMediaBarProps {
    socials: SocialMedia[];
    color?: 'light' | 'dark';
}

export default function SocialMediaBar({
    socials,
    color = 'light'
}: SocialMediaBarProps) {
    const textColor = color === 'light' ? 'text-white' : 'text-gray-900';
    const hoverColor = color === 'light' ? 'hover:text-white/80' : 'hover:text-gray-600';

    return (
        <div className="flex justify-center space-x-8">
            {socials.map((social) => (
                <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textColor} ${hoverColor} transition-colors relative group`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {social.icon}
                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {social.name}
                    </span>
                </motion.a>
            ))}
        </div>
    );
}