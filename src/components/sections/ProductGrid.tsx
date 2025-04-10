'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Locale, getTranslation } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface Product {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    category?: string;
}

interface ProductGridProps {
    locale: Locale;
    products: Product[];
    columns?: 2 | 3 | 4;
    showCategory?: boolean;
    withAnimation?: boolean;
}

export default function ProductGrid({
    locale,
    products,
    columns = 3,
    showCategory = false,
    withAnimation = true,
}: ProductGridProps) {
    const t = getTranslation(locale);
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const colsClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
        <motion.div
            ref={ref}
            initial={withAnimation ? "hidden" : false}
            animate={withAnimation && isVisible ? "visible" : false}
            variants={staggerContainer()}
            className={`grid grid-cols-1 ${colsClass} gap-8`}
        >
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    custom={index}
                    variants={withAnimation ? getAnimationVariant('stagger') : undefined}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                >
                    <div className="relative h-64 w-full overflow-hidden">
                        <Image
                            src={product.imageSrc}
                            alt={product.name}
                            fill
                            priority={index === 0}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-8">
                        {showCategory && product.category && (
                            <div className="mb-2">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {product.category}
                                </span>
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 mb-6">{product.description}</p>
                        <div className="flex space-x-3">
                            <Button
                                href={`/${locale}/products/${product.id}`}
                                variant="outline"
                                className="flex-1 justify-center"
                            >
                                {t.common.buttons.readMore}
                            </Button>
                            <Button
                                href={`/${locale}/products/${product.id}#buy`}
                                className="flex-1 justify-center"
                            >
                                {t.common.buttons.buyNow}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}