import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { imageService } from '@/lib/firebase/services';
import { getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { formatJakartaTime } from '@/lib/utils/dateFormat';

interface VinegarInfoTabProps {
    vinegarInfoItems: any[];
    loadVinegarInfo: () => Promise<void>;
    currentLocale: string;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    t: any;
    onEditingChange?: (editing: boolean) => void;
    refreshKey?: number;
}

export const VinegarInfoTab: React.FC<VinegarInfoTabProps> = ({
    vinegarInfoItems,
    loadVinegarInfo,
    currentLocale,
    showToast,
    t,
    onEditingChange,
    refreshKey
}) => {
    const [editingItem, setEditingItem] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 편집 상태가 변경될 때 상위 컴포넌트에 알림
    useEffect(() => {
        if (onEditingChange) {
            onEditingChange(!!editingItem || saving || uploading);
        }
    }, [editingItem, saving, uploading, onEditingChange]);

    // Load data when refreshKey changes
    useEffect(() => {
        if (refreshKey !== undefined && refreshKey > 0) {
            loadVinegarInfoSilent();
        }
    }, [refreshKey]);

    const loadVinegarInfoSilent = async () => {
        try {
            await loadVinegarInfo();
            if (initialLoad) {
                setInitialLoad(false);
            }
        } catch (error) {
            console.error('Error loading vinegar info:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const path = `vinegar-info/${Date.now()}_${file.name}`;
            const url = await imageService.uploadImage(file, path);
            setEditingItem({ ...editingItem, imageUrl: url });
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

    const handleSave = async () => {
        // 필수 필드 검사
        if (!editingItem.title || !editingItem.ingredients || !editingItem.feature || !editingItem.imageUrl) {
            showToast(
                currentLocale === 'ko' ? '모든 필드를 입력하고 이미지를 업로드해주세요' : 
                currentLocale === 'id' ? 'Harap isi semua bidang dan unggah gambar' :
                currentLocale === 'zh' ? '请填写所有字段并上传图片' :
                currentLocale === 'ja' ? 'すべてのフィールドに入力し、画像をアップロードしてください' :
                currentLocale === 'ar' ? 'يرجى ملء جميع الحقول وتحميل صورة' :
                'Please fill all fields and upload an image', 
                'error'
            );
            return;
        }

        // 건강 효과 검사
        if (!editingItem.healthEffects || editingItem.healthEffects.length === 0) {
            showToast(
                currentLocale === 'ko' ? '최소 하나의 건강 효과를 추가해주세요' : 
                currentLocale === 'id' ? 'Harap tambahkan setidaknya satu manfaat kesehatan' :
                currentLocale === 'zh' ? '请添加至少一个健康效果' :
                currentLocale === 'ja' ? '少なくとも1つの健康効果を追加してください' :
                currentLocale === 'ar' ? 'يرجى إضافة فائدة صحية واحدة على الأقل' :
                'Please add at least one health effect', 
                'error'
            );
            return;
        }

        // 건강 효과 필드 빈값 검사
        const hasEmptyHealthEffect = editingItem.healthEffects.some((effect: any) => 
            !effect.title || !effect.description
        );
        if (hasEmptyHealthEffect) {
            showToast(
                currentLocale === 'ko' ? '모든 건강 효과 필드를 입력해주세요' : 
                currentLocale === 'id' ? 'Harap isi semua bidang manfaat kesehatan' :
                currentLocale === 'zh' ? '请填写所有健康效果字段' :
                currentLocale === 'ja' ? 'すべての健康効果フィールドに入力してください' :
                currentLocale === 'ar' ? 'يرجى ملء جميع حقول الفوائد الصحية' :
                'Please fill all health effect fields', 
                'error'
            );
            return;
        }

        // 순서 유효성 검사
        const orderNum = parseInt(editingItem.order);
        if (isNaN(orderNum) || orderNum <= 0) {
            showToast(
                currentLocale === 'ko' ? '순서는 1 이상의 숫자여야 합니다' : 
                currentLocale === 'id' ? 'Urutan harus berupa angka 1 atau lebih' :
                currentLocale === 'zh' ? '顺序必须是1或更大的数字' :
                currentLocale === 'ja' ? '順序は1以上の数字である必要があります' :
                currentLocale === 'ar' ? 'يجب أن يكون الترتيب رقمًا 1 أو أكبر' :
                'Order must be a number 1 or greater', 
                'error'
            );
            return;
        }

        // 순서 중복 체크
        const isDuplicate = vinegarInfoItems.some(item => 
            item.order === orderNum && item.id !== editingItem.id
        );
        
        if (isDuplicate) {
            showToast(
                currentLocale === 'ko' ? '이 순서는 이미 사용 중입니다' : 
                currentLocale === 'id' ? 'Urutan ini sudah digunakan' :
                currentLocale === 'zh' ? '此顺序已被使用' :
                currentLocale === 'ja' ? 'この順序はすでに使用されています' :
                currentLocale === 'ar' ? 'هذا الترتيب مستخدم بالفعل' :
                'This order is already in use',
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
                [`ingredients_${currentLocale}`]: editingItem.ingredients,
                [`feature_${currentLocale}`]: editingItem.feature,
                [`healthEffects_${currentLocale}`]: editingItem.healthEffects || [],
                imageUrl: editingItem.imageUrl || '',
                order: orderNum,
                isDeleted: false
            };

            if (editingItem.id) {
                await updateDoc(doc(db, 'vinegar_info', editingItem.id), {
                    ...saveData,
                    updatedBy: adminInfo?.uid || '',
                    updatedByName: adminInfo?.name || 'Unknown',
                    updatedAt: now
                });
            } else {
                await addDoc(collection(db, 'vinegar_info'), {
                    ...saveData,
                    createdBy: adminInfo?.uid || '',
                    createdByName: adminInfo?.name || 'Unknown',
                    createdAt: now
                });
            }
            
            showToast(t.website?.saveSuccess || 'Saved successfully', 'success');
            await loadVinegarInfo();
            setEditingItem(null);
        } catch (error) {
            showToast(t.website?.saveError || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.website?.confirmDelete || 'Are you sure you want to delete this item?')) return;
        
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            await updateDoc(doc(db, 'vinegar_info', id), {
                isDeleted: true,
                deletedBy: adminInfo?.uid || '',
                deletedByName: adminInfo?.name || 'Unknown',
                deletedAt: now
            });
            
            showToast(t.website?.deleteSuccess || 'Deleted successfully', 'success');
            await loadVinegarInfo();
        } catch (error) {
            showToast(t.website?.deleteError || 'Failed to delete', 'error');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t.website?.vinegarInfo || 'Vinegar Information'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        ℹ️ {
                            currentLocale === 'ko' ? '식초 정보 > 제품별 특징과 효능 차이' :
                            currentLocale === 'en' ? 'Vinegar Info > Product Features and Benefits' :
                            currentLocale === 'id' ? 'Informasi Cuka > Fitur dan Manfaat Produk' :
                            currentLocale === 'zh' ? '醋信息 > 产品特点和功效差异' :
                            currentLocale === 'ja' ? '酢情報 > 製品別特徴と効能の違い' :
                            currentLocale === 'ar' ? 'معلومات الخل > ميزات وفوائد المنتج' :
                            'Vinegar Info > Product Features and Benefits'
                        }
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem({
                            title: '',
                            ingredients: '',
                            healthEffects: [{ title: '', description: '' }],
                            feature: '',
                            imageUrl: '',
                            order: ''
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 제품명 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {
                                    currentLocale === 'ko' ? '제품명' :
                                    currentLocale === 'en' ? 'Product Name' :
                                    currentLocale === 'id' ? 'Nama Produk' :
                                    currentLocale === 'zh' ? '产品名称' :
                                    currentLocale === 'ja' ? '製品名' :
                                    currentLocale === 'ar' ? 'اسم المنتج' :
                                    'Product Name'
                                }
                            </label>
                            <input
                                type="text"
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder={currentLocale === 'ko' ? '예: 파인애플 식초' : 'e.g. Pineapple Vinegar'}
                            />
                        </div>

                        {/* 주요 성분 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {
                                    currentLocale === 'ko' ? '주요 성분' :
                                    currentLocale === 'en' ? 'Main Ingredients' :
                                    currentLocale === 'id' ? 'Bahan Utama' :
                                    currentLocale === 'zh' ? '主要成分' :
                                    currentLocale === 'ja' ? '主な成分' :
                                    currentLocale === 'ar' ? 'المكونات الرئيسية' :
                                    'Main Ingredients'
                                }
                            </label>
                            <input
                                type="text"
                                value={editingItem.ingredients}
                                onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder={currentLocale === 'ko' ? '예: 사탕수수, 파인애플' : 'e.g. Sugarcane, Pineapple'}
                            />
                        </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {
                                currentLocale === 'ko' ? '제품 이미지' :
                                currentLocale === 'en' ? 'Product Image' :
                                currentLocale === 'id' ? 'Gambar Produk' :
                                currentLocale === 'zh' ? '产品图片' :
                                currentLocale === 'ja' ? '製品画像' :
                                currentLocale === 'ar' ? 'صورة المنتج' :
                                'Product Image'
                            }
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

                    {/* 건강 효과 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {
                                currentLocale === 'ko' ? '건강 효과' :
                                currentLocale === 'en' ? 'Health Effects' :
                                currentLocale === 'id' ? 'Manfaat Kesehatan' :
                                currentLocale === 'zh' ? '健康效果' :
                                currentLocale === 'ja' ? '健康効果' :
                                currentLocale === 'ar' ? 'الفوائد الصحية' :
                                'Health Effects'
                            }
                        </label>
                        <div className="space-y-3">
                            {(editingItem.healthEffects || []).map((effect: any, index: number) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={effect.title}
                                            onChange={(e) => {
                                                const newEffects = [...(editingItem.healthEffects || [])];
                                                newEffects[index] = { ...effect, title: e.target.value };
                                                setEditingItem({ ...editingItem, healthEffects: newEffects });
                                            }}
                                            placeholder={
                                                currentLocale === 'ko' ? '효과 제목' :
                                                currentLocale === 'en' ? 'Effect Title' :
                                                currentLocale === 'id' ? 'Judul Efek' :
                                                currentLocale === 'zh' ? '效果标题' :
                                                currentLocale === 'ja' ? '効果タイトル' :
                                                currentLocale === 'ar' ? 'عنوان التأثير' :
                                                'Effect Title'
                                            }
                                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={effect.description}
                                                onChange={(e) => {
                                                    const newEffects = [...(editingItem.healthEffects || [])];
                                                    newEffects[index] = { ...effect, description: e.target.value };
                                                    setEditingItem({ ...editingItem, healthEffects: newEffects });
                                                }}
                                                placeholder={
                                                    currentLocale === 'ko' ? '효과 설명' :
                                                    currentLocale === 'en' ? 'Effect Description' :
                                                    currentLocale === 'id' ? 'Deskripsi Efek' :
                                                    currentLocale === 'zh' ? '效果描述' :
                                                    currentLocale === 'ja' ? '効果の説明' :
                                                    currentLocale === 'ar' ? 'وصف التأثير' :
                                                    'Effect Description'
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newEffects = editingItem.healthEffects.filter((_: any, i: number) => i !== index);
                                                    setEditingItem({ ...editingItem, healthEffects: newEffects });
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setEditingItem({
                                    ...editingItem,
                                    healthEffects: [...(editingItem.healthEffects || []), { title: '', description: '' }]
                                })}
                                className="text-sm text-green-600 hover:text-green-700"
                            >
                                + {
                                    currentLocale === 'ko' ? '건강 효과 추가' :
                                    currentLocale === 'en' ? 'Add Health Effect' :
                                    currentLocale === 'id' ? 'Tambah Manfaat Kesehatan' :
                                    currentLocale === 'zh' ? '添加健康效果' :
                                    currentLocale === 'ja' ? '健康効果を追加' :
                                    currentLocale === 'ar' ? 'إضافة فائدة صحية' :
                                    'Add Health Effect'
                                }
                            </button>
                        </div>
                    </div>

                    {/* 특징 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {
                                currentLocale === 'ko' ? '특징' :
                                currentLocale === 'en' ? 'Feature' :
                                currentLocale === 'id' ? 'Fitur' :
                                currentLocale === 'zh' ? '特点' :
                                currentLocale === 'ja' ? '特徴' :
                                currentLocale === 'ar' ? 'الميزة' :
                                'Feature'
                            }
                        </label>
                        <textarea
                            value={editingItem.feature}
                            onChange={(e) => setEditingItem({ ...editingItem, feature: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={
                                currentLocale === 'ko' ? '제품 특징을 입력하세요...' :
                                currentLocale === 'en' ? 'Enter product feature...' :
                                currentLocale === 'id' ? 'Masukkan fitur produk...' :
                                currentLocale === 'zh' ? '输入产品特点...' :
                                currentLocale === 'ja' ? '製品の特徴を入力...' :
                                currentLocale === 'ar' ? 'أدخل ميزة المنتج...' :
                                'Enter product feature...'
                            }
                        />
                    </div>

                    {/* 순서 */}
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {
                                currentLocale === 'ko' ? '순서' :
                                currentLocale === 'en' ? 'Order' :
                                currentLocale === 'id' ? 'Urutan' :
                                currentLocale === 'zh' ? '顺序' :
                                currentLocale === 'ja' ? '順序' :
                                currentLocale === 'ar' ? 'الترتيب' :
                                'Order'
                            }
                        </label>
                        <input
                            type="number"
                            value={editingItem.order}
                            onChange={(e) => setEditingItem({ ...editingItem, order: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="1"
                            placeholder=""
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {vinegarInfoItems.map((item, index) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 flex-1">
                                {item.imageUrl && (
                                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                        {item[`title_${currentLocale}`] || item.title_ko || item.title_en || item.title || ''}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">
                                            {currentLocale === 'ko' ? '주요 성분' :
                                             currentLocale === 'en' ? 'Main Ingredients' :
                                             currentLocale === 'id' ? 'Bahan Utama' :
                                             currentLocale === 'zh' ? '主要成分' :
                                             currentLocale === 'ja' ? '主な成분' :
                                             currentLocale === 'ar' ? 'المكونات الرئيسية' :
                                             'Main Ingredients'}:
                                        </span>{' '}
                                        {item[`ingredients_${currentLocale}`] || item.ingredients_ko || item.ingredients_en || item.ingredients || ''}
                                    </p>
                                    {(item[`healthEffects_${currentLocale}`] || item.healthEffects_ko || item.healthEffects_en || item.healthEffects || []).length > 0 && (
                                        <div className="mb-2">
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                {currentLocale === 'ko' ? '건강 효과' :
                                                 currentLocale === 'en' ? 'Health Effects' :
                                                 currentLocale === 'id' ? 'Manfaat Kesehatan' :
                                                 currentLocale === 'zh' ? '健康效果' :
                                                 currentLocale === 'ja' ? '健康効果' :
                                                 currentLocale === 'ar' ? 'الفوائد الصحية' :
                                                 'Health Effects'}:
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(item[`healthEffects_${currentLocale}`] || item.healthEffects_ko || item.healthEffects_en || item.healthEffects || []).slice(0, 4).map((effect: any, idx: number) => (
                                                    <div key={idx} className="text-xs bg-green-50 px-2 py-1 rounded overflow-hidden">
                                                        <span className="font-medium break-words">{effect.title}:</span> <span className="break-words">{effect.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(item[`feature_${currentLocale}`] || item.feature_ko || item.feature_en || item.feature) && (
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                            <span className="font-medium">
                                                {currentLocale === 'ko' ? '특징' :
                                                 currentLocale === 'en' ? 'Feature' :
                                                 currentLocale === 'id' ? 'Fitur' :
                                                 currentLocale === 'zh' ? '特点' :
                                                 currentLocale === 'ja' ? '特徴' :
                                                 currentLocale === 'ar' ? 'الميزة' :
                                                 'Feature'}:
                                            </span>{' '}
                                            {item[`feature_${currentLocale}`] || item.feature_ko || item.feature_en || item.feature || ''}
                                        </p>
                                    )}
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                                        {item.updatedByName ? (
                                            <>
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {currentLocale === 'ko' ? '수정자' :
                                                     currentLocale === 'en' ? 'Updated by' :
                                                     currentLocale === 'id' ? 'Diperbarui oleh' :
                                                     currentLocale === 'zh' ? '更新者' :
                                                     currentLocale === 'ja' ? '更新者' :
                                                     currentLocale === 'ar' ? 'تم التحديث بواسطة' :
                                                     'Updated by'}: {item.updatedByName}
                                                </span>
                                                {item.updatedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {item.updatedAt}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {currentLocale === 'ko' ? '등록자' :
                                                     currentLocale === 'en' ? 'Created by' :
                                                     currentLocale === 'id' ? 'Dibuat oleh' :
                                                     currentLocale === 'zh' ? '创建者' :
                                                     currentLocale === 'ja' ? '作成者' :
                                                     currentLocale === 'ar' ? 'تم الإنشاء بواسطة' :
                                                     'Created by'}: {item.createdByName || 'Unknown'}
                                                </span>
                                                {item.createdAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {item.createdAt}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                        <span className="text-gray-400">
                                            {currentLocale === 'ko' ? '순서' :
                                             currentLocale === 'en' ? 'Order' :
                                             currentLocale === 'id' ? 'Urutan' :
                                             currentLocale === 'zh' ? '顺序' :
                                             currentLocale === 'ja' ? '順序' :
                                             currentLocale === 'ar' ? 'الترتيب' :
                                             'Order'}: {item.order}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => {
                                            const localizedItem = {
                                                ...item,
                                                title: item[`title_${currentLocale}`] || item.title || '',
                                                ingredients: item[`ingredients_${currentLocale}`] || item.ingredients || '',
                                                healthEffects: item[`healthEffects_${currentLocale}`] || item.healthEffects || [],
                                                feature: item[`feature_${currentLocale}`] || item.feature || ''
                                            };
                                            setEditingItem(localizedItem);
                                            // 스크롤을 상단으로 이동
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id!)}
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
};