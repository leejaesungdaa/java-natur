'use client';

import { memo } from 'react';

interface RefreshIndicatorProps {
    isRefreshing: boolean;
    label?: string;
}

const RefreshIndicator = memo(function RefreshIndicator({ 
    isRefreshing, 
    label = 'Refreshing...' 
}: RefreshIndicatorProps) {
    if (!isRefreshing) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-medium text-green-700">
                {label}
            </span>
        </div>
    );
});

export default RefreshIndicator;