import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Save, Globe, Power } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { getCurrentAdminInfo } from '@/lib/auth/authHelpers';
import { formatJakartaTime } from '@/lib/utils/dateFormat';

interface SocialMediaTabProps {
    currentLocale: string;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    t: any;
    onEditingChange?: (editing: boolean) => void;
    refreshKey?: number;
}

interface SocialMediaSettings {
    facebook: {
        enabled: boolean;
        url: string;
    };
    instagram: {
        enabled: boolean;
        url: string;
    };
    twitter: {
        enabled: boolean;
        url: string;
    };
    updatedBy?: string;
    updatedByName?: string;
    updatedAt?: string;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
    currentLocale,
    showToast,
    t,
    onEditingChange,
    refreshKey
}) => {
    const [settings, setSettings] = useState<SocialMediaSettings>({
        facebook: { enabled: false, url: '' },
        instagram: { enabled: false, url: '' },
        twitter: { enabled: false, url: '' }
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, [refreshKey]);

    useEffect(() => {
        if (onEditingChange) {
            onEditingChange(saving);
        }
    }, [saving, onEditingChange]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'siteSettings', 'socialMedia');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SocialMediaSettings);
            } else {
                // Initialize with default settings if document doesn't exist
                const defaultSettings: SocialMediaSettings = {
                    facebook: { enabled: false, url: '' },
                    instagram: { enabled: false, url: '' },
                    twitter: { enabled: false, url: '' }
                };
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error('Error loading social media settings:', error);
            // Initialize with default settings on error
            const defaultSettings: SocialMediaSettings = {
                facebook: { enabled: false, url: '' },
                instagram: { enabled: false, url: '' },
                twitter: { enabled: false, url: '' }
            };
            setSettings(defaultSettings);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            let settingsData: any = {
                ...settings,
                updatedAt: formatJakartaTime(new Date())
            };
            
            try {
                const adminInfo = await getCurrentAdminInfo();
                if (adminInfo) {
                    settingsData.updatedBy = adminInfo.uid;
                    settingsData.updatedByName = adminInfo.displayName || 'Admin';
                }
            } catch (authError) {
                console.warn('Could not get admin info:', authError);
                // Continue without admin info
            }

            await setDoc(doc(db, 'siteSettings', 'socialMedia'), settingsData);
            
            showToast(
                currentLocale === 'ko' ? 'SNS 설정이 저장되었습니다' :
                currentLocale === 'en' ? 'Social media settings saved' :
                currentLocale === 'id' ? 'Pengaturan media sosial disimpan' :
                currentLocale === 'zh' ? '社交媒体设置已保存' :
                currentLocale === 'ja' ? 'ソーシャルメディア設定が保存されました' :
                currentLocale === 'ar' ? 'تم حفظ إعدادات وسائل التواصل الاجتماعي' :
                'Social media settings saved',
                'success'
            );
        } catch (error: any) {
            console.error('Error saving social media settings:', error);
            const errorMessage = error?.message || 'Unknown error';
            showToast(
                currentLocale === 'ko' ? `SNS 설정 저장 중 오류가 발생했습니다: ${errorMessage}` :
                currentLocale === 'en' ? `Error saving social media settings: ${errorMessage}` :
                currentLocale === 'id' ? `Kesalahan menyimpan pengaturan media sosial: ${errorMessage}` :
                currentLocale === 'zh' ? `保存社交媒体设置时出错: ${errorMessage}` :
                currentLocale === 'ja' ? `ソーシャルメディア設定の保存エラー: ${errorMessage}` :
                currentLocale === 'ar' ? `خطأ في حفظ إعدادات وسائل التواصل الاجتماعي: ${errorMessage}` :
                `Error saving social media settings: ${errorMessage}`,
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const renderSocialMedia = (
        platform: 'facebook' | 'instagram' | 'twitter',
        Icon: React.ElementType,
        label: string,
        color: string
    ) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${color}`} />
                    <h3 className="text-lg font-semibold">{label}</h3>
                </div>
                <button
                    onClick={() => setSettings({
                        ...settings,
                        [platform]: {
                            ...settings[platform],
                            enabled: !settings[platform].enabled
                        }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[platform].enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[platform].enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLocale === 'ko' ? 'URL 주소' :
                     currentLocale === 'en' ? 'URL Address' :
                     currentLocale === 'id' ? 'Alamat URL' :
                     currentLocale === 'zh' ? 'URL地址' :
                     currentLocale === 'ja' ? 'URLアドレス' :
                     currentLocale === 'ar' ? 'عنوان URL' :
                     'URL Address'}
                </label>
                <input
                    type="url"
                    value={settings[platform].url}
                    onChange={(e) => setSettings({
                        ...settings,
                        [platform]: {
                            ...settings[platform],
                            url: e.target.value
                        }
                    })}
                    placeholder={`https://${platform}.com/...`}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={!settings[platform].enabled}
                />
            </div>
            
            {settings[platform].enabled && settings[platform].url && (
                <div className="mt-3">
                    <a
                        href={settings[platform].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                    >
                        <Globe size={14} />
                        {currentLocale === 'ko' ? '링크 확인' :
                         currentLocale === 'en' ? 'Check Link' :
                         currentLocale === 'id' ? 'Periksa Tautan' :
                         currentLocale === 'zh' ? '检查链接' :
                         currentLocale === 'ja' ? 'リンクを確認' :
                         currentLocale === 'ar' ? 'تحقق من الرابط' :
                         'Check Link'}
                    </a>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {currentLocale === 'ko' ? 'SNS 관리' :
                         currentLocale === 'en' ? 'Social Media Management' :
                         currentLocale === 'id' ? 'Manajemen Media Sosial' :
                         currentLocale === 'zh' ? '社交媒体管理' :
                         currentLocale === 'ja' ? 'ソーシャルメディア管理' :
                         currentLocale === 'ar' ? 'إدارة وسائل التواصل الاجتماعي' :
                         'Social Media Management'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {currentLocale === 'ko' ? '푸터에 표시될 SNS 아이콘을 관리합니다' :
                         currentLocale === 'en' ? 'Manage social media icons displayed in footer' :
                         currentLocale === 'id' ? 'Kelola ikon media sosial yang ditampilkan di footer' :
                         currentLocale === 'zh' ? '管理页脚中显示的社交媒体图标' :
                         currentLocale === 'ja' ? 'フッターに表示されるSNSアイコンを管理' :
                         currentLocale === 'ar' ? 'إدارة أيقونات وسائل التواصل الاجتماعي المعروضة في التذييل' :
                         'Manage social media icons displayed in footer'}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? (
                        currentLocale === 'ko' ? '저장 중...' :
                        currentLocale === 'en' ? 'Saving...' :
                        currentLocale === 'id' ? 'Menyimpan...' :
                        currentLocale === 'zh' ? '保存中...' :
                        currentLocale === 'ja' ? '保存中...' :
                        currentLocale === 'ar' ? 'جاري الحفظ...' :
                        'Saving...'
                    ) : (
                        currentLocale === 'ko' ? '저장' :
                        currentLocale === 'en' ? 'Save' :
                        currentLocale === 'id' ? 'Simpan' :
                        currentLocale === 'zh' ? '保存' :
                        currentLocale === 'ja' ? '保存' :
                        currentLocale === 'ar' ? 'حفظ' :
                        'Save'
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSocialMedia('facebook', Facebook, 'Facebook', 'text-blue-600')}
                {renderSocialMedia('instagram', Instagram, 'Instagram', 'text-pink-600')}
                {renderSocialMedia('twitter', Twitter, 'Twitter', 'text-blue-400')}
            </div>

            {settings.updatedAt && (
                <div className="text-sm text-gray-500 text-right mt-4">
                    {currentLocale === 'ko' ? '마지막 수정:' :
                     currentLocale === 'en' ? 'Last modified:' :
                     currentLocale === 'id' ? 'Terakhir diubah:' :
                     currentLocale === 'zh' ? '最后修改:' :
                     currentLocale === 'ja' ? '最終変更:' :
                     currentLocale === 'ar' ? 'آخر تعديل:' :
                     'Last modified:'} {settings.updatedByName} - {settings.updatedAt}
                </div>
            )}
        </div>
    );
};