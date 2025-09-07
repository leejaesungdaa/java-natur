import { useState, useCallback } from 'react';
import { imageService } from '@/lib/firebase/services';
import toast from 'react-hot-toast';

export interface MediaFile {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'video' | 'document';
    size: number;
    uploadedAt: Date;
}

export const useMediaUpload = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFiles = useCallback(async (files: File[]): Promise<MediaFile[]> => {
        setUploading(true);
        const uploadedFiles: MediaFile[] = [];

        for (const file of files) {
            try {
                const path = `uploads/${Date.now()}_${file.name}`;
                const url = await imageService.uploadImage(file, path);
                
                const newFile: MediaFile = {
                    id: Date.now().toString(),
                    name: file.name,
                    url,
                    type: file.type.startsWith('image/') ? 'image' : 
                          file.type.startsWith('video/') ? 'video' : 'document',
                    size: file.size,
                    uploadedAt: new Date()
                };
                
                uploadedFiles.push(newFile);
            } catch (error) {
                console.error(`Failed to upload ${file.name}`, error);
            }
        }
        
        setUploading(false);
        return uploadedFiles;
    }, []);

    return { uploading, uploadFiles };
};