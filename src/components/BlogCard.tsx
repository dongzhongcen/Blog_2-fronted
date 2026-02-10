import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Eye, 
  Heart, 
  ArrowRight,
  Calendar
} from 'lucide-react';
import type { BlogPost } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: () => void;
}

export function BlogCard({ post, variant = 'default', onClick }: BlogCardProps) {
  if (variant === 'featured') {
    return (
      <Card 
        className="glass-card-strong overflow-hidden group cursor-pointer gradient-border"
        onClick={onClick}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t md:from-black/50 md:to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-emerald-500 text-white">精选</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {post.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} 分钟阅读</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/btn"
              >
                阅读全文
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        className="glass-card p-4 group cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          {post.coverImage && (
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {tag}
                </span>
              ))}
            </div>
            
            <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {post.title}
            </h4>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{format(new Date(post.publishedAt), 'MM-dd')}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}min
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className="glass-card overflow-hidden group cursor-pointer glow-effect"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage || '/placeholder.jpg'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Tags on image */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(post.publishedAt), 'yyyy-MM-dd')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}min
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {post.likes}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
