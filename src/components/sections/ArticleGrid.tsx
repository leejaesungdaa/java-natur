'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { Locale } from '@/lib/i18n/config';
import { useAnimation, getAnimationVariant, staggerContainer } from '@/hooks/useAnimation';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    imageSrc: string;
    date: string;
    category: string;
}

interface ArticleGridProps {
    locale: Locale;
    articles: Article[];
    columns?: 2 | 3 | 4;
}

export default function ArticleGrid({
    locale,
    articles,
    columns = 3
}: ArticleGridProps) {
    const [ref, isVisible] = useAnimation({ threshold: 0.2 });

    const colsClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer()}
            className={`grid grid-cols-1 ${colsClass} gap-8`}
        >
            {articles.map((article, index) => (
                <motion.div
                    key={article.id}
                    custom={index}
                    variants={getAnimationVariant('stagger')}
                >
                    <Card
                        title={article.title}
                        description={article.excerpt}
                        imageSrc={article.imageSrc}
                        imageAlt={article.title}
                        href={`/${locale}/vinegar-story/${article.id}`}
                        tags={[article.category]}
                        date={article.date}
                        locale={locale}
                        elevation="md"
                        aspectRatio="video"
                        imageOverlay={true}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}