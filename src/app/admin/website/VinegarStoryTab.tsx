import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Upload, FileText, Video, Factory, Calendar, Clock, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy, getDocsFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { imageService } from '@/lib/firebase/services';
import { getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { formatJakartaTime } from '@/lib/utils/dateFormat';
import { scrollToForm } from '@/lib/utils/scrollToForm';

interface VinegarStoryTabProps {
    currentLocale: string;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    t: any;
    onEditingChange?: (editing: boolean) => void;
    refreshKey?: number;
}

interface StoryItem {
    id?: string;
    category?: string;
    title: string;
    title_ko?: string;
    title_en?: string;
    title_id?: string;
    title_zh?: string;
    title_ja?: string;
    title_ar?: string;
    summary: string;
    summary_ko?: string;
    summary_en?: string;
    summary_id?: string;
    summary_zh?: string;
    summary_ja?: string;
    summary_ar?: string;
    content: string;
    content_ko?: string;
    content_en?: string;
    content_id?: string;
    content_zh?: string;
    content_ja?: string;
    content_ar?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    isDeleted?: boolean;
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
    [key: `title_${string}`]: string | undefined;
    [key: `summary_${string}`]: string | undefined;
    deletedBy?: string;
    deletedByName?: string;
    deletedAt?: string;
}

interface VideoItem {
    id?: string;
    title: string;
    title_ko?: string;
    title_en?: string;
    title_id?: string;
    title_zh?: string;
    title_ja?: string;
    title_ar?: string;
    description: string;
    description_ko?: string;
    description_en?: string;
    description_id?: string;
    description_zh?: string;
    description_ja?: string;
    description_ar?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isFeatured?: boolean;
    isDeleted?: boolean;
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
    deletedBy?: string;
    [key: `title_${string}`]: string | undefined;
    [key: `description_${string}`]: string | undefined;
    deletedByName?: string;
    deletedAt?: string;
}

interface ProcessItem {
    id?: string;
    step?: number;
    title: string;
    title_ko?: string;
    title_en?: string;
    title_id?: string;
    title_zh?: string;
    title_ja?: string;
    title_ar?: string;
    description: string;
    description_ko?: string;
    description_en?: string;
    description_id?: string;
    description_zh?: string;
    description_ja?: string;
    description_ar?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    isDeleted?: boolean;
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedByName?: string;
    [key: `title_${string}`]: string | undefined;
    [key: `description_${string}`]: string | undefined;
    updatedAt?: string;
    deletedBy?: string;
    deletedByName?: string;
    deletedAt?: string;
}

type SubTabType = 'about' | 'videos' | 'process';

export const VinegarStoryTab: React.FC<VinegarStoryTabProps> = ({
    currentLocale,
    showToast,
    t,
    onEditingChange,
    refreshKey
}) => {
    const [activeSubTab, setActiveSubTab] = useState<SubTabType>('about');
    const [storyItems, setStoryItems] = useState<StoryItem[]>([]);
    const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
    const [processItems, setProcessItems] = useState<ProcessItem[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editingType, setEditingType] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAllData();
    }, []);

    useEffect(() => {
        if (onEditingChange) {
            onEditingChange(!!editingItem || saving || uploading);
        }
    }, [editingItem, saving, uploading, onEditingChange]);

    // Load data when refreshKey changes
    useEffect(() => {
        if (refreshKey !== undefined && refreshKey > 0) {
            loadAllDataSilent();
        }
    }, [refreshKey]);

    const loadAllData = async (silent = false) => {
        if (!silent && initialLoad) {
            setLoading(true);
        }
        try {
            await Promise.all([
                loadStoryItems(),
                loadVideoItems(),
                loadProcessItems()
            ]);
            if (initialLoad) {
                setInitialLoad(false);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            if (!silent) {
                showToast(
                    currentLocale === 'ko' ? '데이터 로드에 실패했습니다' :
                    currentLocale === 'en' ? 'Failed to load data' :
                    currentLocale === 'id' ? 'Gagal memuat data' :
                    currentLocale === 'zh' ? '加载数据失败' :
                    currentLocale === 'ja' ? 'データの読み込みに失敗しました' :
                    currentLocale === 'ar' ? 'فشل تحميل البيانات' :
                    'Failed to load data',
                    'error'
                );
            }
        } finally {
            if (!silent && initialLoad) {
                setLoading(false);
            }
        }
    };

    const loadAllDataSilent = async () => {
        await loadAllData(true);
    };

    const loadStoryItems = async () => {
        const q = query(collection(db, 'vinegar_stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocsFromServer(q);
        const items: StoryItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.isDeleted) {
                items.push({ id: doc.id, ...data } as StoryItem);
            }
        });
        setStoryItems(items);
    };

    const loadVideoItems = async () => {
        const q = query(collection(db, 'vinegar_videos'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocsFromServer(q);
        const items: VideoItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.isDeleted) {
                items.push({ id: doc.id, ...data } as VideoItem);
            }
        });
        setVideoItems(items);
    };

    const loadProcessItems = async () => {
        const q = query(collection(db, 'vinegar_process'), orderBy('step', 'asc'));
        const querySnapshot = await getDocsFromServer(q);
        const items: ProcessItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.isDeleted) {
                items.push({ id: doc.id, ...data } as ProcessItem);
            }
        });
        setProcessItems(items);
    };

    const handleImageUpload = async (file: File, isProcess?: boolean) => {
        try {
            setUploading(true);
            const folder = isProcess ? 'vinegar-process' : 'vinegar-story';
            const path = `${folder}/${Date.now()}_${file.name}`;
            const url = await imageService.uploadImage(file, path);
            
            if (editingType === 'process' || isProcess) {
                setEditingItem({ ...editingItem, imageUrl: url });
            } else {
                setEditingItem({ ...editingItem, imageUrl: url });
            }
            
            showToast(
                currentLocale === 'ko' ? '이미지가 업로드되었습니다' :
                currentLocale === 'en' ? 'Image uploaded successfully' :
                currentLocale === 'id' ? 'Gambar berhasil diunggah' :
                currentLocale === 'zh' ? '图片上传成功' :
                currentLocale === 'ja' ? '画像がアップロードされました' :
                currentLocale === 'ar' ? 'تم تحميل الصورة بنجاح' :
                'Image uploaded successfully',
                'success'
            );
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '이미지 업로드 실패' :
                currentLocale === 'en' ? 'Failed to upload image' :
                currentLocale === 'id' ? 'Gagal mengunggah gambar' :
                currentLocale === 'zh' ? '图片上传失败' :
                currentLocale === 'ja' ? '画像のアップロードに失敗しました' :
                currentLocale === 'ar' ? 'فشل تحميل الصورة' :
                'Failed to upload image',
                'error'
            );
        } finally {
            setUploading(false);
        }
    };

    const handleThumbnailUpload = async (file: File) => {
        try {
            setUploading(true);
            const path = `vinegar-videos/thumbnails/${Date.now()}_${file.name}`;
            const url = await imageService.uploadImage(file, path);
            setEditingItem({ ...editingItem, thumbnailUrl: url });
            showToast(
                currentLocale === 'ko' ? '썸네일이 업로드되었습니다' :
                currentLocale === 'en' ? 'Thumbnail uploaded successfully' :
                currentLocale === 'id' ? 'Thumbnail berhasil diunggah' :
                currentLocale === 'zh' ? '缩略图上传成功' :
                currentLocale === 'ja' ? 'サムネイルがアップロードされました' :
                currentLocale === 'ar' ? 'تم تحميل الصورة المصغرة بنجاح' :
                'Thumbnail uploaded successfully',
                'success'
            );
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '썸네일 업로드 실패' :
                currentLocale === 'en' ? 'Failed to upload thumbnail' :
                currentLocale === 'id' ? 'Gagal mengunggah thumbnail' :
                currentLocale === 'zh' ? '缩略图上传失败' :
                currentLocale === 'ja' ? 'サムネイルのアップロードに失敗しました' :
                currentLocale === 'ar' ? 'فشل تحميل الصورة المصغرة' :
                'Failed to upload thumbnail',
                'error'
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSaveStory = async () => {
        if (!editingItem.title || !editingItem.summary || !editingItem.content) {
            showToast(
                currentLocale === 'ko' ? '모든 항목을 입력해주세요' :
                currentLocale === 'en' ? 'Please fill in all fields' :
                currentLocale === 'id' ? 'Silakan isi semua bidang' :
                currentLocale === 'zh' ? '请填写所有字段' :
                currentLocale === 'ja' ? 'すべての項目を入力してください' :
                currentLocale === 'ar' ? 'يرجى ملء جميع الحقول' :
                'Please fill in all fields',
                'error'
            );
            return;
        }

        if (!editingItem.imageUrl) {
            showToast(
                currentLocale === 'ko' ? '이미지를 업로드해주세요' :
                currentLocale === 'en' ? 'Please upload an image' :
                currentLocale === 'id' ? 'Silakan unggah gambar' :
                currentLocale === 'zh' ? '请上传图片' :
                currentLocale === 'ja' ? '画像をアップロードしてください' :
                currentLocale === 'ar' ? 'يرجى تحميل صورة' :
                'Please upload an image',
                'error'
            );
            return;
        }

        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            const saveData = {
                [`title_${currentLocale}`]: editingItem.title,
                [`summary_${currentLocale}`]: editingItem.summary,
                [`content_${currentLocale}`]: editingItem.content,
                imageUrl: editingItem.imageUrl || '',
                isFeatured: editingItem.isFeatured || false,
                category: editingItem.category || 'health',
                isDeleted: false
            };

            if (editingItem.id) {
                await updateDoc(doc(db, 'vinegar_stories', editingItem.id), {
                    ...saveData,
                    updatedBy: adminInfo?.uid || '',
                    updatedByName: adminInfo?.name || 'Unknown',
                    updatedAt: now
                });
            } else {
                await addDoc(collection(db, 'vinegar_stories'), {
                    ...saveData,
                    createdBy: adminInfo?.uid || '',
                    createdByName: adminInfo?.name || 'Unknown',
                    createdAt: now
                });
            }
            
            showToast(
                currentLocale === 'ko' ? '저장되었습니다' :
                currentLocale === 'en' ? 'Saved successfully' :
                currentLocale === 'id' ? 'Berhasil disimpan' :
                currentLocale === 'zh' ? '保存成功' :
                currentLocale === 'ja' ? '保存しました' :
                currentLocale === 'ar' ? 'تم الحفظ بنجاح' :
                'Saved successfully',
                'success'
            );
            await loadStoryItems();
            setEditingItem(null);
            setEditingType('');
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '저장에 실패했습니다' :
                currentLocale === 'en' ? 'Failed to save' :
                currentLocale === 'id' ? 'Gagal menyimpan' :
                currentLocale === 'zh' ? '保存失败' :
                currentLocale === 'ja' ? '保存に失敗しました' :
                currentLocale === 'ar' ? 'فشل الحفظ' :
                'Failed to save',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSaveVideo = async () => {
        if (!editingItem.title || !editingItem.description || !editingItem.videoUrl) {
            showToast(
                currentLocale === 'ko' ? '모든 항목을 입력해주세요' :
                currentLocale === 'en' ? 'Please fill in all fields' :
                currentLocale === 'id' ? 'Silakan isi semua bidang' :
                currentLocale === 'zh' ? '请填写所有字段' :
                currentLocale === 'ja' ? 'すべての項目を入力してください' :
                currentLocale === 'ar' ? 'يرجى ملء جميع الحقول' :
                'Please fill in all fields',
                'error'
            );
            return;
        }


        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            const saveData = {
                [`title_${currentLocale}`]: editingItem.title,
                [`description_${currentLocale}`]: editingItem.description,
                videoUrl: editingItem.videoUrl,
                thumbnailUrl: editingItem.thumbnailUrl || '',
                isFeatured: editingItem.isFeatured || false,
                isDeleted: false
            };

            if (editingItem.id) {
                await updateDoc(doc(db, 'vinegar_videos', editingItem.id), {
                    ...saveData,
                    updatedBy: adminInfo?.uid || '',
                    updatedByName: adminInfo?.name || 'Unknown',
                    updatedAt: now
                });
            } else {
                await addDoc(collection(db, 'vinegar_videos'), {
                    ...saveData,
                    createdBy: adminInfo?.uid || '',
                    createdByName: adminInfo?.name || 'Unknown',
                    createdAt: now
                });
            }
            
            showToast(
                currentLocale === 'ko' ? '저장되었습니다' :
                currentLocale === 'en' ? 'Saved successfully' :
                currentLocale === 'id' ? 'Berhasil disimpan' :
                currentLocale === 'zh' ? '保存成功' :
                currentLocale === 'ja' ? '保存しました' :
                currentLocale === 'ar' ? 'تم الحفظ بنجاح' :
                'Saved successfully',
                'success'
            );
            await loadVideoItems();
            setEditingItem(null);
            setEditingType('');
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '저장에 실패했습니다' :
                currentLocale === 'en' ? 'Failed to save' :
                currentLocale === 'id' ? 'Gagal menyimpan' :
                currentLocale === 'zh' ? '保存失败' :
                currentLocale === 'ja' ? '保存に失敗しました' :
                currentLocale === 'ar' ? 'فشل الحفظ' :
                'Failed to save',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProcess = async () => {
        if (!editingItem.title || !editingItem.description) {
            showToast(
                currentLocale === 'ko' ? '모든 항목을 입력하고 이미지를 등록해주세요' :
                currentLocale === 'en' ? 'Please fill in all fields and upload an image' :
                currentLocale === 'id' ? 'Silakan isi semua bidang dan unggah gambar' :
                currentLocale === 'zh' ? '请填写所有字段并上传图片' :
                currentLocale === 'ja' ? 'すべての項目を入力し、画像をアップロードしてください' :
                currentLocale === 'ar' ? 'يرجى ملء جميع الحقول وتحميل صورة' :
                'Please fill in all fields and upload an image',
                'error'
            );
            return;
        }

        // Validate step number
        const stepNum = editingItem.step || 1;
        if (stepNum < 1) {
            showToast(
                currentLocale === 'ko' ? '순서는 1 이상이어야 합니다' :
                currentLocale === 'en' ? 'Step must be 1 or greater' :
                currentLocale === 'id' ? 'Langkah harus 1 atau lebih' :
                currentLocale === 'zh' ? '步骤必须为1或更大' :
                currentLocale === 'ja' ? 'ステップは1以上でなければなりません' :
                currentLocale === 'ar' ? 'يجب أن تكون الخطوة 1 أو أكبر' :
                'Step must be 1 or greater',
                'error'
            );
            return;
        }

        // Check for duplicate step numbers
        const existingSteps = processItems
            .filter(item => item.id !== editingItem.id)
            .map(item => item.step);
        
        if (existingSteps.includes(stepNum)) {
            showToast(
                currentLocale === 'ko' ? `순서 ${stepNum}은(는) 이미 사용중입니다` :
                currentLocale === 'en' ? `Step ${stepNum} is already in use` :
                currentLocale === 'id' ? `Langkah ${stepNum} sudah digunakan` :
                currentLocale === 'zh' ? `步骤 ${stepNum} 已被使用` :
                currentLocale === 'ja' ? `ステップ ${stepNum} は既に使用されています` :
                currentLocale === 'ar' ? `الخطوة ${stepNum} مستخدمة بالفعل` :
                `Step ${stepNum} is already in use`,
                'error'
            );
            return;
        }

        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            const saveData = {
                step: stepNum,
                [`title_${currentLocale}`]: editingItem.title,
                [`description_${currentLocale}`]: editingItem.description,
                imageUrl: editingItem.imageUrl || '',
                isDeleted: false
            };

            if (editingItem.id) {
                await updateDoc(doc(db, 'vinegar_process', editingItem.id), {
                    ...saveData,
                    updatedBy: adminInfo?.uid || '',
                    updatedByName: adminInfo?.name || 'Unknown',
                    updatedAt: now
                });
            } else {
                await addDoc(collection(db, 'vinegar_process'), {
                    ...saveData,
                    createdBy: adminInfo?.uid || '',
                    createdByName: adminInfo?.name || 'Unknown',
                    createdAt: now
                });
            }
            
            showToast(
                currentLocale === 'ko' ? '저장되었습니다' :
                currentLocale === 'en' ? 'Saved successfully' :
                currentLocale === 'id' ? 'Berhasil disimpan' :
                currentLocale === 'zh' ? '保存成功' :
                currentLocale === 'ja' ? '保存しました' :
                currentLocale === 'ar' ? 'تم الحفظ بنجاح' :
                'Saved successfully',
                'success'
            );
            await loadProcessItems();
            setEditingItem(null);
            setEditingType('');
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '저장에 실패했습니다' :
                currentLocale === 'en' ? 'Failed to save' :
                currentLocale === 'id' ? 'Gagal menyimpan' :
                currentLocale === 'zh' ? '保存失败' :
                currentLocale === 'ja' ? '保存に失敗しました' :
                currentLocale === 'ar' ? 'فشل الحفظ' :
                'Failed to save',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (collection: string, id: string) => {
        if (!confirm(
            currentLocale === 'ko' ? '정말 삭제하시겠습니까?' :
            currentLocale === 'en' ? 'Are you sure you want to delete this item?' :
            currentLocale === 'id' ? 'Apakah Anda yakin ingin menghapus item ini?' :
            currentLocale === 'zh' ? '您确定要删除此项吗？' :
            currentLocale === 'ja' ? 'このアイテムを削除してもよろしいですか？' :
            currentLocale === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر؟' :
            'Are you sure you want to delete this item?'
        )) return;
        
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            await updateDoc(doc(db, collection, id), {
                isDeleted: true,
                deletedBy: adminInfo?.uid || '',
                deletedByName: adminInfo?.name || 'Unknown',
                deletedAt: now
            });
            
            showToast(
                currentLocale === 'ko' ? '삭제되었습니다' :
                currentLocale === 'en' ? 'Deleted successfully' :
                currentLocale === 'id' ? 'Berhasil dihapus' :
                currentLocale === 'zh' ? '删除成功' :
                currentLocale === 'ja' ? '削除しました' :
                currentLocale === 'ar' ? 'تم الحذف بنجاح' :
                'Deleted successfully',
                'success'
            );
            await loadAllData();
        } catch (error) {
            showToast(
                currentLocale === 'ko' ? '삭제에 실패했습니다' :
                currentLocale === 'en' ? 'Failed to delete' :
                currentLocale === 'id' ? 'Gagal menghapus' :
                currentLocale === 'zh' ? '删除失败' :
                currentLocale === 'ja' ? '削除に失敗しました' :
                currentLocale === 'ar' ? 'فشل الحذف' :
                'Failed to delete',
                'error'
            );
        }
    };

    const handleEdit = (item: any, type: string) => {
        const localizedItem = {
            ...item,
            title: item[`title_${currentLocale}`] || item.title || '',
            summary: item[`summary_${currentLocale}`] || item.summary || '',
            content: item[`content_${currentLocale}`] || item.content || '',
            description: item[`description_${currentLocale}`] || item.description || ''
        };
        setEditingItem(localizedItem);
        setEditingType(type);
        scrollToForm();
    };

    const renderAboutTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    ℹ️ {
                        currentLocale === 'ko' ? '식초 이야기 > 식초에 대하여' :
                        currentLocale === 'en' ? 'Vinegar Story > About Vinegar' :
                        'Vinegar Story > About Vinegar'
                    }
                </p>
                <button
                    onClick={() => {
                        setEditingItem({
                            title: '',
                            summary: '',
                            content: '',
                            imageUrl: '',
                            isFeatured: false
                        });
                        setEditingType('story');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'story' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                    data-edit-form
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.title || 'Title'}
                        </label>
                        <input
                            type="text"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            placeholder={t.website?.title || 'Title'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={editingItem.isFeatured || false}
                                onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                                {currentLocale === 'ko' ? '메인 공지' :
                                 currentLocale === 'en' ? 'Featured' :
                                 currentLocale === 'id' ? 'Unggulan' :
                                 currentLocale === 'zh' ? '主要公告' :
                                 currentLocale === 'ja' ? 'メイン告知' :
                                 currentLocale === 'ar' ? 'إشعار رئيسي' :
                                 'Featured'}
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {currentLocale === 'ko' ? '카테고리' :
                                 currentLocale === 'en' ? 'Category' :
                                 currentLocale === 'id' ? 'Kategori' :
                                 currentLocale === 'zh' ? '类别' :
                                 currentLocale === 'ja' ? 'カテゴリー' :
                                 currentLocale === 'ar' ? 'الفئة' :
                                 'Category'}
                            </label>
                            <select
                                value={editingItem.category || 'health'}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="health">
                                    {currentLocale === 'ko' ? '건강' :
                                     currentLocale === 'en' ? 'Health' :
                                     currentLocale === 'id' ? 'Kesehatan' :
                                     currentLocale === 'zh' ? '健康' :
                                     currentLocale === 'ja' ? '健康' :
                                     currentLocale === 'ar' ? 'الصحة' :
                                     'Health'}
                                </option>
                                <option value="recipe">
                                    {currentLocale === 'ko' ? '레시피' :
                                     currentLocale === 'en' ? 'Recipe' :
                                     currentLocale === 'id' ? 'Resep' :
                                     currentLocale === 'zh' ? '食谱' :
                                     currentLocale === 'ja' ? 'レシピ' :
                                     currentLocale === 'ar' ? 'وصفة' :
                                     'Recipe'}
                                </option>
                                <option value="history">
                                    {currentLocale === 'ko' ? '역사' :
                                     currentLocale === 'en' ? 'History' :
                                     currentLocale === 'id' ? 'Sejarah' :
                                     currentLocale === 'zh' ? '历史' :
                                     currentLocale === 'ja' ? '歴史' :
                                     currentLocale === 'ar' ? 'التاريخ' :
                                     'History'}
                                </option>
                                <option value="tips">
                                    {currentLocale === 'ko' ? '활용팁' :
                                     currentLocale === 'en' ? 'Tips' :
                                     currentLocale === 'id' ? 'Tips' :
                                     currentLocale === 'zh' ? '小贴士' :
                                     currentLocale === 'ja' ? 'ヒント' :
                                     currentLocale === 'ar' ? 'نصائح' :
                                     'Tips'}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.summary || 'Summary'}
                        </label>
                        <textarea
                            value={editingItem.summary}
                            onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                            rows={2}
                            placeholder={t.website?.summary || 'Summary'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.content || 'Content'}
                        </label>
                        <textarea
                            value={editingItem.content}
                            onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                            rows={5}
                            placeholder={t.website?.content || 'Content'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '이미지' : 'Image'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                }}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <Upload size={16} />
                                {uploading ? (
                                    currentLocale === 'ko' ? '업로드 중...' :
                                    currentLocale === 'en' ? 'Uploading...' :
                                    currentLocale === 'id' ? 'Mengunggah...' :
                                    currentLocale === 'zh' ? '上传中...' :
                                    currentLocale === 'ja' ? 'アップロード中...' :
                                    currentLocale === 'ar' ? 'جاري التحميل...' :
                                    'Uploading...'
                                ) : (
                                    currentLocale === 'ko' ? '이미지 선택' :
                                    currentLocale === 'en' ? 'Select Image' :
                                    currentLocale === 'id' ? 'Pilih Gambar' :
                                    currentLocale === 'zh' ? '选择图片' :
                                    currentLocale === 'ja' ? '画像を選択' :
                                    currentLocale === 'ar' ? 'اختر صورة' :
                                    'Select Image'
                                )}
                            </button>
                            {editingItem.imageUrl && (
                                <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                                    <img src={editingItem.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setEditingType('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSaveStory}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-3">
                {storyItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            {item.imageUrl && (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {item.isFeatured && (
                                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 font-medium rounded">
                                            {currentLocale === 'ko' ? '메인 공지' : 'Featured'}
                                        </span>
                                    )}
                                    {item.category && (
                                        <span className={`text-xs px-2 py-1 font-medium rounded ${
                                            item.category === 'health' ? 'bg-emerald-100 text-emerald-700' :
                                            item.category === 'recipe' ? 'bg-amber-100 text-amber-700' :
                                            item.category === 'history' ? 'bg-purple-100 text-purple-700' :
                                            item.category === 'tips' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.category === 'health' ? (currentLocale === 'ko' ? '건강' : currentLocale === 'en' ? 'Health' : currentLocale === 'id' ? 'Kesehatan' : currentLocale === 'zh' ? '健康' : currentLocale === 'ja' ? '健康' : currentLocale === 'ar' ? 'الصحة' : 'Health') :
                                             item.category === 'recipe' ? (currentLocale === 'ko' ? '레시피' : currentLocale === 'en' ? 'Recipe' : currentLocale === 'id' ? 'Resep' : currentLocale === 'zh' ? '食谱' : currentLocale === 'ja' ? 'レシピ' : currentLocale === 'ar' ? 'وصفة' : 'Recipe') :
                                             item.category === 'history' ? (currentLocale === 'ko' ? '역사' : currentLocale === 'en' ? 'History' : currentLocale === 'id' ? 'Sejarah' : currentLocale === 'zh' ? '历史' : currentLocale === 'ja' ? '歴史' : currentLocale === 'ar' ? 'التاريخ' : 'History') :
                                             item.category === 'tips' ? (currentLocale === 'ko' ? '활용팁' : currentLocale === 'en' ? 'Tips' : currentLocale === 'id' ? 'Tips' : currentLocale === 'zh' ? '小贴士' : currentLocale === 'ja' ? 'ヒント' : currentLocale === 'ar' ? 'نصائح' : 'Tips') :
                                             item.category}
                                        </span>
                                    )}
                                    <h4 className="font-semibold text-gray-900">
                                        {item[`title_${currentLocale}`] || item.title_ko || item.title_en || item.title || ''}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                                    {item[`summary_${currentLocale}`] || item.summary_ko || item.summary_en || item.summary || ''}
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                    {item.updatedByName ? (
                                        <>
                                            <span>{t.website?.updatedBy || 'Updated by'}: {item.updatedByName}</span>
                                            {item.updatedAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {item.updatedAt}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {item.createdByName && (
                                                <span>{t.website?.createdBy || 'Created by'}: {item.createdByName}</span>
                                            )}
                                            {item.createdAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {item.createdAt}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item, 'story')}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete('vinegar_stories', item.id!)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderVideosTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    ℹ️ {
                        currentLocale === 'ko' ? '식초 이야기 > 동영상' :
                        currentLocale === 'en' ? 'Vinegar Story > Videos' :
                        'Vinegar Story > Videos'
                    }
                </p>
                <button
                    onClick={() => {
                        setEditingItem({
                            title: '',
                            description: '',
                            videoUrl: '',
                            thumbnailUrl: '',
                            isFeatured: false
                        });
                        setEditingType('video');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'video' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                    data-edit-form
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.title || 'Title'}
                            </label>
                            <input
                                type="text"
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                placeholder={t.website?.title || 'Title'}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="video-featured"
                                checked={editingItem.isFeatured || false}
                                onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="video-featured" className="text-sm font-medium text-gray-700">
                                {currentLocale === 'ko' ? '메인공지' :
                                 currentLocale === 'en' ? 'Featured' :
                                 currentLocale === 'id' ? 'Unggulan' :
                                 currentLocale === 'zh' ? '精选' :
                                 currentLocale === 'ja' ? '注目' :
                                 currentLocale === 'ar' ? 'مميز' :
                                 'Featured'}
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.description || 'Description'}
                        </label>
                        <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            rows={3}
                            placeholder={t.website?.description || 'Description'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.videoUrl || 'Video URL'}
                        </label>
                        <input
                            type="text"
                            value={editingItem.videoUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                            placeholder="https://youtube.com/..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.thumbnailUrl || 'Thumbnail'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={thumbnailInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleThumbnailUpload(file);
                                }}
                                className="hidden"
                            />
                            <button
                                onClick={() => thumbnailInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <Upload size={16} />
                                {uploading ? (
                                    currentLocale === 'ko' ? '업로드 중...' :
                                    currentLocale === 'en' ? 'Uploading...' :
                                    currentLocale === 'id' ? 'Mengunggah...' :
                                    currentLocale === 'zh' ? '上传中...' :
                                    currentLocale === 'ja' ? 'アップロード中...' :
                                    currentLocale === 'ar' ? 'جاري التحميل...' :
                                    'Uploading...'
                                ) : (
                                    currentLocale === 'ko' ? '썸네일 선택' :
                                    currentLocale === 'en' ? 'Select Thumbnail' :
                                    currentLocale === 'id' ? 'Pilih Thumbnail' :
                                    currentLocale === 'zh' ? '选择缩略图' :
                                    currentLocale === 'ja' ? 'サムネイルを選択' :
                                    currentLocale === 'ar' ? 'اختر الصورة المصغرة' :
                                    'Select Thumbnail'
                                )}
                            </button>
                            {editingItem.thumbnailUrl && (
                                <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                                    <img src={editingItem.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setEditingType('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSaveVideo}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-3">
                {videoItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            {item.thumbnailUrl && (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Video className="text-red-500 flex-shrink-0" size={20} />
                                    {item.isFeatured && (
                                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 font-medium rounded">
                                            {currentLocale === 'ko' ? '메인공지' :
                                             currentLocale === 'en' ? 'Featured' :
                                             currentLocale === 'id' ? 'Unggulan' :
                                             currentLocale === 'zh' ? '精选' :
                                             currentLocale === 'ja' ? '注目' :
                                             currentLocale === 'ar' ? 'مميز' :
                                             'Featured'}
                                        </span>
                                    )}
                                    <h4 className="font-semibold text-gray-900">
                                        {item[`title_${currentLocale}`] || item.title_ko || item.title_en || item.title || ''}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                                    {item[`description_${currentLocale}`] || item.description_ko || item.description_en || item.description || ''}
                                </p>
                                {item.videoUrl && (
                                    <div className="text-xs text-gray-600 mb-2">
                                        <span className="font-medium">{currentLocale === 'ko' ? '동영상' : 'Video'}:</span>
                                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:underline break-all">
                                            {item.videoUrl}
                                        </a>
                                    </div>
                                )}
                                <div className="flex gap-4 text-xs text-gray-500">
                                    {item.updatedByName ? (
                                        <>
                                            <span>{currentLocale === 'ko' ? '수정자' : 'Updated by'}: {item.updatedByName}</span>
                                            {item.updatedAt && <span>{item.updatedAt}</span>}
                                        </>
                                    ) : (
                                        <>
                                            <span>{currentLocale === 'ko' ? '등록자' : 'Created by'}: {item.createdByName || 'Unknown'}</span>
                                            {item.createdAt && <span>{item.createdAt}</span>}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item, 'video')}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete('vinegar_videos', item.id!)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProcessTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    ℹ️ {
                        currentLocale === 'ko' ? '식초 이야기 > 제조 과정' :
                        currentLocale === 'en' ? 'Vinegar Story > Manufacturing Process' :
                        'Vinegar Story > Manufacturing Process'
                    }
                </p>
                <button
                    onClick={() => {
                        setEditingItem({
                            title: '',
                            description: '',
                            imageUrl: '',
                            step: undefined
                        });
                        setEditingType('process');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'process' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                    data-edit-form
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {currentLocale === 'ko' ? '순서' :
                                 currentLocale === 'en' ? 'Step' :
                                 currentLocale === 'id' ? 'Langkah' :
                                 currentLocale === 'zh' ? '步骤' :
                                 currentLocale === 'ja' ? 'ステップ' :
                                 currentLocale === 'ar' ? 'خطوة' :
                                 'Step'}
                            </label>
                            <input
                                type="number"
                                value={editingItem.step || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, step: parseInt(e.target.value) || undefined })}
                                min="1"
                                placeholder={currentLocale === 'ko' ? '순서' : 'Step'}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.title || 'Title'}
                            </label>
                            <input
                                type="text"
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                placeholder={t.website?.title || 'Title'}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.description || 'Description'}
                        </label>
                        <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            rows={3}
                            placeholder={t.website?.description || 'Description'}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '이미지' : 'Image'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, true);
                                }}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <Upload size={16} />
                                {uploading ? (
                                    currentLocale === 'ko' ? '업로드 중...' :
                                    currentLocale === 'en' ? 'Uploading...' :
                                    currentLocale === 'id' ? 'Mengunggah...' :
                                    currentLocale === 'zh' ? '上传中...' :
                                    currentLocale === 'ja' ? 'アップロード中...' :
                                    currentLocale === 'ar' ? 'جاري التحميل...' :
                                    'Uploading...'
                                ) : (
                                    currentLocale === 'ko' ? '이미지 선택' :
                                    currentLocale === 'en' ? 'Select Image' :
                                    currentLocale === 'id' ? 'Pilih Gambar' :
                                    currentLocale === 'zh' ? '选择图片' :
                                    currentLocale === 'ja' ? '画像を選択' :
                                    currentLocale === 'ar' ? 'اختر صورة' :
                                    'Select Image'
                                )}
                            </button>
                            {editingItem.imageUrl && (
                                <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                                    <img src={editingItem.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setEditingType('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSaveProcess}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-3">
                {processItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            {item.imageUrl && (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-medium rounded">
                                        {currentLocale === 'ko' ? `${item.step || 1}단계` :
                                         currentLocale === 'en' ? `Step ${item.step || 1}` :
                                         currentLocale === 'id' ? `Langkah ${item.step || 1}` :
                                         currentLocale === 'zh' ? `步骤 ${item.step || 1}` :
                                         currentLocale === 'ja' ? `ステップ ${item.step || 1}` :
                                         currentLocale === 'ar' ? `خطوة ${item.step || 1}` :
                                         `Step ${item.step || 1}`}
                                    </span>
                                    <h4 className="font-semibold text-gray-900">
                                        {item[`title_${currentLocale}`] || item.title_ko || item.title_en || item.title || ''}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">
                                    {item[`description_${currentLocale}`] || item.description_ko || item.description_en || item.description || ''}
                                </p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    {item.updatedByName ? (
                                        <>
                                            <span>{currentLocale === 'ko' ? '수정자' : 'Updated by'}: {item.updatedByName}</span>
                                            {item.updatedAt && <span>{item.updatedAt}</span>}
                                        </>
                                    ) : (
                                        <>
                                            <span>{currentLocale === 'ko' ? '등록자' : 'Created by'}: {item.createdByName || 'Unknown'}</span>
                                            {item.createdAt && <span>{item.createdAt}</span>}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item, 'process')}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete('vinegar_process', item.id!)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t.website?.vinegarStory || 'Vinegar Story'}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {refreshing && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="text-xs">
                                {currentLocale === 'ko' ? '새로고침 중...' : 'Refreshing...'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveSubTab('about')}
                            className={`flex items-center gap-2 px-4 py-3 transition-all ${
                                activeSubTab === 'about'
                                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <FileText size={18} />
                            <span className="text-sm font-medium">
                                {currentLocale === 'ko' ? '식초에 대하여' : 'About Vinegar'}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveSubTab('videos')}
                            className={`flex items-center gap-2 px-4 py-3 transition-all ${
                                activeSubTab === 'videos'
                                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <Video size={18} />
                            <span className="text-sm font-medium">
                                {t.website?.vinegarVideos || 'Videos'}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveSubTab('process')}
                            className={`flex items-center gap-2 px-4 py-3 transition-all ${
                                activeSubTab === 'process'
                                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <Factory size={18} />
                            <span className="text-sm font-medium">
                                {t.website?.vinegarProcess || 'Manufacturing Process'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSubTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeSubTab === 'about' && renderAboutTab()}
                            {activeSubTab === 'videos' && renderVideosTab()}
                            {activeSubTab === 'process' && renderProcessTab()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};