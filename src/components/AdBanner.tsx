import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import type { AdItem } from '@/types';

interface AdBannerProps {
  ad: AdItem;
  onClose?: () => void;
  closable?: boolean;
}

export function AdBanner({ ad, onClose, closable = false }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <Card className="glass-card overflow-hidden relative group">
      {closable && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
      >
        <div className="flex items-start gap-3">
          {ad.image && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {ad.title}
              </h4>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                广告
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {ad.description}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span>了解更多</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
}

interface AdSidebarProps {
  ads: AdItem[];
}

export function AdSidebar({ ads }: AdSidebarProps) {
  const [closedAds, setClosedAds] = useState<Set<string>>(new Set());

  const handleClose = (adId: string) => {
    setClosedAds((prev) => new Set(prev).add(adId));
  };

  const visibleAds = ads.filter((ad) => !closedAds.has(ad.id));

  if (visibleAds.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        赞助商
      </h3>
      {visibleAds.map((ad) => (
        <AdBanner
          key={ad.id}
          ad={ad}
          onClose={() => handleClose(ad.id)}
          closable
        />
      ))}
    </div>
  );
}

// Sample ads data
export const sampleAds: AdItem[] = [
  {
    id: '1',
    title: 'Vercel - 快速部署你的应用',
    description: '零配置部署，全球 CDN 加速，让开发更简单。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    link: 'https://vercel.com',
    type: 'sidebar',
  },
  {
    id: '2',
    title: 'Neon - Serverless Postgres',
    description: '现代开发者选择的 PostgreSQL 数据库。',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=200',
    link: 'https://neon.tech',
    type: 'sidebar',
  },
  {
    id: '3',
    title: 'Tailwind CSS - 实用优先的 CSS 框架',
    description: '快速构建现代网站，无需离开 HTML。',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=200',
    link: 'https://tailwindcss.com',
    type: 'sidebar',
  },
];
