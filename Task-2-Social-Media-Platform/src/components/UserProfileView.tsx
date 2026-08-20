import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  Edit3,
  UserPlus,
  UserCheck,
  Image as ImageIcon,
  Heart,
  Bookmark,
  MessageSquare,
  Users,
  ArrowLeft,
} from 'lucide-react';

interface UserProfileViewProps {
  userId?: string | null;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ userId }) => {
  const {
    currentUser,
    allUsers,
    toggleFollowUser,
    setActiveTab,
    setViewingUserId,
    switchUser,
  } = useSocial();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'media' | 'likes' | 'saved'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const targetId = userId || currentUser?.id;
  const isOwnProfile = currentUser && targetId === currentUser.id;

  // Fetch target user profile
  useEffect(() => {
    if (!targetId) return;
    const fetchTarget = async () => {
      try {
        const res = await fetch(`/api/users/${targetId}`);
        if (res.ok) {
          const u: User = await res.json();
          setProfileUser(u);
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    fetchTarget();
  }, [targetId, currentUser?.following]);

  // Fetch posts for the active subtab
  useEffect(() => {
    if (!targetId) return;
    const fetchTabPosts = async () => {
      setLoadingPosts(true);
      try {
        let url = `/api/posts?feedType=user&targetUserId=${targetId}`;
        if (activeSubTab === 'likes') {
          url = `/api/posts?feedType=liked&targetUserId=${targetId}`;
        } else if (activeSubTab === 'saved') {
          url = `/api/posts?feedType=saved&currentUserId=${targetId}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          let data: Post[] = await res.json();
          if (activeSubTab === 'media') {
            data = data.filter(p => !!p.mediaUrl);
          }
          setProfilePosts(data);
        }
      } catch (e) {
        console.error('Failed to load profile posts', e);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchTabPosts();
  }, [targetId, activeSubTab, currentUser?.likedPosts, currentUser?.savedPosts]);

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isFollowing = currentUser ? currentUser.following.includes(profileUser.id) : false;

  return (
    <div id="user-profile-view" className="pb-12">
      {/* Back button header on mobile */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => {
            setActiveTab('feed');
            setViewingUserId(null);
          }}
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
            {profileUser.name}
            {profileUser.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500 text-white" />
            )}
          </h1>
          <p className="text-xs text-zinc-500">{profilePosts.length} posts</p>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="h-44 md:h-56 bg-zinc-800 relative overflow-hidden">
        {profileUser.coverImage ? (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-zinc-900" />
        )}
      </div>

      {/* Profile Info Card */}
      <div className="px-5 md:px-8 relative bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        {/* Avatar and Action Buttons */}
        <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4">
          <div className="relative">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              referrerPolicy="no-referrer"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 shadow-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                id="btn-edit-profile"
                onClick={() => setShowEditModal(true)}
                className="px-5 py-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  id={`btn-follow-profile-${profileUser.id}`}
                  onClick={() => toggleFollowUser(profileUser.id)}
                  className={`px-6 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                    isFollowing
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-zinc-200 dark:border-zinc-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => switchUser(profileUser.id)}
                  className="px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300"
                  title="Switch to this profile"
                >
                  Switch
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Bio and Meta Details */}
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              {profileUser.name}
            </h2>
            {profileUser.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-indigo-500 fill-indigo-500 text-white" />
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            @{profileUser.username}
          </p>

          <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-2xl whitespace-pre-line">
            {profileUser.bio}
          </p>

          {/* Location, Website, Joined Date */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            {profileUser.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{profileUser.location}</span>
              </div>
            )}
            {profileUser.website && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{profileUser.joinedDate}</span>
            </div>
          </div>

          {/* Followers & Following Counters */}
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-sm">
            <button
              onClick={() => setShowFollowModal('following')}
              className="hover:underline text-zinc-600 dark:text-zinc-400"
            >
              <strong className="font-bold text-zinc-900 dark:text-white mr-1">
                {profileUser.following.length}
              </strong>
              <span>Following</span>
            </button>
            <button
              onClick={() => setShowFollowModal('followers')}
              className="hover:underline text-zinc-600 dark:text-zinc-400"
            >
              <strong className="font-bold text-zinc-900 dark:text-white mr-1">
                {profileUser.followers.length}
              </strong>
              <span>Followers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Posts | Media | Likes | Saved */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-14 z-10">
        {[
          { id: 'posts', label: 'Posts', icon: MessageSquare },
          { id: 'media', label: 'Media', icon: ImageIcon },
          { id: 'likes', label: 'Likes', icon: Heart },
          ...(isOwnProfile ? [{ id: 'saved', label: 'Saved', icon: Bookmark }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            id={`tab-profile-${tab.id}`}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-3.5 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeSubTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="p-4 md:p-6">
        {loadingPosts ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
          </div>
        ) : profilePosts.length === 0 ? (
          <div className="text-center py-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              No {activeSubTab} to show yet
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              When {isOwnProfile ? 'you' : `@${profileUser.username}`} posts or interacts, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profilePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal user={profileUser} onClose={() => setShowEditModal(false)} />
      )}

      {/* Followers / Following List Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white capitalize flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>{showFollowModal}</span>
              </h3>
              <button
                onClick={() => setShowFollowModal(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto space-y-2">
              {allUsers
                .filter(u =>
                  showFollowModal === 'following'
                    ? profileUser.following.includes(u.id)
                    : profileUser.followers.includes(u.id)
                )
                .map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setViewingUserId(u.id);
                      setShowFollowModal(null);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate flex items-center gap-1">
                          {u.name}
                          {u.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-indigo-500 text-white" />
                          )}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">@{u.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
