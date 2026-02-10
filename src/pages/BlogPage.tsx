import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  MapPin, 
  Mail, 
  Github, 
  Twitter,
  Linkedin,
  Code2,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Settings,
  User,
  Search,
  Filter,
  X,
  Calendar,
  ChevronDown,
  Award,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="popular">最多浏览</option>
            <option value="mostLiked">最多点赞</option>
          </select>
          {hasFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Filter size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 flex items-center gap-1 mr-2">
            <Filter size={14} /> 标签筛选:
          </span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && <X size={12} className="inline ml-1" />}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-500">
        共 <span className="text-emerald-400 font-semibold">{filteredPosts.length}</span> 篇文章
        {selectedTags.length > 0 && (
          <span>，已选择 {selectedTags.length} 个标签</span>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [isDark, setIsDark] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'mostLiked'>('newest');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  
  const { posts, loading } = useBlogPosts();
  const navigate = useNavigate();

  const homeRef = useRef<HTMLDivElement | null>(null);
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const postsRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => setIsDark(!isDark);
  const featuredPosts = posts.slice(0, 3);

  // Auto slide
  useEffect(() => {
    if (featuredPosts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = [
        { id: 'home', ref: homeRef },
        { id: 'featured', ref: featuredRef },
        { id: 'posts', ref: postsRef },
        { id: 'about', ref: aboutRef },
      ];

      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      home: homeRef,
      featured: featuredRef,
      posts: postsRef,
      about: aboutRef,
    };
    
    const ref = refs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openPost = (post: any) => {
    setSelectedSlug(post.slug);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const mutedText = isDark ? '#9ca3af' : '#6b7280';

  return (
    <PageTransition mode="fade">
      <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ 
          width: '320px', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          background: isDark ? 'linear-gradient(180deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' : '#f8fafc',
          borderRight: `1px solid ${borderColor}`,
          overflowY: 'auto',
          zIndex: 40
        }}>
          <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Code2 size={20} color="white" />
                </div>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>DevBlog</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="text-gray-400 hover:text-emerald-400"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <button 
                  onClick={toggleTheme}
                  style={{ 
                    padding: '8px', 
                    borderRadius: '50%', 
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#4b5563" />}
                </button>
              </div>
            </div>

            {/* Profile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ 
                padding: '20px', 
                borderRadius: '16px', 
                background: cardBg,
                border: `1px solid ${borderColor}`,
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '96px', 
                height: '96px', 
                borderRadius: '50%', 
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                DB
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Dev Blogger</h2>
              <p style={{ color: '#10b981', fontSize: '14px', marginBottom: '12px' }}>全栈开发者</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', color: mutedText }}>
                <MapPin size={12} />
                <span>中国 · 北京</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                {[{ value: `${posts.length}+`, label: '文章' }, { value: '12K+', label: '阅读' }, { value: '2K+', label: '点赞' }].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: mutedText }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <nav style={{ marginBottom: '24px' }}>
              {[
                { id: 'home', label: '首页', icon: Sparkles },
                { id: 'featured', label: '精选', icon: Zap },
                { id: 'posts', label: '文章', icon: TrendingUp },
                { id: 'about', label: '关于', icon: User },
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeSection === item.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: activeSection === item.id ? '#10b981' : mutedText,
                    cursor: 'pointer',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Tech Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                background: cardBg,
                border: `1px solid ${borderColor}`,
                marginBottom: '24px'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#10b981" />
                技术栈
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker'].map((tech) => (
                  <span key={tech} style={{ 
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Social */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                background: cardBg,
                border: `1px solid ${borderColor}`,
                marginBottom: '24px'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>关注我</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { icon: Github, url: 'https://github.com' },
                  { icon: Twitter, url: 'https://twitter.com' },
                  { icon: Linkedin, url: 'https://linkedin.com' },
                  { icon: Mail, url: 'mailto:blog@example.com' },
                ].map(({ icon: Icon, url }, i) => (
                  <motion.a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={18} color={mutedText} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Time */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ textAlign: 'center', paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}
            >
              <div style={{ fontSize: '24px', fontFamily: 'monospace', color: '#34d399', fontWeight: 'bold' }}>
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: '12px', color: mutedText, marginTop: '4px' }}>
                {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </div>
            </motion.div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ marginLeft: '320px', flex: 1, minHeight: '100vh' }}>
          {/* Hero */}
          <section ref={homeRef} style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '32px',
            background: isDark ? 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' : '#f8fafc'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '768px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  marginBottom: '32px'
                }}
              >
                <Sparkles size={16} color="#10b981" />
                <span style={{ fontSize: '14px', color: mutedText }}>欢迎来到我的技术博客</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '24px' }}
              >
                <span>探索</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 8px'
                }}>技术</span>
                <span>的无限可能</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontSize: '20px', color: mutedText, marginBottom: '40px', lineHeight: 1.6 }}
              >
                分享前端开发、后端架构、DevOps 实践等技术笔记
                <br />
                与志同道合的开发者一起成长
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('featured')}
                  style={{ 
                    padding: '12px 32px',
                    borderRadius: '9999px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Zap size={18} />
                  浏览文章
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('about')}
                  style={{ 
                    padding: '12px 32px',
                    borderRadius: '9999px',
                    background: 'transparent',
                    color: textColor,
                    border: `1px solid ${borderColor}`,
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  关于我
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '64px' }}
              >
                {[{ value: `${posts.length}+`, label: '技术文章' }, { value: '12K+', label: '总阅读' }, { value: '2K+', label: '获赞' }].map((stat, index) => (
                  <motion.div 
                    key={stat.label} 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ 
                      fontSize: '30px', 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #34d399, #10b981)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>{stat.value}</div>
                    <div style={{ fontSize: '14px', color: mutedText }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Featured Carousel */}
          {featuredPosts.length > 0 && (
            <section ref={featuredRef} style={{ padding: '80px 32px', background: bgColor }}>
              <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Zap size={20} color="#10b981" />
                  </div>
                  <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>精选文章</h2>
                </motion.div>

                <div style={{ position: 'relative' }}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{ 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      background: cardBg,
                      border: `1px solid ${borderColor}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => openPost(featuredPosts[currentSlide])}
                  >
                    <div style={{ height: '400px', position: 'relative' }}>
                      <motion.img
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={featuredPosts[currentSlide].coverImage || 'https://via.placeholder.com/800x400?text=No+Image'}
                        alt={featuredPosts[currentSlide].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' 
                      }} />
                      
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          {featuredPosts[currentSlide].tags.map((tag) => (
                            <span key={tag} style={{ 
                              padding: '4px 12px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              background: '#10b981',
                              color: 'white'
                            }}>{tag}</span>
                          ))}
                          <span style={{ 
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }}>精选</span>
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                          {featuredPosts[currentSlide].title}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                          {featuredPosts[currentSlide].excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {featuredPosts[currentSlide].readTime} 分钟
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={14} />
                            {featuredPosts[currentSlide].views}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Heart size={14} />
                            {featuredPosts[currentSlide].likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Carousel Controls */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length); }}
                    style={{ 
                      position: 'absolute', 
                      left: '16px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    ←
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % featuredPosts.length); }}
                    style={{ 
                      position: 'absolute', 
                      right: '16px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    →
                  </button>

                  {/* Dots */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: currentSlide === index ? '#10b981' : 'rgba(255,255,255,0.3)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All Posts */}
          <section ref={postsRef} style={{ padding: '80px 32px', background: bgColor }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={20} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>全部文章</h2>
              </motion.div>

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

              {loading ? (
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '4px solid rgba(16, 185, 129, 0.2)',
                      borderTop: '4px solid #10b981',
                      borderRadius: '50%',
                      margin: '0 auto'
                    }}
                  />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>没有找到匹配的文章</p>
                  {(searchQuery || selectedTags.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTags([]);
                        setSortBy('newest');
                      }}
                      className="mt-4 text-emerald-400 hover:text-emerald-300"
                    >
                      清除筛选条件
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '24px' 
                }}>
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ArticleCard post={post} onClick={() => openPost(post)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* About */}
          <section ref={aboutRef} style={{ padding: '80px 32px', background: bgColor }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={20} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>关于我</h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">自我介绍</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      你好！我是一名热爱技术的全栈开发者，拥有5年以上的开发经验。我专注于构建高性能、可扩展的Web应用程序，
                      并且对新技术充满热情。在这个博客里，我会分享我在前端、后端、DevOps等领域的学习心得和实践经验。
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      我相信技术的力量可以改变世界，也希望通过我的文章能够帮助到正在学习编程的你。
                      无论你是初学者还是资深开发者，都欢迎与我交流讨论。
                    </p>
                    <div className="flex gap-4">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Mail className="w-4 h-4 mr-2" />
                        联系我
                      </Button>
                      <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Skills & Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Skills */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      专业技能
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'React / Vue', level: '95%' },
                        { name: 'TypeScript', level: '90%' },
                        { name: 'Node.js', level: '85%' },
                        { name: 'PostgreSQL', level: '80%' },
                        { name: 'Docker / K8s', level: '75%' },
                        { name: 'AWS / Cloud', level: '70%' },
                      ].map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{skill.name}</span>
                            <span className="text-emerald-400">{skill.level}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{ width: skill.level }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      工作经历
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: '高级前端工程师', company: '某互联网大厂', period: '2021 - 至今' },
                        { title: '全栈开发工程师', company: '创业公司', period: '2019 - 2021' },
                        { title: '前端开发工程师', company: '科技公司', period: '2018 - 2019' },
                      ].map((exp, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                          <div>
                            <div className="text-white font-medium">{exp.title}</div>
                            <div className="text-gray-500 text-sm">{exp.company} · {exp.period}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-400" />
                      教育背景
                    </h3>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                      <div>
                        <div className="text-white font-medium">计算机科学与技术</div>
                        <div className="text-gray-500 text-sm">某重点大学 · 2014 - 2018</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
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
