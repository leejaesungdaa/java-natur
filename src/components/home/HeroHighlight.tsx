'use client';

import { motion } from 'framer-motion';

interface HeroHighlightProps {
    text: string;
    highlightedText: string;
}

export default function HeroHighlight({ text, highlightedText }: HeroHighlightProps) {
    const parts = text.split(highlightedText);
    
    return (
        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
            {parts[0]}
            <motion.span
                initial={{
                    backgroundColor: "rgba(34, 197, 94, 0)",
                    color: "white",
                    scale: 1,
                    y: 0,
                    boxShadow: "0 0 0 rgba(34, 197, 94, 0)"
                }}
                animate={{
                    backgroundColor: ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.7)", "rgba(34, 197, 94, 0)"],
                    color: ["white", "#ffffff", "white"],
                    scale: [1, 1.25, 1],
                    y: [0, -8, 0],
                    boxShadow: [
                        "0 0 0 rgba(34, 197, 94, 0)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 0 rgba(34, 197, 94, 0)"
                    ],
                    textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 15px rgba(255,255,255,1)",
                        "0 0 0px rgba(255,255,255,0)"
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: "easeInOut"
                }}
                className="relative font-bold px-3 py-1 rounded-md mx-2 inline-block"
            >
                <span className="relative z-10">{highlightedText}</span>
            </motion.span>
            {parts[1]}
        </p>
    );
}