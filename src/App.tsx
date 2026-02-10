import { useState, useRef, useEffect } from 'react';
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
  X,
  Send,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import './App.css';

// Types
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  likes: number;
  views: number;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

// Mock posts data with full content
const posts: Post[] = [
  {
    id: '1',
    title: '深入理解 React Hooks 原理',
    slug: 'react-hooks-deep-dive',
    excerpt: '探索 React Hooks 的内部工作原理，了解 useState 和 useEffect 是如何实现的。',
    content: `# 深入理解 React Hooks 原理

React Hooks 是 React 16.8 引入的革命性特性，它让我们在函数组件中使用状态和其他 React 特性。

## useState 原理

useState 是基于闭包和链表实现的。每个组件都有一个对应的 Fiber 节点，Hooks 以链表的形式存储在 Fiber 节点的 memoizedState 属性中。

\`\`\`javascript
function useState(initialState) {
  const hook = getCurrentHook();
  if (!hook.memoizedState) {
    hook.memoizedState = initialState;
  }
  const setState = (newState) => {
    hook.memoizedState = newState;
    scheduleUpdate();
  };
  return [hook.memoizedState, setState];
}
\`\`\`

## useEffect 原理

useEffect 会在组件渲染完成后异步执行。React 会维护一个 effect 链表，在 commit 阶段遍历执行。

## 最佳实践

1. 只在最顶层使用 Hooks
2. 只在 React 函数中调用 Hooks
3. 使用 ESLint 插件检查依赖项`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    tags: ['React', 'JavaScript'],
    publishedAt: '2024-01-15',
    readTime: 8,
    likes: 42,
    views: 1280,
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    excerpt: '掌握 TypeScript 的高级类型系统，包括条件类型、映射类型等。',
    content: `# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，让我们来看看一些高级用法。

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## 模板字面量类型

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
// onClick, onHover, etc.
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    tags: ['TypeScript'],
    publishedAt: '2024-01-10',
    readTime: 12,
    likes: 38,
    views: 956,
  },
  {
    id: '3',
    title: 'Next.js 14 新特性详解',
    slug: 'nextjs-14-features',
    excerpt: '深入了解 Next.js 14 带来的 Server Actions、Partial Prerendering 等新特性。',
    content: `# Next.js 14 新特性详解

Next.js 14 带来了许多令人兴奋的新特性。

## Server Actions

现在可以直接在组件中调用服务器端函数：

\`\`\`javascript
async function createPost(formData) {
  'use server';
  await db.posts.create({...});
}
\`\`\`

## Partial Prerendering

结合了静态生成和动态渲染的优点。`,
    coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
    tags: ['Next.js', 'React'],
    publishedAt: '2024-01-05',
    readTime: 10,
    likes: 56,
    views: 1543,
  },
  {
    id: '4',
    title: 'Node.js 性能优化实践',
    slug: 'nodejs-performance',
    excerpt: '从实际项目出发，分享 Node.js 应用性能优化的最佳实践。',
    content: `# Node.js 性能优化实践

性能优化是后端开发的重要课题。

## 1. 使用 Cluster 模块

利用多核 CPU：

\`\`\`javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}
\`\`\`

## 2. 数据库优化
- 使用连接池
- 添加索引
- 查询优化`,
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    tags: ['Node.js'],
    publishedAt: '2023-12-28',
    readTime: 15,
    likes: 67,
    views: 2100,
  },
  {
    id: '5',
    title: 'Docker 容器化部署指南',
    slug: 'docker-deployment',
    excerpt: '学习如何使用 Docker 容器化你的应用，实现一致的开发环境。',
    content: `# Docker 容器化部署指南

Docker 已经成为现代应用部署的标准工具。

## Dockerfile 示例

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    tags: ['Docker', 'DevOps'],
    publishedAt: '2023-12-20',
    readTime: 10,
    likes: 45,
    views: 1120,
  },
  {
    id: '6',
    title: 'PostgreSQL 查询优化技巧',
    slug: 'postgresql-optimization',
    excerpt: '掌握 PostgreSQL 查询优化的核心技巧，提升数据库性能。',
    content: `# PostgreSQL 查询优化技巧

## 使用 EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

## 索引优化

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
\`\`\`

## 查询重写

避免 SELECT *，只查询需要的字段。`,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    tags: ['PostgreSQL'],
    publishedAt: '2023-12-15',
    readTime: 14,
    likes: 52,
    views: 1380,
  },
];

