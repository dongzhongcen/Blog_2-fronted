import { useState, useEffect, useCallback, useRef } from 'react';
import type { BlogPost } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 实时数据管理 Hook
export function useRealtimePosts(refreshInterval = 30000) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取最新数据
  const fetchPosts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 添加时间戳防止缓存
      const response = await fetch(`${API_BASE_URL}/posts?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      
      setPosts(prevPosts => {
        // 合并新旧数据，保留本地未同步的更改
        const newPostsMap = new Map(data.posts.map((p: BlogPost) => [p.id, p]));
        
        // 如果数据有变化，更新状态
        const hasChanges = JSON.stringify(prevPosts) !== JSON.stringify(data.posts);
        if (hasChanges) {
          setIsStale(false);
        }
        
        return data.posts;
      });
      
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 定时刷新
  useEffect(() => {
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchPosts(false);
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPosts, refreshInterval]);

  // 监听窗口聚焦时刷新
  useEffect(() => {
    const handleFocus = () => {
      setIsStale(true);
      fetchPosts(false);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchPosts]);

  // 手动刷新
  const refresh = useCallback(() => {
    return fetchPosts(true);
  }, [fetchPosts]);

  // 强制刷新（清除缓存）
  const forceRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts?_refresh=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
      setLastUpdated(new Date());
      setIsStale(false);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    posts, 
    loading, 
    error, 
    refresh, 
    forceRefresh,
    lastUpdated,
    isStale,
  };
}

// WebSocket 连接管理（用于未来的实时功能）
export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onmessage = (event) => {
      setLastMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}

// 资源预加载 Hook
export function useResourcePreloader(resources: string[]) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(resources.length);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (resources.length === 0) {
      setIsComplete(true);
      return;
    }

    let loaded = 0;
    const promises = resources.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
        img.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(promises).then(() => {
      setIsComplete(true);
    });
  }, [resources]);

  const progress = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 100;

  return { progress, isComplete, loadedCount, totalCount };
}

// 页面可见性检测
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}

// 网络状态检测
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 获取连接类型（如果支持）
    const conn = (navigator as any).connection;
    if (conn) {
      setConnectionType(conn.effectiveType || 'unknown');
      conn.addEventListener('change', () => {
        setConnectionType(conn.effectiveType || 'unknown');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

// 数据同步状态指示器组件
export function DataStatusIndicator({ 
  lastUpdated, 
  isStale,
  onRefresh 
}: { 
  lastUpdated: Date | null;
  isStale: boolean;
  onRefresh: () => void;
}) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdated) {
        setTimeAgo('从未更新');
        return;
      }

      const now = new Date();
      const diff = now.getTime() - lastUpdated.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo('刚刚');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}秒前`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}分钟前`);
      } else if (hours < 24) {
        setTimeAgo(`${hours}小时前`);
      } else {
        setTimeAgo(lastUpdated.toLocaleDateString('zh-CN'));
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <button
      onClick={onRefresh}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        backgroundColor: isStale ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
        border: `1px solid ${isStale ? '#f59e0b' : '#10b981'}`,
        borderRadius: 20,
        color: isStale ? '#f59e0b' : '#10b981',
        fontSize: 12,
        cursor: 'pointer',
        zIndex: 100,
        transition: 'all 0.3s',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isStale ? '#f59e0b' : '#10b981',
          animation: isStale ? 'pulse 2s infinite' : 'none',
        }}
      />
      {isStale ? '数据可能已过期' : '数据已同步'} · {timeAgo}
    </button>
  );
}

export default useRealtimePosts;
