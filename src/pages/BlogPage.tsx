import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Eye,
  Heart,
  Search,
  Filter,
  X,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition, HoverCard } from '@/components/PageTransition';
import { PostModal } from '@/components/PostModal';
import { useBlogPosts } from '@/hooks/useBlog';

// Types
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  likes: number;
  views: number;
}

// Article Card Component
function ArticleCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <HoverCard>
      <div 
        className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
        onClick={onClick}
      >
        <div className="aspect-video overflow-hidden">
          <motion.img 
            src={post.coverImage || 'https://via.placeholder.com/400x225?text=No+Image'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.1 }}
          />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-800">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readTime}min
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} /> {post.likes}
            </span>
          </div>
        </div>
      </div>
    </HoverCard>
  );
}

// Filter Component
function PostFilter({ 
  posts, 
  filteredPosts, 
  setFilteredPosts,
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy
}: { 
  posts: Post[];
  filteredPosts: Post[];
  setFilteredPosts: (posts: Post[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortBy: 'newest' | 'oldest' | 'popular' | 'mostLiked';
  setSortBy: (sort: 'newest' | 'oldest' | 'popular' | 'mostLiked') => void;
}) {
  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  // Apply filters
  useEffect(() => {
    let result = [...posts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTags, sortBy, setFilteredPosts]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  const hasFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'newest';

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="popular">最多浏览</option>
            <option value="mostLiked">最多点赞</option>
          </select>

          {hasFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              <X size={16} className="mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter size={16} />
            按标签筛选
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 修复：添加文章统计信息 */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <div className="text-xs text-gray-500">总文章数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{filteredPosts.length}</div>
            <div className="text-xs text-gray-500">当前显示</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">总浏览量</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {posts.reduce((sum, post) => sum + post.likes, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">总点赞数</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Page Component
export default function BlogPage() {
  const { posts, loading, error } = useBlogPosts();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'mostLiked'>('newest');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 修复：确保文章数量正确显示
  useEffect(() => {
    if (posts && Array.isArray(posts)) {
      setFilteredPosts(posts);
    }
  }, [posts]);

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
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">加载文章中...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center text-red-400">
            <p>加载文章失败，请稍后重试</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              重新加载
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-black/50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* 修复：添加文章数量显示 */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                技术<span className="gradient-text">博客</span>
              </h1>
              <p className="text-gray-400 text-lg">
                共 {posts.length} 篇文章，当前显示 {filteredPosts.length} 篇
              </p>
            </div>

            {/* Featured Post */}
            {featuredPost && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-emerald-900/30 to-gray-900/50 border border-emerald-500/20 rounded-2xl p-8 mb-12 cursor-pointer group"
                onClick={() => handlePostClick(featuredPost.slug)}
              >
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="lg:w-1/3">
                    <img 
                      src={featuredPost.coverImage || 'https://via.placeholder.com/400x225?text=Featured'} 
                      alt={featuredPost.title}
                      className="w-full h-48 lg:h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="lg:w-2/3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-3 py-1 text-sm rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {tag}
                        </span>
                      ))}
                      <span className="px-3 py-1 text-sm rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        精选文章
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(featuredPost.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {featuredPost.readTime}分钟阅读
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {featuredPost.views} 浏览
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} /> {featuredPost.likes} 点赞
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Filter Component */}
          <PostFilter
            posts={posts}
            filteredPosts={filteredPosts}
            setFilteredPosts={setFilteredPosts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">没有找到匹配的文章</h3>
              <p className="text-gray-600">尝试调整搜索条件或清除筛选</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard 
                    post={post} 
                    onClick={() => handlePostClick(post.slug)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button (if needed) */}
          {filteredPosts.length > 0 && filteredPosts.length < posts.length && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => setFilteredPosts(posts)} // Show all posts
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                显示全部文章 ({posts.length} 篇)
              </Button>
            </div>
          )}
        </div>

        {/* Post Modal */}
        <PostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          slug={selectedSlug}
        />
      </div>
    </PageTransition>
  );
}