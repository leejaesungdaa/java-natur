'use client';

import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    activeCategory: string;
    onChange: (categoryId: string) => void;
}

export default function CategoryFilter({
    categories,
    activeCategory,
    onChange
}: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    onClick={() => onChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {category.name}
                </motion.button>
            ))}
        </div>
    );
}