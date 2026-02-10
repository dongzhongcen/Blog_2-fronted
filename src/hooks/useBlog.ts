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
      // Add cache-busting parameter to prevent caching
      const response = await fetch(`${API_BASE_URL}/posts?_t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
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
      setPost(data.post);
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
      setComments(data.comments);
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
        body: JSON.stringify({ postId: parseInt(postId), content, author }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const data = await response.json();
      setComments((prev) => [data.comment, ...prev]);
      return true;
    } catch (err) {
      console.error('Failed to add comment', err);
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

  useEffect(() => {
    // Check if user has liked this post
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setLiked(likedPosts.includes(postId));
    setLikeCount(initialLikes);
  }, [postId, initialLikes]);

  const likePost = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: parseInt(postId) }),
      });
      if (!response.ok) throw new Error('Failed to like post');
      
      const data = await response.json();
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      
      if (data.liked) {
        // Liked
        if (!likedPosts.includes(postId)) {
          likedPosts.push(postId);
        }
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // Unliked
        const updated = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('likedPosts', JSON.stringify(updated));
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      }
      return true;
    } catch (err) {
      console.error('Failed to like post', err);
      return false;
    }
  }, [postId, liked]);

  return { liked, likeCount, likePost };
}
