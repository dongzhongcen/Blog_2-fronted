import { useState, useEffect, useCallback } from 'react';
import type { BlogPost, Comment } from '@/types';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      // 修复：添加错误处理和缓存控制
      const response = await fetch(`${API_BASE_URL}/posts?_t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      const data = await response.json();
      
      // 修复：确保数据格式正确
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid posts data format');
      }
      
      // 修复：数据验证和类型转换
      const validatedPosts = data.posts.map((post: any) => ({
        ...post,
        id: String(post.id),
        likes: Number(post.likes) || 0,
        views: Number(post.views) || 0,
        readTime: Number(post.readTime) || 5,
        tags: Array.isArray(post.tags) ? post.tags : [],
        publishedAt: post.publishedAt || new Date().toISOString()
      }));
      
      setPosts(validatedPosts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Refresh function to be called after mutations
  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refresh };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
      if (!response.ok) throw new Error('Post not found');
      const data = await response.json();
      
      // 修复：数据验证和类型转换
      if (!data.post) {
        throw new Error('Invalid post data format');
      }
      
      const validatedPost = {
        ...data.post,
        id: String(data.post.id),
        likes: Number(data.post.likes) || 0,
        views: Number(data.post.views) || 0,
        readTime: Number(data.post.readTime) || 5,
        tags: Array.isArray(data.post.tags) ? data.post.tags : [],
        publishedAt: data.post.publishedAt || new Date().toISOString()
      };
      
      setPost(validatedPost);
      setError(null);
    } catch (err) {
      setError('Failed to fetch post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const refresh = useCallback(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refresh };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      
      // 修复：确保评论数据格式正确
      if (!data.comments || !Array.isArray(data.comments)) {
        throw new Error('Invalid comments data format');
      }
      
      // 修复：数据验证和类型转换
      const validatedComments = data.comments.map((comment: any) => ({
        ...comment,
        id: String(comment.id),
        postId: String(comment.postId),
        likes: Number(comment.likes) || 0
      }));
      
      setComments(validatedComments);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(async (content: string, author: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: parseInt(postId), 
          content, 
          author 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add comment: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 修复：确保新评论数据格式正确
      if (!data.comment) {
        throw new Error('Invalid comment response');
      }
      
      const newComment = {
        ...data.comment,
        id: String(data.comment.id),
        postId: String(data.comment.postId),
        likes: Number(data.comment.likes) || 0
      };
      
      setComments((prev) => [newComment, ...prev]);
      return true;
    } catch (err) {
      console.error('Failed to add comment', err);
      alert('评论发表失败：' + (err instanceof Error ? err.message : '请重试'));
      return false;
    }
  }, [postId]);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment', id: parseInt(commentId) }),
      });
      if (!response.ok) throw new Error('Failed to like comment');
      const data = await response.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: data.liked ? c.likes + 1 : Math.max(0, c.likes - 1) } : c
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to like comment', err);
      return false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, addComment, likeComment, refresh };
}

export function useLikePost(postId: string, initialLikes: number = 0) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  // 从服务器获取点赞状态和总点赞数
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!postId) return;
      setLoading(true);
      try {
        // 获取服务器点赞状态（基于 IP）
        const response = await fetch(`${API_BASE_URL}/likes/check?type=post&id=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
        // 使用传入的初始点赞数
        setLikeCount(initialLikes);
      } catch (err) {
        console.error('Failed to check like status:', err);
        // 如果服务器检查失败，使用本地存储作为备用
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        setLiked(likedPosts.includes(postId));
      } finally {
        setLoading(false);
      }
    };

    checkLikeStatus();
  }, [postId, initialLikes]);

  const likePost = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: parseInt(postId) }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to like post');
      }
      
      const data = await response.json();
      
      // 更新本地状态
      if (data.liked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
        // 同步到 localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (!likedPosts.includes(postId)) {
          likedPosts.push(postId);
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }
      } else {
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
        // 同步到 localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        const updated = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('likedPosts', JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.error('Failed to like post', err);
      alert('点赞失败，请重试');
      return false;
    }
  }, [postId]);

  return { liked, likeCount, likePost, loading };
}