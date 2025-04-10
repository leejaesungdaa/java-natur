import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';

const baseUrl = 'https://naturjava.com';

const productIds = [
    'apple-cider-vinegar',
    'rice-vinegar',
    'coconut-vinegar',
    'balsamic-vinegar',
    'white-vinegar',
    'red-wine-vinegar'
];

const articleIds = [
    'health-benefits',
    'culinary-uses',
    'production-process',
    'types-of-vinegar',
    'vinegar-history',
    'vinegar-in-home'
];

const videoIds = [
    'video-1',
    'video-2',
    'video-3',
    'video-4'
];

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap = [];

    locales.forEach(locale => {
        staticPages.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        });

        ['company', 'vinegar-story', 'products', 'support'].forEach(route => {
            staticPages.push({
                url: `${baseUrl}/${locale}/${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8
            });
        });

        ['privacy', 'terms'].forEach(route => {
            staticPages.push({
                url: `${baseUrl}/${locale}/${route}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.3
            });
        });

        productIds.forEach(productId => {
            staticPages.push({
                url: `${baseUrl}/${locale}/products/${productId}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7
            });
        });

        articleIds.forEach(articleId => {
            staticPages.push({
                url: `${baseUrl}/${locale}/vinegar-story/${articleId}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6
            });
        });

        videoIds.forEach(videoId => {
            staticPages.push({
                url: `${baseUrl}/${locale}/vinegar-story/videos/${videoId}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6
            });
        });
    });

    return staticPages;
}