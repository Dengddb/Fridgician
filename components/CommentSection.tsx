import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h5 className="font-semibold text-gray-700 mb-3">留言區</h5>
      <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">{comment.author}</p>
                <p className="text-xs text-gray-400">{formatTimestamp(comment.timestamp)}</p>
              </div>
              <p className="text-gray-600 mt-1">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">還沒有留言，快來搶頭香！</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="新增留言..."
          className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-orange-600 disabled:bg-gray-300 transition-colors"
          disabled={!newComment.trim()}
        >
          送出
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
