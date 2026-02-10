import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  Clock, 
  Eye, 
  Heart, 
  Calendar,
  ArrowLeft,
  ChevronDown,
  Grid3X3,
  List,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition, HoverCard } from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlog';
import { PostModal } from '@/components/PostModal';

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

type SortOption = 'newest' | 'oldest' | 'popular' | 'mostLiked';
type ViewMode = 'grid' | 'list';

// Article Card Component
function ArticleCard({ post, onClick, viewMode }: { post: Post; onClick: () => void; viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <HoverCard>
        <div 
          className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer group flex flex-col md:flex-row"
          onClick={onClick}
        >
          <div className="md:w-64 aspect-video md:aspect-auto overflow-hidden flex-shrink-0">
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
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
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
          </div>
        </div>
      </div>
    </HoverCard>
  );
}

// Category Filter Component
function CategoryFilter({ 
  allTags, 
  selectedTags, 
  onToggleTag,
  postsCount,
  selectedCount
}: { 
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  postsCount: number;
  selectedCount: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayTags = isExpanded ? allTags : allTags.slice(0, 10);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-emerald-400" />
          <h3 className="text-white font-semibold">分类筛选</h3>
        </div>
        <span className="text-sm text-gray-500">
          共 {postsCount} 篇文章
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTags.map(tag => (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X size={12} className="inline ml-1" />
            )}
          </button>
        ))}
      </div>

      {allTags.length > 10 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          {isExpanded ? '收起' : `展开全部 (${allTags.length})`}
          <ChevronDown size={14} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      {selectedTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              已选择 <span className="text-emerald-400 font-semibold">{selectedCount}</span> 个分类
            </span>
            <button
              onClick={() => selectedTags.forEach(tag => onToggleTag(tag))}
              className="text-sm text-red-400 hover:text-red-300"
            >
              清除全部
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllPostsPage() {
  const navigate = useNavigate();
  const { posts, loading } = useBlogPosts();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all unique tags sorted by frequency
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
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

    return result;
  }, [posts, searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const openPost = (post: Post) => {
    setSelectedSlug(post.slug);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlug(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <PageTransition mode="fade">
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h1 className="text-xl font-bold text-white">全部文章</h1>
                <span className="text-sm text-gray-500">
                  共 {filteredPosts.length} 篇
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-800 rounded-lg p-1 mr-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">最新发布</option>
                  <option value="oldest">最早发布</option>
                  <option value="popular">最多浏览</option>
                  <option value="mostLiked">最多点赞</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="relative">
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
              </div>

              {/* Category Filter */}
              <CategoryFilter
                allTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                postsCount={posts.length}
                selectedCount={selectedTags.length}
              />

              {/* Quick Stats */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Filter size={18} className="text-emerald-400" />
                  文章统计
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">总文章数</span>
                    <span className="text-white font-medium">{posts.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">分类数量</span>
                    <span className="text-white font-medium">{allTags.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">总浏览量</span>
                    <span className="text-white font-medium">
                      {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">总点赞数</span>
                    <span className="text-white font-medium">
                      {posts.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid/List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-900/30 border border-gray-800 rounded-2xl">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">没有找到匹配的文章</p>
                  <p className="text-sm mt-2">试试调整筛选条件</p>
                  {(searchQuery || selectedTags.length > 0) && (
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTags([]);
                      }}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    >
                      清除筛选条件
                    </Button>
                  )}
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                    : 'space-y-4'
                }`}>
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ArticleCard 
                        post={post} 
                        onClick={() => openPost(post)} 
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Post Modal */}
      <PostModal
        slug={selectedSlug}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </PageTransition>
  );
}
