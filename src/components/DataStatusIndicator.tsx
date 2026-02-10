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

export default DataStatusIndicator;
