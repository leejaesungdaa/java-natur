'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLocalization } from '@/hooks/useLocalization';

interface ModernHeroSectionProps {
    t: any;
}

export default function ModernHeroSection({ t }: ModernHeroSectionProps) {
    const { locale } = useLocalization();
    
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/hero-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            </div>
            
            <motion.div 
                className="container mx-auto px-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-6 py-2 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-full text-sm font-semibold tracking-wider uppercase">
                            Premium Quality Since 2016
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {t.home.hero.title}
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <span className="text-green-400 font-semibold">
                            {t.home.hero.highlightedText}
                        </span>
                        {' '}{t.home.hero.subtitle.replace(t.home.hero.highlightedText, '')}
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => window.location.href = `/${locale}/products`}
                            className="inline-flex items-center"
                        >
                            {t.common.buttons.viewAll}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        
                        <Button
                            variant="secondary"
                            size="lg"
                            className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 inline-flex items-center"
                        >
                            <PlayCircle className="w-5 h-5 mr-2" />
                            {t.common.buttons.watchVideo}
                        </Button>
                    </motion.div>
                </div>
                
                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
                    </div>
                </motion.div>
            </motion.div>
            
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
        </section>
    );
}