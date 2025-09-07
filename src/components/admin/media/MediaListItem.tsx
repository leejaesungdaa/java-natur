import React, { memo } from 'react';
import { Image as ImageIcon, Video, File, Eye, Download, Trash2 } from 'lucide-react';
import { MediaFile } from '@/hooks/useMediaUpload';

interface MediaListItemProps {
    file: MediaFile;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onPreview: () => void;
    formatFileSize: (bytes: number) => string;
    t: (key: string) => string;
}

export const MediaListItem = memo<MediaListItemProps>(({ 
    file, 
    isSelected, 
    onSelect, 
    onDelete, 
    onPreview,
    formatFileSize,
    t
}) => {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                />
            </td>
            <td className="p-4 flex items-center gap-3">
                {file.type === 'image' ? (
                    <ImageIcon size={20} className="text-green-600" />
                ) : file.type === 'video' ? (
                    <Video size={20} className="text-blue-600" />
                ) : (
                    <File size={20} className="text-gray-600" />
                )}
                <span className="font-medium">{file.name}</span>
            </td>
            <td className="p-4">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {file.type}
                </span>
            </td>
            <td className="p-4 text-gray-600">
                {formatFileSize(file.size)}
            </td>
            <td className="p-4 text-gray-600">
                {file.uploadedAt.toLocaleDateString()}
            </td>
            <td className="p-4">
                <div className="flex gap-2">
                    <button
                        onClick={onPreview}
                        className="text-gray-600 hover:text-green-600"
                    >
                        <Eye size={18} />
                    </button>
                    <a
                        href={file.url}
                        download={file.name}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        <Download size={18} />
                    </a>
                    <button
                        onClick={onDelete}
                        className="text-gray-600 hover:text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

MediaListItem.displayName = 'MediaListItem';