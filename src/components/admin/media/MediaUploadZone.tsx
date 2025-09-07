import React, { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface MediaUploadZoneProps {
    t: (key: string) => string;
    onDrop: (files: File[]) => void;
    uploading: boolean;
}

export const MediaUploadZone = memo<MediaUploadZoneProps>(({ t, onDrop, uploading }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
            'video/*': ['.mp4', '.webm', '.ogg'],
            'application/pdf': ['.pdf']
        }
    });

    return (
        <>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg font-medium text-gray-700">
                    {t(isDragActive ? 'media.upload.dragDropActive' : 'media.upload.dragDrop')}
                </p>
                <p className="text-sm text-gray-500 mt-2">{t('media.upload.clickBrowse')}</p>
                <p className="text-xs text-gray-400 mt-4">{t('media.upload.formats')}</p>
            </div>

            {uploading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">{t('media.upload.uploading')}</span>
                </div>
            )}
        </>
    );
});

MediaUploadZone.displayName = 'MediaUploadZone';