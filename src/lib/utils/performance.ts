// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata?: Record<string, any>;
}

export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, PerformanceMetrics> = new Map();
    private isEnabled: boolean;

    private constructor() {
        this.isEnabled = typeof window !== 'undefined' && 'performance' in window;
    }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    startMeasurement(name: string, metadata?: Record<string, any>): void {
        if (!this.isEnabled) return;

        const metric: PerformanceMetrics = {
            name,
            startTime: performance.now(),
            metadata
        };
        
        this.metrics.set(name, metric);
        
        if (performance.mark) {
            performance.mark(`${name}-start`);
        }
    }

    endMeasurement(name: string): PerformanceMetrics | null {
        if (!this.isEnabled) return null;

        const metric = this.metrics.get(name);
        if (!metric) {
            console.warn(`Performance measurement '${name}' was not started`);
            return null;
        }

        const endTime = performance.now();
        const duration = endTime - metric.startTime;

        const completedMetric: PerformanceMetrics = {
            ...metric,
            endTime,
            duration
        };

        this.metrics.set(name, completedMetric);

        if (performance.mark && performance.measure) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
        }

        return completedMetric;
    }

    getMetric(name: string): PerformanceMetrics | undefined {
        return this.metrics.get(name);
    }

    getAllMetrics(): PerformanceMetrics[] {
        return Array.from(this.metrics.values());
    }

    clearMetrics(): void {
        this.metrics.clear();
        if (performance.clearMarks && performance.clearMeasures) {
            performance.clearMarks();
            performance.clearMeasures();
        }
    }

    logSlowOperations(threshold: number = 1000): void {
        const slowOperations = Array.from(this.metrics.values()).filter(
            metric => metric.duration && metric.duration > threshold
        );

        if (slowOperations.length > 0) {
            console.group('🐌 Slow Operations Detected');
            slowOperations.forEach(op => {
                console.warn(`${op.name}: ${op.duration?.toFixed(2)}ms`, op.metadata);
            });
            console.groupEnd();
        }
    }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Higher-order function for measuring function execution time
export const withPerformanceTracking = <T extends (...args: any[]) => any>(
    fn: T,
    name: string,
    metadata?: Record<string, any>
): T => {
    return ((...args: Parameters<T>) => {
        performanceMonitor.startMeasurement(name, metadata);
        
        try {
            const result = fn(...args);
            
            // Handle async functions
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    performanceMonitor.endMeasurement(name);
                });
            } else {
                performanceMonitor.endMeasurement(name);
                return result;
            }
        } catch (error) {
            performanceMonitor.endMeasurement(name);
            throw error;
        }
    }) as T;
};

// React hook for measuring component render performance
import { useEffect, useRef } from 'react';

export const usePerformanceTracking = (componentName: string, dependencies?: any[]) => {
    const renderCount = useRef(0);
    const firstRenderTime = useRef<number>();

    useEffect(() => {
        if (renderCount.current === 0) {
            firstRenderTime.current = performance.now();
            performanceMonitor.startMeasurement(`${componentName}-first-render`);
        } else {
            performanceMonitor.startMeasurement(`${componentName}-re-render-${renderCount.current}`);
        }

        renderCount.current++;

        return () => {
            if (renderCount.current === 1) {
                performanceMonitor.endMeasurement(`${componentName}-first-render`);
            } else {
                performanceMonitor.endMeasurement(`${componentName}-re-render-${renderCount.current - 1}`);
            }
        };
    }, dependencies);

    return {
        renderCount: renderCount.current,
        getFirstRenderTime: () => firstRenderTime.current
    };
};

// Bundle size analysis utilities
export const analyzeBundleSize = () => {
    if (typeof window === 'undefined') return null;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    return {
        scriptCount: scripts.length,
        styleCount: styles.length,
        totalAssets: scripts.length + styles.length,
        scripts: scripts.map(s => (s as HTMLScriptElement).src),
        styles: styles.map(s => (s as HTMLLinkElement).href)
    };
};

// Memory usage tracking
export const getMemoryUsage = () => {
    if (typeof window === 'undefined' || !('memory' in performance)) return null;

    const memory = (performance as any).memory;
    
    return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedMB: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        totalMB: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100
    };
};

// Network performance tracking
export const trackNetworkPerformance = () => {
    if (typeof window === 'undefined' || !(navigator as any).connection) return null;

    const connection = (navigator as any).connection;
    
    return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
    };
};

// Web Vitals tracking utilities
export const trackWebVitals = (callback: (metric: any) => void) => {
    if (typeof window === 'undefined') return;

    // Track First Contentful Paint
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            callback({
                name: entry.name,
                value: entry.startTime,
                type: 'paint'
            });
        }
    });

    if (PerformanceObserver.supportedEntryTypes.includes('paint')) {
        observer.observe({ entryTypes: ['paint'] });
    }

    // Track Largest Contentful Paint
    if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            callback({
                name: 'largest-contentful-paint',
                value: lastEntry.startTime,
                type: 'lcp'
            });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Track First Input Delay
    if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                callback({
                    name: 'first-input-delay',
                    value: (entry as any).processingStart - entry.startTime,
                    type: 'fid'
                });
            }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    }
};

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>): void => {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        
        const callNow = immediate && !timeout;
        
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func(...args);
    };
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false;
    
    return (...args: Parameters<T>): void => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Lazy loading utility
export const createLazyLoader = <T>(
    loader: () => Promise<T>,
    cacheKey?: string
): (() => Promise<T>) => {
    let cached: T | null = null;
    let loading: Promise<T> | null = null;

    return async (): Promise<T> => {
        if (cached) return cached;
        if (loading) return loading;

        loading = loader().then(result => {
            cached = result;
            loading = null;
            return result;
        });

        return loading;
    };
};

// Resource preloading utilities
export const preloadResource = (href: string, as: string, crossorigin?: string) => {
    if (typeof document === 'undefined') return;

    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    document.head.appendChild(link);
};

export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};