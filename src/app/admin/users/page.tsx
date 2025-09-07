'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { Check, X, Shield, Clock, Calendar, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getIndonesiaTime, formatIndonesiaTime } from '@/lib/utils/dateUtils';

interface AdminUser {
    id: string;
    name: string;
    username: string;
    password?: string;
    status: number;
    createdAt: string;
    approvedAt: string | null;
    blockedAt: string | null;
    lastLogin: string | null;
}

const statusConfig: { [key: number]: { label: string; color: string; icon: any } } = {
    0: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    1: { label: '승인됨', color: 'bg-green-100 text-green-800', icon: Check },
    2: { label: '차단됨', color: 'bg-red-100 text-red-800', icon: X }
};

export default function UsersManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 0 | 1 | 2>('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            loadUsers();
        }
    }, [status, router]);

    const loadUsers = async () => {
        try {
            const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const usersList: AdminUser[] = [];
            
            querySnapshot.forEach((doc) => {
                usersList.push({
                    id: doc.id,
                    ...doc.data()
                } as AdminUser);
            });
            
            setUsers(usersList);
        } catch (error) {
            toast.error('사용자 목록을 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, newStatus: number) => {
        try {
            const updateData: any = { status: newStatus };
            
            if (newStatus === 1) {
                updateData.approvedAt = getIndonesiaTime();
                updateData.blockedAt = null;
            } else if (newStatus === 2) {
                updateData.blockedAt = getIndonesiaTime();
                updateData.approvedAt = null;
            } else if (newStatus === 0) {
                updateData.approvedAt = null;
                updateData.blockedAt = null;
            }
            
            await updateDoc(doc(db, 'admins', userId), updateData);
            
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, ...updateData }
                        : user
                )
            );
            
            await loadUsers();
            
            const statusLabels: { [key: number]: string } = { 0: '대기', 1: '승인', 2: '차단' };
            toast.success(`사용자가 ${statusLabels[newStatus]} 처리되었습니다`);
        } catch (error) {
            toast.error('상태 업데이트에 실패했습니다');
        }
    };

    const filteredUsers = filterStatus === 'all'
        ? users
        : users.filter(user => user.status === filterStatus);

    const formatDate = (dateString: string | null) => {
        return formatIndonesiaTime(dateString);
    };

    if (status === 'loading' || loading) {
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
                        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
                        <p className="text-gray-600 mt-1">관리자 계정 승인 및 관리</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filterStatus === 'all' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            전체 ({users.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(0)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filterStatus === 0 
                                    ? 'bg-yellow-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            대기 ({users.filter(u => u.status === 0).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filterStatus === 1 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            승인 ({users.filter(u => u.status === 1).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(2)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filterStatus === 2 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            차단 ({users.filter(u => u.status === 2).length})
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    사용자
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상태
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    가입 신청일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    승인일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    마지막 로그인
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => {
                                const StatusIcon = statusConfig[user.status as 0 | 1 | 2].icon;
                                return (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-gray-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[user.status as 0 | 1 | 2].color}`}>
                                                <StatusIcon size={14} />
                                                {statusConfig[user.status as 0 | 1 | 2].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.approvedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.lastLogin)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                {user.status !== 1 && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 1)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="승인"
                                                    >
                                                        <Check size={20} />
                                                    </button>
                                                )}
                                                {user.status !== 2 && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 2)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="차단"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                                {user.status === 2 && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 0)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        title="차단 해제"
                                                    >
                                                        <Shield size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">해당하는 사용자가 없습니다</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}