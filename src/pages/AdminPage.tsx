import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Heart, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUp,
  Save,
  Tag,
  BarChart3,
  Lock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { StaggerContainer, StaggerItem, HoverCard } from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';

// Admin credentials - in production, this should be handled server-side
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'dongzhongcenis06';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  updatedAt?: string;
  readTime: number;
  likes: number;
  views: number;
}

interface Comment {
  id: string;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  recentViews: number;
  popularPost: Post | null;
}

// Navigation items
const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'posts', label: '文章管理', icon: FileText },
  { id: 'comments', label: '评论管理', icon: MessageSquare },
  { id: 'stats', label: '数据统计', icon: BarChart3 },
];

// Animated number counter
function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// Dashboard Component
function Dashboard({ stats, recentPosts }: { stats: DashboardStats; recentPosts: Post[] }) {
  const statCards = [
    { label: '总文章数', value: stats.totalPosts, icon: FileText, color: 'from-emerald-500 to-teal-600', trend: '+12%' },
    { label: '总浏览量', value: stats.totalViews, icon: Eye, color: 'from-blue-500 to-indigo-600', trend: '+28%' },
    { label: '总点赞数', value: stats.totalLikes, icon: Heart, color: 'from-pink-500 to-rose-600', trend: '+15%' },
    { label: '总评论数', value: stats.totalComments, icon: MessageSquare, color: 'from-amber-500 to-orange-600', trend: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StaggerItem key={card.label}>
            <HoverCard>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-20 rounded-full -translate-y-1/2 translate-x-1/2`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">{card.label}</CardTitle>
                    <card.icon className="w-5 h-5 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedNumber value={card.value} />
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      {card.trend}
                    </span>
                    <span className="text-gray-500 ml-2">较上月</span>
                  </div>
                </CardContent>
              </Card>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                最近文章
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                查看全部 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.slice(0, 5).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{post.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {post.likes}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Post */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              热门文章
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.popularPost ? (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={stats.popularPost.coverImage || 'https://via.placeholder.com/400x225'} 
                    alt={stats.popularPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{stats.popularPost.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{stats.popularPost.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Eye className="w-4 h-4" /> {stats.popularPost.views}
                    </span>
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-4 h-4" /> {stats.popularPost.likes}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    热门
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// Posts Management Component
function PostsManagement({ posts, onRefresh }: { posts: Post[]; onRefresh: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    readTime: 5,
  });

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        resetForm();
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${selectedPost.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      
      if (response.ok) {
        setIsEditDialogOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update post:', error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${selectedPost.slug}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsDeleteDialogOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || '',
      tags: post.tags.join(', '),
      readTime: post.readTime,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      readTime: 5,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        <Button onClick={openCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          新建文章
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={post.coverImage || 'https://via.placeholder.com/96x64'} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 truncate">{post.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {post.likes}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          onClick={() => openEditDialog(post)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => openDeleteDialog(post)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? '新建文章' : '编辑文章'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">标题</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="文章标题"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="article-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">封面图片 URL</label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">标签（用逗号分隔）</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="React, TypeScript, Web"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">摘要</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="文章摘要..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">内容（支持 Markdown）</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="文章内容..."
                rows={15}
                className="bg-gray-800 border-gray-700 text-white font-mono resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">阅读时间（分钟）</label>
              <Input
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                className="bg-gray-800 border-gray-700 text-white w-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              取消
            </Button>
            <Button
              onClick={isCreateDialogOpen ? handleCreate : handleUpdate}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  保存中...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription className="text-gray-400">
              确定要删除文章 &quot;{selectedPost?.title}&quot; 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              取消
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? '删除中...' : '删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// Comments Management Component
function CommentsManagement({ comments, posts, onRefresh }: { comments: Comment[]; posts: Post[]; onRefresh: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPostTitle = (postId: number) => {
    const post = posts.find(p => p.id === String(postId));
    return post?.title || '未知文章';
  };

  const handleDelete = async () => {
    if (!selectedComment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${selectedComment.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsDeleteDialogOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="搜索评论..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            <AnimatePresence>
              {filteredComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium text-sm">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{comment.author}</span>
                        <span className="text-gray-500 text-sm">
                          评论于《{getPostTitle(comment.postId)}》
                        </span>
                        <span className="text-gray-600 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-300 pl-10">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-pink-400">
                        <Heart className="w-4 h-4" /> {comment.likes}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => {
                          setSelectedComment(comment);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription className="text-gray-400">
              确定要删除这条评论吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              取消
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="bg-red-600 hover:bg-red-700">
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Stats Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StatsView({ posts, comments }: { posts: Post[]; comments: Comment[] }) {
  // Calculate monthly stats
  const monthlyStats = posts.reduce((acc, post) => {
    const month = new Date(post.publishedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
    if (!acc[month]) {
      acc[month] = { posts: 0, views: 0, likes: 0 };
    }
    acc[month].posts++;
    acc[month].views += post.views;
    acc[month].likes += post.likes;
    return acc;
  }, {} as Record<string, { posts: number; views: number; likes: number }>);

  const monthlyData = Object.entries(monthlyStats).slice(-6);

  // Tag stats
  const tagStats = posts.flatMap(p => p.tags).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              月度趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map(([month, stats]) => (
                <div key={month} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-400">{month}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${Math.min(stats.views / 100, 100)}%` }} />
                      <span className="text-xs text-gray-500">{stats.views} 浏览</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-pink-500 rounded-full" style={{ width: `${Math.min(stats.likes * 10, 100)}%` }} />
                      <span className="text-xs text-gray-500">{stats.likes} 点赞</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              热门标签
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {sortedTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800">
                  <span className="text-white">{tag}</span>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// Login Component
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple client-side authentication
    // In production, this should be handled server-side
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', 'true');
        onLogin();
      } else {
        setError('用户名或密码错误');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">管理后台登录</CardTitle>
            <p className="text-gray-500 mt-2">请输入管理员账号和密码</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                  />
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  '登录'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          默认账号: admin / 密码请联系管理员
        </p>
      </motion.div>
    </div>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    recentViews: 0,
    popularPost: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch posts
      const postsRes = await fetch(`${API_BASE_URL}/posts`);
      const postsData = await postsRes.json();
      const fetchedPosts = postsData.posts || [];
      setPosts(fetchedPosts);

      // Fetch all comments (need to fetch per post)
      const allComments: Comment[] = [];
      for (const post of fetchedPosts.slice(0, 10)) {
        try {
          const commentsRes = await fetch(`${API_BASE_URL}/comments?postId=${post.id}`);
          const commentsData = await commentsRes.json();
          allComments.push(...(commentsData.comments || []));
        } catch (e) {
          console.error(`Failed to fetch comments for post ${post.id}`);
        }
      }
      setComments(allComments);

      // Calculate stats
      const totalViews = fetchedPosts.reduce((sum: number, p: Post) => sum + p.views, 0);
      const totalLikes = fetchedPosts.reduce((sum: number, p: Post) => sum + p.likes, 0);
      const popularPost = fetchedPosts.reduce((max: Post | null, p: Post) => 
        !max || p.views > max.views ? p : max, null
      );

      setStats({
        totalPosts: fetchedPosts.length,
        totalViews,
        totalLikes,
        totalComments: allComments.length,
        recentViews: Math.floor(totalViews * 0.1),
        popularPost,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleGoToBlog = () => {
    navigate('/');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} recentPosts={posts.slice(0, 5)} />;
      case 'posts':
        return <PostsManagement posts={posts} onRefresh={fetchData} />;
      case 'comments':
        return <CommentsManagement comments={comments} posts={posts} onRefresh={fetchData} />;
      case 'stats':
        return <StatsView posts={posts} comments={comments} />;
      default:
        return <Dashboard stats={stats} recentPosts={posts.slice(0, 5)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-900 border-r border-gray-800 flex-shrink-0"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold">管理后台</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            ))}
          </nav>

          <Separator className="my-4 bg-gray-800" />

          {/* Go to Blog */}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleGoToBlog}
          >
            <FileText className="w-5 h-5" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 overflow-hidden whitespace-nowrap"
                >
                  返回博客
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-2"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 overflow-hidden whitespace-nowrap"
                >
                  退出登录
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
