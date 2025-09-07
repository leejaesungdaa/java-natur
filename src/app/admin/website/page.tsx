'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import RefreshIndicator from '@/components/admin/RefreshIndicator';
import { VinegarInfoTab } from './VinegarInfoTab';
import { VinegarStoryTab } from './VinegarStoryTab';
import { ProductsTab } from './ProductsTab';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, Building2, Phone, MapPin, Mail, History, 
    Beaker, Video, Package, Plus, Edit2, Trash2, Save, 
    X, ChevronRight, Upload, Eye, Clock, Calendar,
    FileText, PlayCircle, Factory, Star
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy, getDocsFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { imageService } from '@/lib/firebase/services';
import { checkAuthStatus, getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { checkPermission } from '@/lib/auth/permissions';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { getAdminLanguage } from '@/lib/utils/languageCache';
import { formatJakartaTime } from '@/lib/utils/dateFormat';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

type TabType = 'history' | 'contact' | 'vinegar-info' | 'vinegar-story' | 'products';

interface HistoryItem {
    id?: string;
    year: string;
    month: string;
    description: string;
    order: number;
    isDeleted?: boolean;
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
    deletedBy?: string;
    deletedByName?: string;
    deletedAt?: string;
}

interface ContactInfo {
    id?: string;
    address: string;
    phone: string;
    email: string;
    mapUrl?: string;
    latitude?: number;
    longitude?: number;
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
}

interface VinegarInfo {
    id?: string;
    title: string;  // 제품명
    title_ko?: string;
    title_en?: string;
    title_id?: string;
    title_zh?: string;
    title_ja?: string;
    title_ar?: string;
    ingredients: string;  // 주요 성분
    ingredients_ko?: string;
    ingredients_en?: string;
    ingredients_id?: string;
    ingredients_zh?: string;
    ingredients_ja?: string;
    ingredients_ar?: string;
    healthEffects: {  // 건강 효과들
        title: string;
        description: string;
    }[];
    healthEffects_ko?: any[];
    healthEffects_en?: any[];
    healthEffects_id?: any[];
    healthEffects_zh?: any[];
    healthEffects_ja?: any[];
    healthEffects_ar?: any[];
    feature: string;  // 특징
    feature_ko?: string;
    feature_en?: string;
    feature_id?: string;
    feature_zh?: string;
    feature_ja?: string;
    feature_ar?: string;
    imageUrl?: string;
    imageFile?: File;
    order: number;
    isDeleted?: boolean;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    deletedBy?: string;
    deletedAt?: string;
}

interface StoryItem {
    id?: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    order: number;
}

interface VideoItem {
    id?: string;
    title: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    createdAt: string;
    order: number;
}

interface ProcessItem {
    id?: string;
    step: number;
    title: string;
    description: string;
    imageUrl?: string;
}

interface Product {
    id?: string;
    name: string;
    description: string;
    imageUrl?: string;
    productLink?: string;
    featured: boolean;
    order: number;
}

const tabConfig = {
    'history': { 
        label: 'companyHistory',
        icon: History,
        color: 'from-blue-400 to-blue-600'
    },
    'contact': { 
        label: 'contactInfo',
        icon: Phone,
        color: 'from-green-400 to-green-600'
    },
    'vinegar-info': { 
        label: 'vinegarInfo',
        icon: Beaker,
        color: 'from-purple-400 to-purple-600'
    },
    'vinegar-story': { 
        label: 'vinegarStory',
        icon: FileText,
        color: 'from-orange-400 to-orange-600'
    },
    'products': { 
        label: 'products',
        icon: Package,
        color: 'from-indigo-400 to-indigo-600'
    }
};

export default function WebsiteManagement() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isContactEditing, setIsContactEditing] = useState(false);
    const [isVinegarInfoEditing, setIsVinegarInfoEditing] = useState(false);
    const [isVinegarStoryEditing, setIsVinegarStoryEditing] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [t, setT] = useState(() => getAdminTranslation('en'));
    const { toasts, showToast, removeToast } = useToast();
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Data states
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [vinegarInfoItems, setVinegarInfoItems] = useState<VinegarInfo[]>([]);
    const [storyItems, setStoryItems] = useState<StoryItem[]>([]);
    const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
    const [processItems, setProcessItems] = useState<ProcessItem[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // Edit states
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editingType, setEditingType] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const productImageRef = useRef<HTMLInputElement>(null);
    const productImageRef2 = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const locale = getAdminLanguage() || 'en';
        setCurrentLocale(locale);
        setT(getAdminTranslation(locale));
        verifyAndLoadData();
    }, []);
    
    useEffect(() => {
        const checkLanguageChange = setInterval(() => {
            const locale = getAdminLanguage() || 'en';
            if (locale !== currentLocale) {
                setCurrentLocale(locale);
                setT(getAdminTranslation(locale));
            }
        }, 100);
        
        return () => clearInterval(checkLanguageChange);
    }, [currentLocale]);
    
    useEffect(() => {
        // 편집 중이거나, 권한이 없거나, 로딩 중일 때는 자동 새로고침 중단
        if (permissionDenied || loading) return;
        
        // 편집 중인지 체크 (연락처 편집 포함)
        const isEditing = editingItem || editingType || saving || isContactEditing;
        
        if (isEditing) {
            // 편집 중이면 인터벌을 설정하지 않음
            return;
        }
        
        const refreshInterval = setInterval(async () => {
            // 편집 중이 아닐 때만 새로고침
            if (!editingItem && !editingType && !saving && !isContactEditing && !isVinegarInfoEditing && !isVinegarStoryEditing) {
                setRefreshing(true);
                await loadDataSilently(activeTab);
                // Trigger ProductsTab refresh
                if (activeTab === 'products') {
                    setRefreshKey(prev => prev + 1);
                }
                setTimeout(() => setRefreshing(false), 500);
            }
        }, 5000);
        
        return () => clearInterval(refreshInterval);
    }, [activeTab, permissionDenied, loading, editingItem, editingType, saving, isContactEditing, isVinegarInfoEditing, isVinegarStoryEditing]);

    useEffect(() => {
        if (permissionDenied) {
            showToast(getAdminTranslation(currentLocale).website?.noPermission || 'You do not have permission to access this page', 'error');
            const timer = setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [permissionDenied, t, showToast, router]);

    const verifyAndLoadData = async () => {
        const user = await checkAuthStatus();
        if (!user) {
            router.push('/admin/login');
            return;
        }
        
        // Check permission
        const hasPermission = await checkPermission('websiteManagement');
        if (!hasPermission) {
            setPermissionDenied(true);
            setLoading(false);
            return;
        }
        
        await loadData(activeTab);
    };

    const loadData = async (tab: TabType) => {
        setLoading(true);
        try {
            await loadDataContent(tab);
        } catch (error) {
            console.error('Error loading data for tab:', tab, error);
        } finally {
            setLoading(false);
        }
    };
    
    const loadDataSilently = async (tab: TabType) => {
        try {
            await loadDataContent(tab);
        } catch (error) {
            console.error('Error refreshing data for tab:', tab, error);
        }
    };
    
    const loadDataContent = async (tab: TabType) => {
        switch(tab) {
            case 'history':
                await loadHistoryItems(true);
                break;
            case 'contact':
                await loadContactInfo(true);
                break;
            case 'vinegar-info':
                await loadVinegarInfo();
                break;
            case 'vinegar-story':
                // VinegarStoryTab component handles its own data loading
                break;
            case 'products':
                // ProductsTab component handles its own data loading
                break;
        }
    };

    const loadHistoryItems = async (silent = false) => {
        try {
            // Force fetch from server to get latest data
            const querySnapshot = await getDocsFromServer(collection(db, 'company_history'));
            const items: HistoryItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // 삭제되지 않은 항목만 표시
                if (!data.isDeleted) {
                    items.push({ id: doc.id, ...data } as HistoryItem);
                }
            });
            setHistoryItems(items.sort((a, b) => a.order - b.order));
        } catch (error) {
            if (!silent) {
                console.error('Error loading history:', error);
            }
        }
    };

    const loadContactInfo = async (silent = false) => {
        try {
            // Force fetch from server to get latest data
            const querySnapshot = await getDocsFromServer(collection(db, 'contact_info'));
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                setContactInfo({ id: doc.id, ...doc.data() } as ContactInfo);
            } else {
                // 문서가 없으면 기본값 설정
                setContactInfo({
                    address: '',
                    phone: '',
                    email: ''
                } as ContactInfo);
            }
        } catch (error) {
            if (!silent) {
                console.error('Error loading contact info:', error);
            }
        }
    };

    const loadVinegarInfo = async () => {
        const q = query(collection(db, 'vinegar_info'), orderBy('order', 'asc'));
        // Force fetch from server to get latest data
        const querySnapshot = await getDocsFromServer(q);
        const items: VinegarInfo[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.isDeleted) {
                items.push({ id: doc.id, ...data } as VinegarInfo);
            }
        });
        setVinegarInfoItems(items);
    };

    const loadStoryItems = async () => {
        const querySnapshot = await getDocs(collection(db, 'vinegar_stories'));
        const items: StoryItem[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as StoryItem);
        });
        setStoryItems(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6));
    };

    const loadVideoItems = async () => {
        const querySnapshot = await getDocs(collection(db, 'vinegar_videos'));
        const items: VideoItem[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as VideoItem);
        });
        setVideoItems(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4));
    };

    const loadProcessItems = async () => {
        const querySnapshot = await getDocs(collection(db, 'vinegar_process'));
        const items: ProcessItem[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ProcessItem);
        });
        setProcessItems(items.sort((a, b) => a.step - b.step));
    };

    const loadFeaturedProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.featured) {
                items.push({ id: doc.id, ...data } as Product);
            }
        });
        setFeaturedProducts(items.sort((a, b) => a.order - b.order));
    };

    const loadAllProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setAllProducts(items.sort((a, b) => a.order - b.order));
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        loadData(tab);
        setEditingItem(null);
        setEditingType('');
        // Trigger ProductsTab refresh when switching to products tab
        if (tab === 'products') {
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleEditClick = (item: any, type: string) => {
        setEditingItem(item);
        setEditingType(type);
        // 화면 상단으로 스크롤
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleSaveHistory = async (item: HistoryItem) => {
        setSaving(true);
        try {
            // Validate all required fields
            if (!item.year || !item.month || !item.order || !item.description) {
                showToast(getAdminTranslation(currentLocale).website?.allFieldsRequired || 'Please fill in all fields', 'error');
                setSaving(false);
                return;
            }
            
            const isDuplicateOrder = historyItems.some(
                existing => existing.order === item.order && existing.id !== item.id
            );
            
            if (isDuplicateOrder) {
                showToast(getAdminTranslation(currentLocale).website?.orderDuplicate || 'This order number is already in use.', 'error');
                setSaving(false);
                return;
            }
            
            const adminInfo = await getCurrentAdminInfo();
            const currentTime = new Date().toISOString();
            
            if (item.id) {
                const { id, ...updateData } = item;
                await updateDoc(doc(db, 'company_history', item.id), {
                    ...updateData,
                    updatedBy: adminInfo?.username || 'Unknown',
                    updatedByName: adminInfo?.name || 'Unknown User',
                    updatedAt: currentTime
                });
            } else {
                const { id, ...dataToSave } = item;
                await addDoc(collection(db, 'company_history'), {
                    ...dataToSave,
                    createdBy: adminInfo?.username || 'Unknown',
                    createdByName: adminInfo?.name || 'Unknown User',
                    createdAt: currentTime,
                    isDeleted: false
                });
            }
            showToast(getAdminTranslation(currentLocale).website?.saveSuccess || 'Saved successfully', 'success');
            await loadHistoryItems();
            setEditingItem(null);
            setEditingType('');
        } catch (error) {
            console.error('Save error:', error);
            showToast(getAdminTranslation(currentLocale).website?.saveError || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveContact = async (info: ContactInfo) => {
        setSaving(true);
        try {
            const adminInfo = await getCurrentAdminInfo();
            const currentTime = new Date().toISOString();
            
            // 먼저 기존 문서가 있는지 확인
            const querySnapshot = await getDocs(collection(db, 'contact_info'));
            
            if (!querySnapshot.empty) {
                // 기존 문서가 있으면 업데이트
                const existingDoc = querySnapshot.docs[0];
                const { id, ...updateData } = info;
                await updateDoc(doc(db, 'contact_info', existingDoc.id), {
                    ...updateData,
                    updatedBy: adminInfo?.username || 'Unknown',
                    updatedByName: adminInfo?.name || 'Unknown User',
                    updatedAt: currentTime
                });
            } else {
                // 새 문서 생성
                const { id, ...dataToSave } = info;
                await addDoc(collection(db, 'contact_info'), {
                    ...dataToSave,
                    updatedBy: adminInfo?.username || 'Unknown',
                    updatedByName: adminInfo?.name || 'Unknown User',
                    updatedAt: currentTime
                });
            }
            showToast(getAdminTranslation(currentLocale).website?.saveSuccess || 'Saved successfully', 'success');
            await loadContactInfo();
            setEditingItem(null);
            setEditingType('');
        } catch (error) {
            console.error('Save contact error:', error);
            showToast(getAdminTranslation(currentLocale).website?.saveError || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (collectionName: string, itemId: string) => {
        if (!confirm(getAdminTranslation(currentLocale).website?.confirmDelete || 'Are you sure you want to delete this item?')) {
            return;
        }
        
        try {
            const adminInfo = await getCurrentAdminInfo();
            // 소프트 삭제 - 실제로 삭제하지 않고 isDeleted 플래그만 설정
            await updateDoc(doc(db, collectionName, itemId), {
                isDeleted: true,
                deletedBy: adminInfo?.username || 'Unknown',
                deletedByName: adminInfo?.name || 'Unknown User',
                deletedAt: new Date().toISOString()
            });
            showToast(getAdminTranslation(currentLocale).website?.deleteSuccess || 'Deleted successfully', 'success');
            await loadData(activeTab);
        } catch (error) {
            showToast(getAdminTranslation(currentLocale).website?.deleteError || 'Failed to delete', 'error');
        }
    };

    const renderHistoryTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t.website?.companyHistory || 'Company History'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        ℹ️ {currentLocale === 'ko' ? '회사 정보 > 회사 연혁' : 'Company > Company History'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem({ year: '', month: '', description: '', order: 0 });
                        setEditingType('history');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'history' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t.website?.year || 'Year (YYYY)'}
                                value={editingItem.year}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                        setEditingItem({ ...editingItem, year: value });
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                maxLength={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                list="year-options"
                            />
                            <datalist id="year-options">
                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year} />
                                ))}
                            </datalist>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t.website?.month || 'Month (1-12)'}
                                value={editingItem.month}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                                        setEditingItem({ ...editingItem, month: value });
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                        e.preventDefault();
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value && (parseInt(value) < 1 || parseInt(value) > 12)) {
                                        setEditingItem({ ...editingItem, month: '' });
                                    }
                                }}
                                maxLength={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                list="month-options"
                            />
                            <datalist id="month-options">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <option key={month} value={month} />
                                ))}
                            </datalist>
                        </div>
                        <input
                            type="number"
                            placeholder={t.website?.order || 'Order'}
                            value={editingItem.order || ''}
                            min="1"
                            onChange={(e) => {
                                const value = e.target.value;
                                const num = parseInt(value);
                                if (value === '' || (num > 0 && !isNaN(num))) {
                                    setEditingItem({ ...editingItem, order: value === '' ? 0 : num });
                                }
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <textarea
                        placeholder={t.website?.description || 'Description'}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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
                            onClick={() => handleSaveHistory(editingItem)}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-3">
                {historyItems.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-green-50 border border-green-200 px-3 py-1 rounded-md">
                                            <span className="font-semibold text-gray-900">{item.year}년</span>
                                            {item.month && (
                                                <span className="ml-2 text-gray-700">{item.month.padStart(2, '0')}월</span>
                                            )}
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 font-medium rounded">
                                            순서: {item.order}
                                        </span>
                                    </div>
                                    <div className="pl-1">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 pl-1">
                                        {item.updatedBy ? (
                                            <>
                                                {t.website?.updatedBy || 'Updated by'}: {item.updatedBy} / {item.updatedByName}
                                                <br />
                                                {formatJakartaTime(item.updatedAt)}
                                            </>
                                        ) : item.createdBy ? (
                                            <>
                                                {t.website?.createdBy || 'Created by'}: {item.createdBy} / {item.createdByName}
                                                <br />
                                                {formatJakartaTime(item.createdAt)}
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(item, 'history')}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete('company_history', item.id!)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContactTab = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {t.website?.contactInfo || 'Contact Information'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    ℹ️ {currentLocale === 'ko' 
                        ? '푸터 / 회사 정보 > 연락처 / 고객 지원 > 연락 정보' 
                        : currentLocale === 'id' 
                        ? 'Footer / Informasi Perusahaan > Kontak / Dukungan Pelanggan > Informasi Kontak'
                        : currentLocale === 'zh'
                        ? '页脚 / 公司信息 > 联系方式 / 客户支持 > 联系信息'
                        : currentLocale === 'ja'
                        ? 'フッター / 会社情報 > 連絡先 / カスタマーサポート > 連絡先情報'
                        : currentLocale === 'ar'
                        ? 'تذييل الصفحة / معلومات الشركة > الاتصال / دعم العملاء > معلومات الاتصال'
                        : 'Footer / Company Info > Contact / Customer Support > Contact Info'}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.website?.address || 'Address'}
                        </label>
                        <input
                            type="text"
                            value={contactInfo?.address || ''}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value } as ContactInfo)}
                            onFocus={() => setIsContactEditing(true)}
                            onBlur={() => setIsContactEditing(false)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.phone || 'Phone'}
                            </label>
                            <input
                                type="text"
                                value={contactInfo?.phone || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value } as ContactInfo)}
                                onFocus={() => setIsContactEditing(true)}
                                onBlur={() => setIsContactEditing(false)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.email || 'Email'}
                            </label>
                            <input
                                type="email"
                                value={contactInfo?.email || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value } as ContactInfo)}
                                onFocus={() => setIsContactEditing(true)}
                                onBlur={() => setIsContactEditing(false)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.latitude || 'Latitude'}
                            </label>
                            <input
                                type="number"
                                step="0.000001"
                                value={contactInfo?.latitude || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, latitude: parseFloat(e.target.value) } as ContactInfo)}
                                onFocus={() => setIsContactEditing(true)}
                                onBlur={() => setIsContactEditing(false)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.website?.longitude || 'Longitude'}
                            </label>
                            <input
                                type="number"
                                step="0.000001"
                                value={contactInfo?.longitude || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, longitude: parseFloat(e.target.value) } as ContactInfo)}
                                onFocus={() => setIsContactEditing(true)}
                                onBlur={() => setIsContactEditing(false)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-xs text-gray-500">
                            {contactInfo?.updatedBy && (
                                <>
                                    {t.website?.updatedBy || 'Updated by'}: {contactInfo.updatedBy} / {contactInfo.updatedByName}
                                    <br />
                                    {formatJakartaTime(contactInfo.updatedAt)}
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => handleSaveContact(contactInfo!)}
                            disabled={saving || !contactInfo}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} className="inline mr-2" />
                            {t.website?.save || 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderVinegarStoryTab = () => (
        <VinegarStoryTab
            currentLocale={currentLocale}
            showToast={showToast}
            t={t}
            onEditingChange={setIsVinegarStoryEditing}
            refreshKey={refreshKey}
        />
    );

    const renderProductsTab = () => (
        <ProductsTab
            currentLocale={currentLocale}
            showToast={showToast}
            t={t}
            refreshKey={refreshKey}
        />
    );

    const renderFeaturedProductsTabOld = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t.website?.featuredProducts || 'Featured Products'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        ℹ️ {currentLocale === 'ko' ? '홈 / 제품 > 추천 제품' : 'Home / Products > Featured Products'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem({ 
                            name: '', 
                            description: '',
                            imageUrl: '',
                            productLink: '',
                            featured: true,
                            order: featuredProducts.length
                        });
                        setEditingType('featured-product');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'featured-product' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                >
                    <input
                        type="text"
                        placeholder={t.website?.productName || 'Product Name'}
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <textarea
                        placeholder={t.website?.description || 'Description'}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '제품 이미지' :
                             currentLocale === 'en' ? 'Product Image' :
                             currentLocale === 'id' ? 'Gambar Produk' :
                             currentLocale === 'zh' ? '产品图片' :
                             currentLocale === 'ja' ? '製品画像' :
                             currentLocale === 'ar' ? 'صورة المنتج' :
                             'Product Image'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={productImageRef}
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
                                onClick={() => productImageRef.current?.click()}
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
                    <input
                        type="text"
                        placeholder={t.website?.productLink || 'Product Link'}
                        value={editingItem.productLink || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, productLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    if (editingItem.id) {
                                        const { id, ...updateData } = editingItem;
                                        await updateDoc(doc(db, 'products', editingItem.id), updateData);
                                    } else {
                                        await addDoc(collection(db, 'products'), {
                                            ...editingItem,
                                            createdAt: new Date().toISOString()
                                        });
                                    }
                                    showToast(getAdminTranslation(currentLocale).website?.saveSuccess || 'Saved successfully', 'success');
                                    await loadFeaturedProducts();
                                    setEditingItem(null);
                                    setEditingType('');
                                } catch (error) {
                                    showToast(getAdminTranslation(currentLocale).website?.saveError || 'Failed to save', 'error');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProducts.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {item.imageUrl && (
                            <div className="aspect-video bg-gray-100 relative">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2">
                                    <Star className="text-yellow-400 fill-current" size={20} />
                                </div>
                            </div>
                        )}
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Order: {item.order}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(item, 'featured-product')}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete('products', item.id!)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


    const renderAllProductsTabOld = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t.website?.allProducts || 'All Products'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        ℹ️ {currentLocale === 'ko' ? '제품 > 모든 제품' : 'Products > All Products'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem({ 
                            name: '', 
                            description: '',
                            imageUrl: '',
                            productLink: '',
                            featured: false,
                            order: allProducts.length
                        });
                        setEditingType('product');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={16} />
                    {t.website?.addNew || 'Add New'}
                </button>
            </div>

            {editingItem && editingType === 'product' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6"
                >
                    <input
                        type="text"
                        placeholder={t.website?.productName || 'Product Name'}
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <textarea
                        placeholder={t.website?.description || 'Description'}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {currentLocale === 'ko' ? '제품 이미지' :
                             currentLocale === 'en' ? 'Product Image' :
                             currentLocale === 'id' ? 'Gambar Produk' :
                             currentLocale === 'zh' ? '产品图片' :
                             currentLocale === 'ja' ? '製品画像' :
                             currentLocale === 'ar' ? 'صورة المنتج' :
                             'Product Image'}
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={productImageRef2}
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
                                onClick={() => productImageRef2.current?.click()}
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
                    <input
                        type="text"
                        placeholder={t.website?.productLink || 'Product Link'}
                        value={editingItem.productLink || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, productLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={editingItem.featured || false}
                            onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                            {t.website?.featured || 'Featured'}
                        </label>
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
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    if (editingItem.id) {
                                        const { id, ...updateData } = editingItem;
                                        await updateDoc(doc(db, 'products', editingItem.id), updateData);
                                    } else {
                                        await addDoc(collection(db, 'products'), {
                                            ...editingItem,
                                            createdAt: new Date().toISOString()
                                        });
                                    }
                                    showToast(getAdminTranslation(currentLocale).website?.saveSuccess || 'Saved successfully', 'success');
                                    await loadAllProducts();
                                    setEditingItem(null);
                                    setEditingType('');
                                } catch (error) {
                                    showToast(getAdminTranslation(currentLocale).website?.saveError || 'Failed to save', 'error');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {item.imageUrl && (
                            <div className="aspect-video bg-gray-100 relative">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                {item.featured && (
                                    <div className="absolute top-2 right-2">
                                        <Star className="text-yellow-400 fill-current" size={20} />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Order: {item.order}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(item, 'product')}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete('products', item.id!)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderVinegarInfoTab = () => (
        <VinegarInfoTab
            vinegarInfoItems={vinegarInfoItems}
            loadVinegarInfo={loadVinegarInfo}
            currentLocale={currentLocale}
            showToast={showToast}
            t={t}
            onEditingChange={setIsVinegarInfoEditing}
            refreshKey={refreshKey}
        />
    );


    if (permissionDenied) {
        return (
            <AdminLayout>
                <ToastContainer toasts={toasts} onRemove={removeToast} />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">{t.website?.noPermission || 'You do not have permission to access this page'}</p>
                        <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (loading) {
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
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            {saving && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        <p className="text-gray-700 font-medium">{t.website?.saving || 'Saving...'}</p>
                    </div>
                </div>
            )}
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {t.navigation?.websiteManagement || 'Website Management'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {t.website?.subtitle || 'Manage website content and information'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RefreshIndicator 
                            isRefreshing={refreshing} 
                            label={currentLocale === 'ko' ? '새로고침 중...' : 'Refreshing...'}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {Object.entries(tabConfig).map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleTabChange(key as TabType)}
                                        className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-all ${
                                            activeTab === key 
                                                ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm font-medium">
                                            {t.website?.[config.label] || config.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'history' && renderHistoryTab()}
                                {activeTab === 'contact' && renderContactTab()}
                                {activeTab === 'vinegar-info' && renderVinegarInfoTab()}
                                {activeTab === 'vinegar-story' && renderVinegarStoryTab()}
                                {activeTab === 'products' && renderProductsTab()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}