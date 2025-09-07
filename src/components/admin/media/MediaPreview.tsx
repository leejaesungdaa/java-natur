import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, File } from 'lucide-react';
import { MediaFile } from '@/hooks/useMediaUpload';

interface MediaPreviewProps {
    file: MediaFile | null;
    onClose: () => void;
    t: (key: string) => string;
}

export const MediaPreview = memo<MediaPreviewProps>(({ file, onClose, t }) => {
    if (!file) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">{file.name}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4">
                        {file.type === 'image' ? (
                            <img src={file.url} alt={file.name} className="max-w-full" />
                        ) : file.type === 'video' ? (
                            <video src={file.url} controls className="max-w-full" />
                        ) : (
                            <div className="text-center py-12">
                                <File size={64} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">{t('media.preview.notAvailable')}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

MediaPreview.displayName = 'MediaPreview';