'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GoogleMapProps {
    address: string;
    height?: string;
}

export default function GoogleMap({ address, height = '300px' }: GoogleMapProps) {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`;

    return (
        <div className="w-full rounded-xl overflow-hidden shadow-md">
            <motion.iframe
                src={mapUrl}
                width="100%"
                height={height}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            ></motion.iframe>
        </div>
    );
}