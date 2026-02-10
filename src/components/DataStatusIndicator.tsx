import { useState, useEffect } from 'react';

interface DataStatusIndicatorProps {
  lastUpdated: Date | null;
  isStale: boolean;
  onRefresh: () => void;
}

export function DataStatusIndicator({ 
  lastUpdated, 
  isStale,
  onRefresh 
}: DataStatusIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('加载中...');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdated) {
        setTimeAgo('加载中...');
        return;
      }

      try {
        const now = new Date();
        const lastUpdate = lastUpdated instanceof Date ? lastUpdated : new Date(lastUpdated);
        const diff = now.getTime() - lastUpdate.getTime();
        
        // 如果时间是未来的，显示刚刚
        if (diff < 0) {
          setTimeAgo('刚刚');
          return;
        }
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 5) {
          setTimeAgo('刚刚');
        } else if (seconds < 60) {
          setTimeAgo(`${seconds}秒前`);
        } else if (minutes < 60) {
          setTimeAgo(`${minutes}分钟前`);
        } else if (hours < 24) {
          setTimeAgo(`${hours}小时前`);
        } else if (days < 7) {
          setTimeAgo(`${days}天前`);
        } else {
          setTimeAgo(lastUpdate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        }
      } catch (e) {
        setTimeAgo('未知');
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 5000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // 确定当前状态
  const isLoading = !lastUpdated;
  
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        backgroundColor: isLoading 
          ? 'rgba(107, 114, 128, 0.2)' 
          : isStale 
            ? 'rgba(245, 158, 11, 0.2)' 
            : 'rgba(16, 185, 129, 0.2)',
        border: `1px solid ${isLoading ? '#6b7280' : isStale ? '#f59e0b' : '#10b981'}`,
        borderRadius: 20,
        color: isLoading ? '#9ca3af' : isStale ? '#f59e0b' : '#10b981',
        fontSize: 12,
        cursor: isLoading ? 'default' : 'pointer',
        zIndex: 100,
        transition: 'all 0.3s',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isLoading ? '#6b7280' : isStale ? '#f59e0b' : '#10b981',
          animation: isStale ? 'pulse 2s infinite' : isLoading ? 'pulse 1s infinite' : 'none',
        }}
      />
      {isLoading 
        ? '正在同步数据...' 
        : isStale 
          ? '数据可能已过期' 
          : '数据已同步'} · {timeAgo}
    </button>
  );
}

export default DataStatusIndicator;
