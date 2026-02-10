import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Eye, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types';

interface ArticleCarouselProps {
  posts: BlogPost[];
  onPostClick: (slug: string) => void;
}

export function ArticleCarousel({ posts, onPostClick }: ArticleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const featuredPosts = posts.slice(0, 5); // Top 5 posts

  const goToNext = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  }, [featuredPosts.length]);

  const goToPrev = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  }, [featuredPosts.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || featuredPosts.length <= 1) return;
    
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, goToNext, featuredPosts.length]);

  if (featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Carousel */}
      <Card className="glass-card-strong overflow-hidden gradient-border glow-effect">
        <div className="relative h-[400px] overflow-hidden">
          {/* Background Image */}
          <div 
            key={currentPost.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              direction === 'right' ? 'animate-slide-up' : 'animate-fade-in'
            }`}
          >
            <img
              src={currentPost.coverImage || '/placeholder.jpg'}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div 
              key={`content-${currentPost.id}`}
              className="animate-slide-up"
            >
              {/* Tags */}
              <div className="flex gap-2 mb-4">
                {currentPost.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    className="bg-emerald-500/80 text-white border-0"
                  >
                    {tag}
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  精选文章
                </Badge>
              </div>

              {/* Title */}
              <h2 
                className="text-3xl md:text-4xl font-bold text-white mb-3 line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => onPostClick(currentPost.slug)}
              >
                {currentPost.title}
              </h2>

              {/* Excerpt */}
              <p className="text-gray-300 mb-4 line-clamp-2 max-w-2xl">
                {currentPost.excerpt}
              </p>

              {/* Meta & CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentPost.readTime} 分钟阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {currentPost.views}
                  </span>
                </div>

                <Button 
                  onClick={() => onPostClick(currentPost.slug)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 group"
                >
                  阅读全文
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-emerald-600/80 flex items-center justify-center transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-emerald-600/80 flex items-center justify-center transition-all group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </Card>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {featuredPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => goToSlide(index)}
            className={`relative w-16 h-10 rounded-lg overflow-hidden transition-all ${
              index === currentIndex 
                ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0a0a0a] scale-110' 
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <img
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / featuredPosts.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
