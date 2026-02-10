import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBlogPost, useLikePost } from '@/hooks/useBlog';
import { CommentSection } from './CommentSection';
import { 
  Clock, 
  Eye, 
  Heart, 
  Calendar,
  X,
  Share2,
  Bookmark,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState, useEffect } from 'react';

interface PostModalProps {
  slug: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostModal({ slug, isOpen, onClose }: PostModalProps) {
  const { post, loading, error } = useBlogPost(slug || '');
  const { liked, likeCount, likePost } = useLikePost(post?.id || '');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (post) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setIsBookmarked(bookmarks.includes(post.id));
    }
  }, [post]);

  const handleBookmark = () => {
    if (!post) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    
    if (isBookmarked) {
      const updated = bookmarks.filter((id: string) => id !== post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updated));
    } else {
      bookmarks.push(post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-[#0d1117] border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error || !post ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <X className="w-12 h-12 mb-3 opacity-30" />
            <p>文章加载失败</p>
          </div>
        ) : (
          <>
            {/* Header Image */}
            <div className="relative h-64 sm:h-80">
              <img
                src={post.coverImage || '/placeholder.jpg'}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent" />
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-emerald-600/80 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 left-4 bg-black/50 hover:bg-emerald-600/80 text-white rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
                <DialogHeader>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-white text-left">
                    {post.title}
                  </DialogTitle>
                </DialogHeader>
              </div>
            </div>

            <ScrollArea className="max-h-[calc(90vh-20rem)]">
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} 分钟阅读</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} 阅读</span>
                  </div>

                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={likePost}
                      className={liked ? 'text-red-500 border-red-500/50 bg-red-500/10' : 'border-white/20'}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                      {likeCount || post.likes}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={isBookmarked ? 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10' : 'border-white/20'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg">
                    {post.content}
                  </div>
                </div>

                {/* Comments */}
                <CommentSection postId={post.id} />
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
