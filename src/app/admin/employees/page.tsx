'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import RefreshIndicator from '@/components/admin/RefreshIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Search, Filter, Edit2, Check, X, 
    Clock, CheckCircle, XCircle, Calendar, Hash, User,
    ChevronDown
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, getDocsFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { checkAuthStatus } from '@/lib/auth/authHelpers';
import { checkPermission } from '@/lib/auth/permissions';
import { getAdminTranslation } from '@/lib/i18n/admin-translations';
import { getAdminLanguage } from '@/lib/utils/languageCache';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

interface Permissions {
    employeeManagement?: boolean;
    websiteManagement?: boolean;
    dashboard?: boolean;
    media?: boolean;
}

interface Employee {
    id: string;
    name: string;
    username: string;
    status: number;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    approvedAt: string | null;
    blockedAt: string | null;
    birthDate?: string;
    employeeId?: string;
    permissions?: Permissions;
}

interface EditingData {
    birthDate?: string;
    employeeId?: string;
    status?: number;
    permissions?: Permissions;
}

const statusConfig: Record<number, {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: typeof Clock | typeof CheckCircle | typeof XCircle;
}> = {
    0: { 
        label: 'pending',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        icon: Clock 
    },
    1: { 
        label: 'active',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: CheckCircle 
    },
    2: { 
        label: 'blocked',
        color: 'from-red-400 to-rose-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: XCircle 
    }
};

