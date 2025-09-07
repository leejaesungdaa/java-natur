'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Trash2, Search, Filter, Grid, List } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { useMediaUpload, MediaFile } from '@/hooks/useMediaUpload';
import { MediaUploadZone } from '@/components/admin/media/MediaUploadZone';
import { MediaFileCard } from '@/components/admin/media/MediaFileCard';
import { MediaListItem } from '@/components/admin/media/MediaListItem';
import { MediaPreview } from '@/components/admin/media/MediaPreview';

export default function MediaGallery() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const { uploading, uploadFiles } = useMediaUpload();
    
    const t = useMemo(() => {
        const translations = getAdminTranslation('ko');
        return (key: string) => {
            const keys = key.split('.');
            let value: any = translations;
            for (const k of keys) {
                value = value?.[k];
            }
            return value || key;
        };
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            loadMediaFiles();
        }
    }, [status, router]);

    const loadMediaFiles = async () => {
        const mockFiles: MediaFile[] = [
            { id: '1', name: 'hero-banner.jpg', url: '/images/hero-bg.jpg', type: 'image', size: 245000, uploadedAt: new Date() },
            { id: '2', name: 'product-1.jpg', url: '/images/products/product-1.jpg', type: 'image', size: 180000, uploadedAt: new Date() },
            { id: '3', name: 'product-2.jpg', url: '/images/products/product-2.jpg', type: 'image', size: 195000, uploadedAt: new Date() },
        ];
        setFiles(mockFiles);
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedFiles = await uploadFiles(acceptedFiles);
        
        uploadedFiles.forEach(file => {
            setFiles(prev => [file, ...prev]);
            toast.success(t('media.toast.uploadSuccess').replace('{filename}', file.name));
        });
        
        const failedCount = acceptedFiles.length - uploadedFiles.length;
        if (failedCount > 0) {
            toast.error(t('media.toast.uploadFailed').replace('{filename}', `${failedCount} files`));
        }
    }, [uploadFiles, t]);

    const handleDelete = useCallback(async (fileId: string) => {``
        if (confirm(t('media.confirmDelete'))) {
            try {
                setFiles(prev => prev.filter(f => f.id !== fileId));
                toast.success(t('media.toast.deleteSuccess'));
            } catch (error) {
                toast.error(t('media.toast.deleteFailed'));
            }
        }
    }, [t]);

    const handleBulkDelete = useCallback(async () => {
        const confirmMessage = t('media.confirmBulkDelete').replace('{count}', selectedFiles.length.toString());
        if (confirm(confirmMessage)) {
            setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
            setSelectedFiles([]);
            toast.success(t('media.toast.bulkDeleteSuccess'));
        }
    }, [selectedFiles, t]);

    const toggleFileSelection = useCallback((fileId: string) => {
        setSelectedFiles(prev => {
            const isSelected = prev.includes(fileId);
            return isSelected
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId];
        });
    }, []);

    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || file.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [files, searchQuery, filterType]);

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }, []);

    if (status === 'loading') {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('media.title')}</h1>
                        <p className="text-gray-600 mt-1">{t('media.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedFiles.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={18} />
                                {t('media.bulkDelete')} ({selectedFiles.length})
                            </button>
                        )}
                        <div className="flex items-center bg-white border rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('media.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">{t('media.filter.all')}</option>
                        <option value="image">{t('media.filter.images')}</option>
                        <option value="video">{t('media.filter.videos')}</option>
                        <option value="document">{t('media.filter.documents')}</option>
                    </select>
                </div>

                <MediaUploadZone t={t} onDrop={onDrop} uploading={uploading} />

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredFiles.map((file) => (
                            <MediaFileCard
                                key={file.id}
                                file={file}
                                isSelected={selectedFiles.includes(file.id)}
                                onSelect={() => toggleFileSelection(file.id)}
                                onDelete={() => handleDelete(file.id)}
                                onPreview={() => setPreviewFile(file)}
                                formatFileSize={formatFileSize}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="text-left p-4">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                setSelectedFiles(
                                                    e.target.checked
                                                        ? filteredFiles.map(f => f.id)
                                                        : []
                                                );
                                            }}
                                            checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                                        />
                                    </th>
                                    <th className="text-left p-4">{t('media.table.name')}</th>
                                    <th className="text-left p-4">{t('media.table.type')}</th>
                                    <th className="text-left p-4">{t('media.table.size')}</th>
                                    <th className="text-left p-4">{t('media.table.uploaded')}</th>
                                    <th className="text-left p-4">{t('media.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map((file) => (
                                    <MediaListItem
                                        key={file.id}
                                        file={file}
                                        isSelected={selectedFiles.includes(file.id)}
                                        onSelect={() => toggleFileSelection(file.id)}
                                        onDelete={() => handleDelete(file.id)}
                                        onPreview={() => setPreviewFile(file)}
                                        formatFileSize={formatFileSize}
                                        t={t}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <MediaPreview 
                    file={previewFile} 
                    onClose={() => setPreviewFile(null)} 
                    t={t} 
                />
            </div>
        </AdminLayout>
    );
}