import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Video, File, Eye, Check, Trash2 } from 'lucide-react';
import { MediaFile } from '@/hooks/useMediaUpload';

interface MediaFileCardProps {
    file: MediaFile;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onPreview: () => void;
    formatFileSize: (bytes: number) => string;
}

export const MediaFileCard = memo<MediaFileCardProps>(({ 
    file, 
    isSelected, 
    onSelect, 
    onDelete, 
    onPreview,
    formatFileSize 
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all"
        >
            <div
                className="relative aspect-square cursor-pointer"
                onClick={onPreview}
            >
                {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {file.type === 'video' ? 
                            <Video size={48} className="text-gray-400" /> : 
                            <File size={48} className="text-gray-400" />
                        }
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="text-white" size={24} />
                </div>
            </div>
            <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    className={`p-1 rounded ${
                        isSelected ? 'bg-green-600 text-white' : 'bg-white text-gray-600'
                    }`}
                >
                    <Check size={16} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1 bg-white text-red-600 rounded hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
});

MediaFileCard.displayName = 'MediaFileCard';