export default function EmployeeManagement() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<EditingData>({});
    const [currentLocale, setCurrentLocale] = useState('en');
    const [t, setT] = useState(() => getAdminTranslation('en'));
    const { toasts, showToast, removeToast } = useToast();
    const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        const locale = getAdminLanguage() || 'en';
        setCurrentLocale(locale);
        setT(getAdminTranslation(locale));
        verifyAndLoadData();
    }, []);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        if (permissionDenied || loading || editingId) return;
        
        const intervalId = setInterval(async () => {
            setRefreshing(true);
            await loadEmployees();
            setRefreshing(false);
        }, 5000); // 5 seconds

        return () => clearInterval(intervalId);
    }, [permissionDenied, loading, editingId]);

    useEffect(() => {
        filterEmployees();
    }, [employees, searchTerm, statusFilter]);

    useEffect(() => {
        if (permissionDenied) {
            showToast(t.employees?.noPermission || 'You do not have permission to access this page', 'error');
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
        const hasPermission = await checkPermission('employeeManagement');
        if (!hasPermission) {
            setPermissionDenied(true);
            setLoading(false);
            return;
        }
        
        await loadEmployees();
    };

    const loadEmployees = async () => {
        try {
            // Force fetch from server to get latest data
            const querySnapshot = await getDocsFromServer(collection(db, 'admins'));
            const employeeList: Employee[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                employeeList.push({
                    id: doc.id,
                    name: data.name || '',
                    username: data.username || '',
                    status: data.status ?? 0,
                    role: data.role || 'admin',
                    createdAt: data.createdAt || '',
                    lastLogin: data.lastLogin || null,
                    approvedAt: data.approvedAt || null,
                    blockedAt: data.blockedAt || null,
                    birthDate: data.birthDate || '',
                    employeeId: data.employeeId || '',
                    permissions: data.permissions || {}
                });
            });
            
            setEmployees(employeeList);
            setLoading(false);
        } catch (error) {
            showToast(t.employees?.loadError || 'Failed to load employees', 'error');
            setLoading(false);
        }
    };

    const filterEmployees = () => {
        let filtered = [...employees];
        
        if (searchTerm) {
            filtered = filtered.filter(emp => 
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(emp => emp.status.toString() === statusFilter);
        }
        
        setFilteredEmployees(filtered);
    };

    const handleEdit = (employee: Employee) => {
        setEditingId(employee.id);
        setEditingData({
            birthDate: employee.birthDate || '',
            employeeId: employee.employeeId || '',
            status: employee.status,
            permissions: employee.permissions || {}
        });
        setStatusDropdownId(null);
    };

    const handleSave = async (employeeId: string) => {
        setSavingId(employeeId);
        try {
            const docRef = doc(db, 'admins', employeeId);
            const updateData: any = {
                birthDate: editingData.birthDate || '',
                employeeId: editingData.employeeId || '',
                status: editingData.status,
                permissions: editingData.permissions || {}
            };
            
            if (editingData.status === 1) {
                updateData.approvedAt = new Date().toISOString();
                updateData.blockedAt = null;
            } else if (editingData.status === 2) {
                updateData.blockedAt = new Date().toISOString();
                updateData.approvedAt = null;
            } else {
                updateData.approvedAt = null;
                updateData.blockedAt = null;
            }
            
            await updateDoc(docRef, updateData);
            
            setEmployees(employees.map(emp => 
                emp.id === employeeId 
                    ? { ...emp, ...editingData, ...updateData }
                    : emp
            ));
            
            setEditingId(null);
            setEditingData({});
            showToast(t.employees?.updateSuccess || 'Employee updated successfully', 'success');
        } catch (error) {
            showToast(t.employees?.updateError || 'Failed to update employee', 'error');
        } finally {
            setSavingId(null);
        }
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Jakarta',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const formatter = new Intl.DateTimeFormat(
                currentLocale === 'ko' ? 'ko-KR' : 
                currentLocale === 'id' ? 'id-ID' : 
                currentLocale === 'zh' ? 'zh-CN' : 
                currentLocale === 'ja' ? 'ja-JP' : 
                currentLocale === 'ar' ? 'ar-SA' : 'en-US', 
                options
            );
            
            const parts = formatter.formatToParts(date);
            const year = parts.find(p => p.type === 'year')?.value;
            const month = parts.find(p => p.type === 'month')?.value;
            const day = parts.find(p => p.type === 'day')?.value;
            const weekday = parts.find(p => p.type === 'weekday')?.value;
            const hour = parts.find(p => p.type === 'hour')?.value;
            const minute = parts.find(p => p.type === 'minute')?.value;
            const second = parts.find(p => p.type === 'second')?.value;
            
            return `${year}.${month}.${day}(${weekday}) ${hour}:${minute}:${second}`;
        } catch {
            return '-';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            const weekdays = {
                ko: ['일', '월', '화', '수', '목', '금', '토'],
                en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                ja: ['日', '月', '火', '水', '木', '金', '土'],
                zh: ['日', '一', '二', '三', '四', '五', '六'],
                id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
            };
            
            const weekdayIndex = date.getDay();
            const weekdayName = weekdays[currentLocale as keyof typeof weekdays]?.[weekdayIndex] || weekdays.en[weekdayIndex];
            
            return `${year}.${month}.${day} (${weekdayName})`;
        } catch {
            return '-';
        }
    };

    if (permissionDenied) {
        return (
            <AdminLayout>
                <ToastContainer toasts={toasts} onRemove={removeToast} />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">{t.employees?.noPermission || 'You do not have permission to access this page'}</p>
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
            
            {savingId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        <p className="text-gray-700 font-medium">{t.employees?.pleaseWait || 'Please wait'}</p>
                    </div>
                </div>
            )}
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {t.navigation?.employeeManagement || 'Employee Management'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {t.employees?.subtitle || 'Manage employee accounts and permissions'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RefreshIndicator 
                            isRefreshing={refreshing} 
                            label={t.employees?.refreshing || 'Refreshing...'}
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">
                                {filteredEmployees.length} {t.employees?.employees || 'Employees'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t.employees?.searchPlaceholder || 'Search by name, User ID, or employee ID...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">{t.employees?.allStatuses || 'All Statuses'}</option>
                                <option value="0">{t.employees?.pending || 'Pending'}</option>
                                <option value="1">{t.employees?.active || 'Active'}</option>
                                <option value="2">{t.employees?.blocked || 'Blocked'}</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.name || 'Name'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.userId || 'User ID'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.employeeIdLabel || 'Employee ID'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.birthDate || 'Birth Date'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.permissions || 'Permissions'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.status || 'Status'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.lastLogin || 'Last Login'}
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                        {t.employees?.actions || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => {
                                    const isEditing = editingId === employee.id;
                                    const currentStatus: number = isEditing && editingData.status !== undefined 
                                        ? editingData.status 
                                        : employee.status;
                                    const StatusIcon = statusConfig[currentStatus as keyof typeof statusConfig]?.icon || Clock;
                                    
                                    return (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                        {employee.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-medium text-gray-900">{employee.name}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700">
                                                {employee.username}
                                            </td>
                                            <td className="py-4 px-4">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={editingData.employeeId || ''}
                                                            onChange={(e) => setEditingData({ ...editingData, employeeId: e.target.value })}
                                                            className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            placeholder="EMP001"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">
                                                        {employee.employeeId || '-'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="date"
                                                            value={editingData.birthDate || ''}
                                                            onChange={(e) => setEditingData({ ...editingData, birthDate: e.target.value })}
                                                            className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">
                                                        {employee.birthDate ? formatDate(employee.birthDate) : '-'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={editingData.permissions?.employeeManagement || false}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    permissions: {
                                                                        ...editingData.permissions,
                                                                        employeeManagement: e.target.checked
                                                                    }
                                                                })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-xs text-gray-700">{t.employees?.permissionEmployee || 'Employee'}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={editingData.permissions?.websiteManagement || false}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    permissions: {
                                                                        ...editingData.permissions,
                                                                        websiteManagement: e.target.checked
                                                                    }
                                                                })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-xs text-gray-700">{t.employees?.permissionWebsite || 'Website'}</span>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {employee.permissions?.employeeManagement && (
                                                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                                                {t.employees?.permissionEmployee || 'Employee'}
                                                            </span>
                                                        )}
                                                        {employee.permissions?.websiteManagement && (
                                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                                                {t.employees?.permissionWebsite || 'Website'}
                                                            </span>
                                                        )}
                                                        {!employee.permissions?.employeeManagement && !employee.permissions?.websiteManagement && (
                                                            <span className="text-xs text-gray-400">-</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                {isEditing ? (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setStatusDropdownId(statusDropdownId === employee.id ? null : employee.id)}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig[currentStatus].borderColor} ${statusConfig[currentStatus].bgColor} transition-all`}
                                                        >
                                                            <StatusIcon className={`w-4 h-4 ${statusConfig[currentStatus].textColor}`} />
                                                            <span className={`text-sm font-medium ${statusConfig[currentStatus].textColor}`}>
                                                                {t.employees?.[statusConfig[currentStatus].label] || statusConfig[currentStatus].label}
                                                            </span>
                                                            <ChevronDown className={`w-3 h-3 ${statusConfig[currentStatus].textColor}`} />
                                                        </button>
                                                        
                                                        <AnimatePresence>
                                                            {statusDropdownId === employee.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                                                                >
                                                                    {Object.entries(statusConfig).map(([value, config]) => (
                                                                        <button
                                                                            key={value}
                                                                            onClick={() => {
                                                                                setEditingData({ ...editingData, status: parseInt(value) });
                                                                                setStatusDropdownId(null);
                                                                            }}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            <config.icon className={`w-4 h-4 ${config.textColor}`} />
                                                                            <span className={`text-sm ${config.textColor}`}>
                                                                                {t.employees?.[config.label] || config.label}
                                                                            </span>
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusConfig[employee.status].bgColor} ${statusConfig[employee.status].borderColor} border`}>
                                                        <StatusIcon className={`w-4 h-4 ${statusConfig[employee.status].textColor}`} />
                                                        <span className={`text-sm font-medium ${statusConfig[employee.status].textColor}`}>
                                                            {t.employees?.[statusConfig[employee.status].label] || statusConfig[employee.status].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-gray-700 text-sm">
                                                {formatDateTime(employee.lastLogin)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleSave(employee.id)}
                                                            disabled={savingId !== null}
                                                            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(null);
                                                                setEditingData({});
                                                                setStatusDropdownId(null);
                                                            }}
                                                            disabled={savingId !== null}
                                                            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        disabled={savingId !== null || editingId !== null}
                                                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">{t.employees?.noEmployees || 'No employees found'}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{t.employees?.autoRefreshMessage || 'This page automatically refreshes every 5 seconds'}</span>
                </div>
            </div>
        </AdminLayout>
    );
}