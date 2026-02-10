import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useComments } from '@/hooks/useBlog';
import { 
  MessageCircle, 
  Heart, 
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, loading, addComment, likeComment } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    const success = await addComment(newComment.trim(), authorName.trim());
    if (success) {
      setNewComment('');
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">
          评论 ({comments.length})
        </h3>
      </div>

      {/* Comment List */}
      <div className="space-y-4 mb-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            加载评论中...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无评论，来发表第一条评论吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {comment.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-2">
                  {comment.content}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeComment(comment.id)}
                  className="h-8 px-2 text-xs text-gray-500 hover:text-emerald-400"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  {comment.likes}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      {!showForm ? (
        <Button
          variant="outline"
          className="w-full border-dashed border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
          onClick={() => setShowForm(true)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          写评论
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="你的名字"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              maxLength={20}
            />
          </div>
          <div>
            <Textarea
              placeholder="写下你的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {newComment.length}/500
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1 border-white/20"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!newComment.trim() || !authorName.trim() || isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                '提交中...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  发表
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
