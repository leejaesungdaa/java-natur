'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Upload, Package, Star } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc, query, orderBy, getDocsFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { imageService } from '@/lib/firebase/services';
import { getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { formatJakartaTime } from '@/lib/utils/dateFormat';
import { scrollToForm } from '@/lib/utils/scrollToForm';

interface Product {
    id?: string;
    name_ko?: string;
    name_en?: string;
    name_id?: string;
    name_zh?: string;
    name_ja?: string;
    name_ar?: string;
    description_ko?: string;
    description_en?: string;
    description_id?: string;
    description_zh?: string;
    description_ja?: string;
    description_ar?: string;
    imageUrl?: string;
    shopeeLink?: string;
    tokopediaLink?: string;
    featured: boolean;
    order: number;
    isDeleted?: boolean;
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
    [key: `name_${string}`]: string | undefined;
    [key: `description_${string}`]: string | undefined;
}

interface ProductsTabProps {
    currentLocale: string;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    t: any;
    refreshKey?: number;
}

export function ProductsTab({ currentLocale, showToast, t, refreshKey = 0 }: ProductsTabProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check if it's initial load or refresh
        const isRefresh = refreshKey > 0;
        loadProducts(isRefresh);
    }, [refreshKey]); // Reload when refreshKey changes

    const loadProducts = async (silent = false) => {
        // Only show loading on initial load
        if (!silent && initialLoad) {
            setLoading(true);
        }
        
        try {
            const q = query(collection(db, 'products'), orderBy('order', 'asc'));
            // Force fetch from server to get latest data
            const querySnapshot = await getDocsFromServer(q);
            const items: Product[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isDeleted) {
                    items.push({ id: doc.id, ...data } as Product);
                }
            });
            
            setProducts(items);
            
            if (initialLoad) {
                setInitialLoad(false);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            // Only show error toast on initial load or explicit refresh
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

    const handleSave = async () => {
        // Validate fields
        if (!editingItem[`name_${currentLocale}`]) {
            showToast(
                currentLocale === 'ko' ? '제품명을 입력해주세요' :
                currentLocale === 'en' ? 'Please enter product name' :
                currentLocale === 'id' ? 'Silakan masukkan nama produk' :
                currentLocale === 'zh' ? '请输入产品名称' :
                currentLocale === 'ja' ? '製品名を入力してください' :
                currentLocale === 'ar' ? 'يرجى إدخال اسم المنتج' :
                'Please enter product name',
                'error'
            );
            return;
        }
        
        if (!editingItem[`description_${currentLocale}`]) {
            showToast(
                currentLocale === 'ko' ? '설명을 입력해주세요' :
                currentLocale === 'en' ? 'Please enter description' :
                currentLocale === 'id' ? 'Silakan masukkan deskripsi' :
                currentLocale === 'zh' ? '请输入描述' :
                currentLocale === 'ja' ? '説明を入力してください' :
                currentLocale === 'ar' ? 'يرجى إدخال الوصف' :
                'Please enter description',
                'error'
            );
            return;
        }
        
        if (!editingItem.imageUrl) {
            showToast(
                currentLocale === 'ko' ? '이미지를 선택해주세요' :
                currentLocale === 'en' ? 'Please select an image' :
                currentLocale === 'id' ? 'Silakan pilih gambar' :
                currentLocale === 'zh' ? '请选择图片' :
                currentLocale === 'ja' ? '画像を選択してください' :
                currentLocale === 'ar' ? 'يرجى اختيار صورة' :
                'Please select an image',
                'error'
            );
            return;
        }

        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const now = formatJakartaTime();
            
            const saveData = {
                [`name_${currentLocale}`]: editingItem[`name_${currentLocale}`],
                [`description_${currentLocale}`]: editingItem[`description_${currentLocale}`],
                imageUrl: editingItem.imageUrl,
                shopeeLink: editingItem.shopeeLink || '',
                tokopediaLink: editingItem.tokopediaLink || '',
                featured: editingItem.featured || false,
                order: editingItem.order || products.length,
                isDeleted: false
            };

            if (editingItem.id) {
                await updateDoc(doc(db, 'products', editingItem.id), {
                    ...saveData,
                    updatedBy: adminInfo?.uid || '',
                    updatedByName: adminInfo?.name || 'Unknown',
                    updatedAt: now
                });
            } else {
                await addDoc(collection(db, 'products'), {
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
            await loadProducts();
            setEditingItem(null);
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

    const handleDelete = async (id: string) => {
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
            
            await updateDoc(doc(db, 'products', id), {
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
            await loadProducts();
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

    const handleEdit = (item: Product) => {
        setEditingItem({
            ...item,
            [`name_${currentLocale}`]: item[`name_${currentLocale}`] || '',
            [`description_${currentLocale}`]: item[`description_${currentLocale}`] || ''
        });
        scrollToForm();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    ℹ️ {
                        currentLocale === 'ko' ? '제품 관리 - 대표제품은 홈화면에 표시됩니다' :
                        currentLocale === 'en' ? 'Product Management - Featured products appear on homepage' :
                        currentLocale === 'id' ? 'Manajemen Produk - Produk unggulan muncul di beranda' :
                        currentLocale === 'zh' ? '产品管理 - 特色产品显示在主页' :
                        currentLocale === 'ja' ? '製品管理 - 注目製品はホームページに表示されます' :
                        currentLocale === 'ar' ? 'إدارة المنتجات - تظهر المنتجات المميزة على الصفحة الرئيسية' :
                        'Product Management - Featured products appear on homepage'
                    }
                </p>
                <button
                    onClick={() => {
                        setEditingItem({
                            [`name_${currentLocale}`]: '',
                            [`description_${currentLocale}`]: '',
                            imageUrl: '',
                            shopeeLink: '',
                            tokopediaLink: '',
                            featured: false,
                            order: products.length
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
                    data-edit-form
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '제품명 *' :
                             currentLocale === 'en' ? 'Product Name *' :
                             currentLocale === 'id' ? 'Nama Produk *' :
                             currentLocale === 'zh' ? '产品名称 *' :
                             currentLocale === 'ja' ? '製品名 *' :
                             currentLocale === 'ar' ? 'اسم المنتج *' :
                             'Product Name *'}
                        </label>
                        <input
                            type="text"
                            value={editingItem[`name_${currentLocale}`] || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, [`name_${currentLocale}`]: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '설명 *' :
                             currentLocale === 'en' ? 'Description *' :
                             currentLocale === 'id' ? 'Deskripsi *' :
                             currentLocale === 'zh' ? '描述 *' :
                             currentLocale === 'ja' ? '説明 *' :
                             currentLocale === 'ar' ? 'الوصف *' :
                             'Description *'}
                        </label>
                        <textarea
                            value={editingItem[`description_${currentLocale}`] || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, [`description_${currentLocale}`]: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '제품 이미지 *' :
                             currentLocale === 'en' ? 'Product Image *' :
                             currentLocale === 'id' ? 'Gambar Produk *' :
                             currentLocale === 'zh' ? '产品图片 *' :
                             currentLocale === 'ja' ? '製品画像 *' :
                             currentLocale === 'ar' ? 'صورة المنتج *' :
                             'Product Image *'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={imageRef}
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            setUploading(true);
                                            const path = `products/${Date.now()}_${file.name}`;
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
                                    }
                                }}
                                className="hidden"
                            />
                            <button
                                onClick={() => imageRef.current?.click()}
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
                                    <img 
                                        src={editingItem.imageUrl} 
                                        alt="" 
                                        className="w-full h-full object-contain bg-gray-50" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {currentLocale === 'ko' ? 'Shopee 링크' :
                                 currentLocale === 'en' ? 'Shopee Link' :
                                 currentLocale === 'id' ? 'Tautan Shopee' :
                                 currentLocale === 'zh' ? 'Shopee链接' :
                                 currentLocale === 'ja' ? 'Shopeeリンク' :
                                 currentLocale === 'ar' ? 'رابط Shopee' :
                                 'Shopee Link'}
                            </label>
                            <input
                                type="text"
                                value={editingItem.shopeeLink || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, shopeeLink: e.target.value })}
                                placeholder="https://shopee.co.id/..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {currentLocale === 'ko' ? 'Tokopedia 링크' :
                                 currentLocale === 'en' ? 'Tokopedia Link' :
                                 currentLocale === 'id' ? 'Tautan Tokopedia' :
                                 currentLocale === 'zh' ? 'Tokopedia链接' :
                                 currentLocale === 'ja' ? 'Tokopediaリンク' :
                                 currentLocale === 'ar' ? 'رابط Tokopedia' :
                                 'Tokopedia Link'}
                            </label>
                            <input
                                type="text"
                                value={editingItem.tokopediaLink || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, tokopediaLink: e.target.value })}
                                placeholder="https://tokopedia.com/..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={editingItem.featured || false}
                            onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                            {currentLocale === 'ko' ? '대표 제품으로 설정' :
                             currentLocale === 'en' ? 'Set as Featured Product' :
                             currentLocale === 'id' ? 'Tetapkan sebagai Produk Unggulan' :
                             currentLocale === 'zh' ? '设为特色产品' :
                             currentLocale === 'ja' ? '注目製品として設定' :
                             currentLocale === 'ar' ? 'تعيين كمنتج مميز' :
                             'Set as Featured Product'}
                        </label>
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

            {loading && initialLoad ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : products.length === 0 && !loading ? (
                <div className="text-center py-12 text-gray-500">
                    {currentLocale === 'ko' ? '등록된 제품이 없습니다' :
                     currentLocale === 'en' ? 'No products registered' :
                     currentLocale === 'id' ? 'Tidak ada produk terdaftar' :
                     currentLocale === 'zh' ? '没有注册的产品' :
                     currentLocale === 'ja' ? '登録された製品がありません' :
                     currentLocale === 'ar' ? 'لا توجد منتجات مسجلة' :
                     'No products registered'}
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                        {products.map((item) => (
                            <motion.div 
                                key={item.id} 
                                layout
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                            <div className="flex gap-4">
                                {item.imageUrl && (
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <img 
                                            src={item.imageUrl} 
                                            alt="" 
                                            className="w-full h-full object-contain" 
                                        />
                                        {item.featured && (
                                            <div className="absolute top-1 right-1">
                                                <div className="bg-yellow-400 text-xs font-bold text-white px-2 py-0.5 rounded">
                                                    BEST
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="text-blue-500 flex-shrink-0" size={20} />
                                        {item.featured && (
                                            <Star className="text-yellow-400 fill-current flex-shrink-0" size={16} />
                                        )}
                                        <h4 className="font-semibold text-gray-900">
                                            {item[`name_${currentLocale}`] || item.name_ko || item.name_en || ''}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                                        {item[`description_${currentLocale}`] || item.description_ko || item.description_en || ''}
                                    </p>
                                    <div className="flex gap-4 text-xs text-gray-500 mb-2">
                                        {item.shopeeLink && (
                                            <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                                                Shopee
                                            </a>
                                        )}
                                        {item.tokopediaLink && (
                                            <a href={item.tokopediaLink} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                                                Tokopedia
                                            </a>
                                        )}
                                    </div>
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
                                        onClick={() => handleEdit(item)}
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
                        </motion.div>
                    ))}
                </div>
                </AnimatePresence>
            )}
        </div>
    );
}