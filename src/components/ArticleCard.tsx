import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '@/types';
import { format } from 'date-fns';

interface ArticleCardProps {
  post: BlogPost;
  onClick?: () => void;
  variant?: 'default' | 'horizontal';
}

export function ArticleCard({ post, onClick, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <Card 
        className="glass-card overflow-hidden group cursor-pointer hover:bg-white/5 transition-all duration-300 gradient-border"
        onClick={onClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
            <img
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400 border-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}min
              </span>
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

          {/* Arrow */}
          <div className="w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="glass-card overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 gradient-border glow-effect"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={post.coverImage || '/placeholder.jpg'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="bg-emerald-600/80 text-white text-xs border-0">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{format(new Date(post.publishedAt), 'MM-dd')}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
