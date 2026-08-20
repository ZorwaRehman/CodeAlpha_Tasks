import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { useSocial } from '../context/SocialContext';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  Send,
  Pin,
  ExternalLink,
  CornerDownRight,
  Smile,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    toggleLikePost,
    toggleBookmarkPost,
    deletePost,
    votePoll,
    addComment,
    toggleLikeComment,
    deleteComment,
    setViewingUserId,
    setActiveTab,
    setSelectedTag,
    showToast,
  } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isSaved = currentUser ? (currentUser.savedPosts || []).includes(post.id) : false;
  const isAuthor = currentUser ? currentUser.id === post.userId : false;

  // Relative time formatter
  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleUserClick = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('explore');
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    const created = await addComment(post.id, newCommentText.trim());
    if (created) {
      setCommentsList(prev => [...prev, created]);
      setNewCommentText('');
    }
    setIsSubmittingComment(false);
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    const created = await addComment(post.id, replyText.trim(), parentId);
    if (created) {
      setCommentsList(prev => [...prev, created]);
      setReplyText('');
      setReplyingToId(null);
    }
    setIsSubmittingComment(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Post link copied to clipboard!');
    setShowMenu(false);
  };

  // Render text with clickable #hashtags
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#') && part.length > 1) {
        const cleanTag = part.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').slice(1);
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              handleTagClick(cleanTag);
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article
      id={`post-${post.id}`}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm mb-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      {/* Pinned status */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3 ml-2">
          <Pin className="w-3.5 h-3.5 fill-current rotate-45" />
          <span>Pinned Post</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            referrerPolicy="no-referrer"
            onClick={() => handleUserClick(post.userId)}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 cursor-pointer hover:opacity-90 transition-opacity"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span
                onClick={() => handleUserClick(post.userId)}
                className="font-bold text-zinc-900 dark:text-zinc-100 text-base cursor-pointer hover:underline"
              >
                {post.user.name}
              </span>
              {post.user.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500 text-white flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                onClick={() => handleUserClick(post.userId)}
                className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                @{post.user.username}
              </span>
              <span>·</span>
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            id={`btn-post-menu-${post.id}`}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              id={`menu-dropdown-${post.id}`}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <Share2 className="w-4 h-4" /> Copy Post Link
              </button>
              <button
                onClick={() => {
                  toggleBookmarkPost(post.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <Bookmark className="w-4 h-4" /> {isSaved ? 'Remove from Saved' : 'Save Post'}
              </button>
              {isAuthor && (
                <button
                  id={`btn-delete-post-${post.id}`}
                  onClick={() => {
                    deletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      <div className="mt-3.5 text-zinc-800 dark:text-zinc-200 text-[15px] leading-relaxed whitespace-pre-line">
        {renderFormattedContent(post.content)}
      </div>

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[420px] bg-zinc-950">
          <img
            src={post.mediaUrl}
            alt="Post media"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
            onError={() => {}}
          />
        </div>
      )}

      {/* Poll Component */}
      {post.poll && (
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
            {post.poll.question}
          </p>
          <div className="space-y-2">
            {post.poll.options.map(option => {
              const totalVotes = post.poll?.totalVotes || 0;
              const voteCount = option.votes.length;
              const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              const hasVotedThis = currentUser ? option.votes.includes(currentUser.id) : false;

              return (
                <button
                  key={option.id}
                  id={`btn-vote-${option.id}`}
                  onClick={() => votePoll(post.id, option.id)}
                  className={`relative w-full overflow-hidden text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                    hasVotedThis
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-100 dark:bg-indigo-900/30 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {hasVotedThis && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      {option.text}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {percent}% ({voteCount})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 text-right">
            {post.poll.totalVotes} total votes
          </div>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-zinc-500">
        {/* Comment Button */}
        <button
          id={`btn-toggle-comments-${post.id}`}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-medium group"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{post.commentCount || 0}</span>
        </button>

        {/* Like Button */}
        <button
          id={`btn-like-post-${post.id}`}
          onClick={() => toggleLikePost(post.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors text-xs font-medium group ${
            isLiked
              ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-rose-500'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform group-hover:scale-125 ${
              isLiked ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
          <span className={isLiked ? 'font-bold' : ''}>{post.likes.length}</span>
        </button>

        {/* Repost Button */}
        <button
          id={`btn-repost-${post.id}`}
          onClick={() => showToast('🔁 Post shared to your network!')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-500 transition-colors text-xs font-medium group"
        >
          <Repeat2 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>{(post.reposts || []).length}</span>
        </button>

        {/* Bookmark Button */}
        <button
          id={`btn-bookmark-${post.id}`}
          onClick={() => toggleBookmarkPost(post.id)}
          className={`p-2 rounded-xl transition-colors ${
            isSaved
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600'
          }`}
          title={isSaved ? 'Saved' : 'Save post'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
        </button>
      </div>

      {/* Comments Drawer / Thread */}
      {showComments && (
        <div
          id={`comments-drawer-${post.id}`}
          className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 animate-in fade-in duration-200"
        >
          {/* Add Comment Input */}
          {currentUser && (
            <form onSubmit={handleAddComment} className="flex gap-3 mb-5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  id={`input-comment-${post.id}`}
                  type="text"
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim() || isSubmittingComment}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3.5">
            {commentsList.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-3">
                No comments yet. Be the first to start the conversation!
              </p>
            ) : (
              commentsList.map(c => {
                const isCommentLiked = currentUser ? c.likes.includes(currentUser.id) : false;
                const isCommentAuthor = currentUser ? currentUser.id === c.userId : false;

                return (
                  <div key={c.id} className="flex gap-3 text-xs">
                    <img
                      src={c.user.avatar}
                      alt={c.user.name}
                      referrerPolicy="no-referrer"
                      onClick={() => handleUserClick(c.userId)}
                      className="w-7 h-7 rounded-full object-cover cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            onClick={() => handleUserClick(c.userId)}
                            className="font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:underline"
                          >
                            {c.user.name}
                          </span>
                          <span className="text-[10px] text-zinc-400">· {formatTime(c.createdAt)}</span>
                        </div>
                        {isCommentAuthor && (
                          <button
                            onClick={async () => {
                              const ok = await deleteComment(c.id);
                              if (ok) setCommentsList(prev => prev.filter(x => x.id !== c.id));
                            }}
                            className="text-zinc-400 hover:text-rose-500 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-normal">{c.content}</p>

                      {/* Comment interactions */}
                      <div className="flex items-center gap-4 mt-2 pt-1.5 text-[11px] text-zinc-500">
                        <button
                          onClick={() => toggleLikeComment(c.id)}
                          className={`flex items-center gap-1 hover:text-rose-500 ${
                            isCommentLiked ? 'text-rose-500 font-bold' : ''
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${isCommentLiked ? 'fill-rose-500' : ''}`} />
                          <span>{c.likes.length}</span>
                        </button>
                        <button
                          onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                          className="flex items-center gap-1 hover:text-indigo-600"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>

                      {/* Nested Reply Box */}
                      {replyingToId === c.id && currentUser && (
                        <div className="mt-2.5 flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
                          <input
                            type="text"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder={`Reply to @${c.user.username}...`}
                            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-[11px] text-zinc-900 dark:text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(c.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </article>
  );
};
