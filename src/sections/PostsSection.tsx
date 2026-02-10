import { useState, useMemo } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { PostModal } from '@/components/PostModal';
import { useBlogPosts } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Loader2
} from 'lucide-react';
// import type { BlogPost } from '@/types';

type ViewMode = 'grid' | 'list';
type SortMode = 'newest' | 'popular';

export function PostsSection() {
  const { posts, loading, error } = useBlogPosts();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((post) => post.tags.includes(selectedTag));
    }

    // Sort
    if (sortMode === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [posts, searchQuery, selectedTag, sortMode]);

  // Get featured post (most viewed)
  const featuredPost = useMemo(() => {
    return posts.length > 0
      ? posts.reduce((max, post) => (post.views > max.views ? post : max))
      : null;
  }, [posts]);

  const handlePostClick = (slug: string) => {
    setSelectedSlug(slug);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSlug(null), 300);
  };

  if (loading) {
    return (
      <section id="posts" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="posts" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>加载文章失败，请稍后重试</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="posts" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            技术<span className="gradient-text">文章</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            分享前端、后端、DevOps 等技术领域的学习笔记和实践经验
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && !searchQuery && !selectedTag && (
          <div className="mb-12">
            <BlogCard
              post={featuredPost}
              variant="featured"
              onClick={() => handlePostClick(featuredPost.slug)}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-dark-800"
            />
          </div>

          {/* Sort & View */}
          <div className="flex gap-2">
            <Button
              variant={sortMode === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortMode('newest')}
              className={sortMode === 'newest' ? 'bg-emerald-600' : ''}
            >
              最新
            </Button>
            <Button
              variant={sortMode === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortMode('popular')}
              className={sortMode === 'popular' ? 'bg-emerald-600' : ''}
            >
              热门
            </Button>
            <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-emerald-600' : ''}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-emerald-600' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
            className={selectedTag === null ? 'bg-emerald-600' : ''}
          >
            全部
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={selectedTag === tag ? 'bg-emerald-600' : ''}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Posts Grid/List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">没有找到匹配的文章</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                variant="compact"
                onClick={() => handlePostClick(post.slug)}
              />
            ))}
          </div>
        )}

        {/* Post Modal */}
        <PostModal
          slug={selectedSlug}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
}