// Mock comments
const initialComments: Record<string, Comment[]> = {
  '1': [
    { id: 'c1', author: '张三', content: '写得太好了，终于理解了 Hooks 的原理！', createdAt: '2024-01-15', likes: 12 },
    { id: 'c2', author: '李四', content: '期待更多 React 相关的文章', createdAt: '2024-01-16', likes: 8 },
  ],
  '2': [
    { id: 'c3', author: '王五', content: 'TypeScript 的类型系统真的很强大', createdAt: '2024-01-11', likes: 5 },
  ],
};

// Article Card Component
function ArticleCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <div 
      className="article-card"
      onClick={onClick}
    >
      <div className="card-image">
        <img src={post.coverImage} alt={post.title} />
      </div>
      <div className="card-content">
        <div className="card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">
          <span><Clock size={14} /> {post.readTime}min</span>
          <span><Eye size={14} /> {post.views}</span>
          <span><Heart size={14} /> {post.likes}</span>
        </div>
      </div>
    </div>
  );
}

// Post Modal Component
function PostModal({ post, isOpen, onClose }: { post: Post | null; isOpen: boolean; onClose: () => void }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (post) {
      setComments(initialComments[post.id] || []);
      // Check if liked/bookmarked
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setLiked(likedPosts.includes(post.id));
      setBookmarked(bookmarkedPosts.includes(post.id));
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (liked) {
      const updated = likedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(updated));
    } else {
      likedPosts.push(post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    if (bookmarked) {
      const updated = bookmarkedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updated));
    } else {
      bookmarkedPosts.push(post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
    }
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: authorName,
      content: newComment,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    setAuthorName('');
    setShowCommentForm(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <img src={post.coverImage} alt={post.title} />
          <div className="modal-header-overlay">
            <div className="modal-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <h2>{post.title}</h2>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-actions">
            <button onClick={handleLike} className={liked ? 'liked' : ''}>
              <Heart size={18} className={liked ? 'filled' : ''} />
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button onClick={handleBookmark} className={bookmarked ? 'bookmarked' : ''}>
              <Bookmark size={18} className={bookmarked ? 'filled' : ''} />
            </button>
            <button onClick={handleShare}>
              <Share2 size={18} />
            </button>
          </div>

          <div className="modal-meta">
            <span>📅 {post.publishedAt}</span>
            <span>⏱️ {post.readTime} 分钟阅读</span>
            <span>👁️ {post.views} 阅读</span>
          </div>

          <div className="modal-article">
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={i}>{paragraph.replace('# ', '')}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
              } else if (paragraph.startsWith('```')) {
                return null;
              } else if (paragraph.startsWith('- ')) {
                return <li key={i}>{paragraph.replace('- ', '')}</li>;
              } else if (paragraph.trim()) {
                return <p key={i}>{paragraph}</p>;
              }
              return null;
            })}
          </div>

          <div className="comments-section">
            <h3><MessageCircle size={20} /> 评论 ({comments.length})</h3>
            
            {!showCommentForm ? (
              <button 
                className="btn-comment"
                onClick={() => setShowCommentForm(true)}
              >
                <MessageCircle size={16} /> 写评论
              </button>
            ) : (
              <form onSubmit={handleSubmitComment} className="comment-form">
                <input
                  type="text"
                  placeholder="你的名字"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={20}
                />
                <textarea
                  placeholder="写下你的评论..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <div className="comment-form-actions">
                  <span>{newComment.length}/500</span>
                  <div>
                    <button type="button" onClick={() => setShowCommentForm(false)}>取消</button>
                    <button type="submit" disabled={!newComment.trim() || !authorName.trim()}>
                      <Send size={14} /> 发表
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{comment.createdAt}</span>
                    </div>
                    <p>{comment.content}</p>
                    <button onClick={() => handleLikeComment(comment.id)}>
                      <Heart size={14} /> {comment.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const homeRef = useRef<HTMLDivElement>(null!);
  const featuredRef = useRef<HTMLDivElement>(null!);
  const postsRef = useRef<HTMLDivElement>(null!);
  const aboutRef = useRef<HTMLDivElement>(null!);

  const toggleTheme = () => setIsDark(!isDark);
  const featuredPosts = posts.slice(0, 3);

  // Auto slide
  useEffect(() => {
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
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
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

  const openPost = (post: Post) => {
    setSelectedPost(post);
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
  const sidebarBg = isDark ? 'linear-gradient(180deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' : '#f8fafc';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '320px', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        background: sidebarBg,
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

          {/* Profile */}
          <div style={{ 
            padding: '20px', 
            borderRadius: '16px', 
            background: cardBg,
            border: `1px solid ${borderColor}`,
            marginBottom: '24px',
            textAlign: 'center'
          }}>
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
              {[{ value: '50+', label: '文章' }, { value: '12K+', label: '阅读' }, { value: '2K+', label: '点赞' }].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: mutedText }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ marginBottom: '24px' }}>
            {[
              { id: 'home', label: '首页', icon: Sparkles },
              { id: 'featured', label: '精选', icon: Zap },
              { id: 'posts', label: '文章', icon: TrendingUp },
              { id: 'about', label: '关于', icon: Code2 },
            ].map((item) => (
              <button
                key={item.id}
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
              </button>
            ))}
          </nav>

          {/* Tech Stack */}
          <div style={{ 
            padding: '16px', 
            borderRadius: '12px', 
            background: cardBg,
            border: `1px solid ${borderColor}`,
            marginBottom: '24px'
          }}>
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
          </div>

          {/* Social */}
          <div style={{ 
            padding: '16px', 
            borderRadius: '12px', 
            background: cardBg,
            border: `1px solid ${borderColor}`,
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>关注我</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { icon: Github, url: 'https://github.com' },
                { icon: Twitter, url: 'https://twitter.com' },
                { icon: Linkedin, url: 'https://linkedin.com' },
                { icon: Mail, url: 'mailto:blog@example.com' },
              ].map(({ icon: Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <Icon size={18} color={mutedText} />
                </a>
              ))}
            </div>
          </div>

          {/* Time */}
          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '24px', fontFamily: 'monospace', color: '#34d399', fontWeight: 'bold' }}>
              {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '12px', color: mutedText, marginTop: '4px' }}>
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
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
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px',
              borderRadius: '9999px',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              marginBottom: '32px'
            }}>
              <Sparkles size={16} color="#10b981" />
              <span style={{ fontSize: '14px', color: mutedText }}>欢迎来到我的技术博客</span>
            </div>

            <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '24px' }}>
              <span>探索</span>
              <span style={{ 
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 8px'
              }}>技术</span>
              <span>的无限可能</span>
            </h1>

            <p style={{ fontSize: '20px', color: mutedText, marginBottom: '40px', lineHeight: 1.6 }}>
              分享前端开发、后端架构、DevOps 实践等技术笔记
              <br />
              与志同道合的开发者一起成长
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
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
              </button>
              <button 
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
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '64px' }}>
              {[{ value: '50+', label: '技术文章' }, { value: '12K+', label: '总阅读' }, { value: '2K+', label: '获赞' }].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '30px', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: mutedText }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Carousel */}
        <section ref={featuredRef} style={{ padding: '80px 32px', background: bgColor }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
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
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                background: cardBg,
                border: `1px solid ${borderColor}`,
                cursor: 'pointer'
              }}
              onClick={() => openPost(featuredPosts[currentSlide])}
              >
                <div style={{ height: '400px', position: 'relative' }}>
                  <img
                    src={featuredPosts[currentSlide].coverImage}
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
              </div>

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
                <ChevronLeft size={24} />
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
                <ChevronRight size={24} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                {featuredPosts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      background: i === currentSlide ? '#10b981' : 'rgba(255,255,255,0.3)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section ref={postsRef} style={{ padding: '80px 32px', background: bgColor }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
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
              <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>最新文章</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} onClick={() => openPost(post)} />
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section ref={aboutRef} style={{ padding: '80px 32px', background: bgColor }}>
          <div style={{ maxWidth: '896px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Code2 size={20} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>关于我</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              <div style={{ 
                padding: '32px', 
                borderRadius: '24px',
                background: cardBg,
                border: `1px solid ${borderColor}`
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" 
                  alt="Profile"
                  style={{ width: '100%', borderRadius: '16px' }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>热爱技术的全栈开发者</h3>
                <p style={{ color: mutedText, marginBottom: '24px', lineHeight: 1.6 }}>
                  你好！我是一名专注于 Web 开发的全栈工程师，热爱探索新技术，
                  喜欢分享学习心得和实践经验。
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: mutedText, marginBottom: '12px' }}>技术栈</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                      <span key={skill} style={{ 
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { icon: Github, url: 'https://github.com' },
                    { icon: Twitter, url: 'https://twitter.com' },
                    { icon: Linkedin, url: 'https://linkedin.com' },
                    { icon: Mail, url: 'mailto:blog@example.com' },
                  ].map(({ icon: Icon, url }, i) => (
                    <a 
                      key={i} 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '12px',
                        background: cardBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${borderColor}`
                      }}
                    >
                      <Icon size={20} color={mutedText} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '32px', borderTop: `1px solid ${borderColor}`, background: bgColor }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Code2 size={16} color="white" />
              </div>
              <span style={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>DevBlog</span>
            </div>
            <p style={{ fontSize: '14px', color: mutedText }}>© 2024 DevBlog. Made with ❤️</p>
          </div>
        </footer>
      </main>

      {/* Modal */}
      <PostModal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
