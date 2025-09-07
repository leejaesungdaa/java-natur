'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import {
    Users, Eye, Package, ShoppingCart,
    Activity, ArrowUp, ArrowDown
} from 'lucide-react';
import {
    AreaChart, Area, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/lib/auth/authHelpers';
import { auth } from '@/lib/firebase/firebaseConfig';

interface StatCard {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StatCard[]>([]);
    const [visitorData, setVisitorData] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<any[]>([]);
    const [userName, setUserName] = useState('Administrator');

    useEffect(() => {
        const verifyAuth = async () => {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin-token='))
                ?.split('=')[1];
            
            if (!token) {
                router.push('/admin/login');
                return;
            }
            
            const user = await checkAuthStatus();
            if (!user) {
                document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                router.push('/admin/login');
            } else {
                setUserName(user.displayName || user.email || 'Administrator');
                await loadDashboardData();
            }
        };
        verifyAuth();
    }, [router]);

    const loadDashboardData = async () => {
        setStats([
            {
                title: 'Total Visitors',
                value: '12,543',
                change: 12.5,
                icon: <Users className="w-6 h-6" />,
                color: 'from-blue-500 to-cyan-500'
            },
            {
                title: 'Page Views',
                value: '45,678',
                change: 8.3,
                icon: <Eye className="w-6 h-6" />,
                color: 'from-purple-500 to-pink-500'
            },
            {
                title: 'Products',
                value: '24',
                change: 0,
                icon: <Package className="w-6 h-6" />,
                color: 'from-green-500 to-emerald-500'
            },
            {
                title: 'Inquiries',
                value: '156',
                change: -5.2,
                icon: <ShoppingCart className="w-6 h-6" />,
                color: 'from-orange-500 to-red-500'
            }
        ]);

        setVisitorData([
            { name: 'Mon', visitors: 4000, pageViews: 2400 },
            { name: 'Tue', visitors: 3000, pageViews: 1398 },
            { name: 'Wed', visitors: 2000, pageViews: 9800 },
            { name: 'Thu', visitors: 2780, pageViews: 3908 },
            { name: 'Fri', visitors: 1890, pageViews: 4800 },
            { name: 'Sat', visitors: 2390, pageViews: 3800 },
            { name: 'Sun', visitors: 3490, pageViews: 4300 }
        ]);

        setDeviceData([
            { name: 'Desktop', value: 45, color: '#3B82F6' },
            { name: 'Mobile', value: 35, color: '#10B981' },
            { name: 'Tablet', value: 20, color: '#F59E0B' }
        ]);

        setLoading(false);
    };

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
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg text-white`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${
                                    stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {stat.change > 0 ? <ArrowUp className="w-4 h-4" /> : stat.change < 0 ? <ArrowDown className="w-4 h-4" /> : null}
                                    {Math.abs(stat.change)}%
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Visitor Analytics</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Area type="monotone" dataKey="visitors" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVisitors)" />
                                <Area type="monotone" dataKey="pageViews" stroke="#10B981" fillOpacity={1} fill="url(#colorPageViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Device Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name} ${entry.value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                        <Activity className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { action: 'New inquiry received', time: '5 minutes ago', type: 'inquiry' },
                            { action: 'Product "Pineapple Vinegar" updated', time: '1 hour ago', type: 'product' },
                            { action: 'New image uploaded to gallery', time: '2 hours ago', type: 'media' },
                            { action: 'Site settings updated', time: '3 hours ago', type: 'settings' },
                            { action: 'Analytics report generated', time: '5 hours ago', type: 'analytics' }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.type === 'inquiry' ? 'bg-blue-500' :
                                        activity.type === 'product' ? 'bg-green-500' :
                                        activity.type === 'media' ? 'bg-purple-500' :
                                        activity.type === 'settings' ? 'bg-orange-500' :
                                        'bg-gray-500'
                                    }`}></div>
                                    <span className="text-gray-900">{activity.action}</span>
                                </div>
                                <span className="text-sm text-gray-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}