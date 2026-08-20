import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User as UserIcon,
  Feather,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Sparkles,
  Users
} from 'lucide-react';

interface SidebarProps {
  onOpenCreateModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateModal }) => {
  const {
    currentUser,
    allUsers,
    activeTab,
    setActiveTab,
    unreadCount,
    setViewingUserId,
    switchUser,
  } = useSocial();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore & Tags', icon: Compass },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { id: 'bookmarks', label: 'Saved Bookmarks', icon: Bookmark },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-20 md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-3 md:px-5 py-6 z-30"
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => {
            setActiveTab('feed');
            setViewingUserId(null);
          }}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden md:block">
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Pulse
            </span>
            <span className="text-xs block text-indigo-600 dark:text-indigo-400 font-medium -mt-1">
              Social Network
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  if (item.id === 'profile') {
                    setViewingUserId(currentUser?.id || null);
                  }
                  setActiveTab(item.id as any);
                }}
                className={`flex items-center justify-center md:justify-start gap-4 px-3.5 py-3 rounded-2xl font-medium text-base transition-all duration-150 relative ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Post Button */}
        <button
          id="btn-create-post-sidebar"
          onClick={() => {
            if (onOpenCreateModal) {
              onOpenCreateModal();
            } else {
              setActiveTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Feather className="w-5 h-5" />
          <span className="hidden md:inline">Create Post</span>
        </button>
      </div>

      {/* Bottom Profile / User Switcher */}
      {currentUser && (
        <div className="relative">
          {showUserDropdown && (
            <div
              id="user-switcher-dropdown"
              className="absolute bottom-full left-0 mb-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Switch Active Profile</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowUserDropdown(false);
                    }}
                    className={`flex items-center gap-3 w-full p-2 rounded-xl text-left transition-colors ${
                      user.id === currentUser.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate flex items-center gap-1">
                        {user.name}
                        {user.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-current text-white" />}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            id="active-user-trigger"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden md:block min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                    {currentUser.name}
                  </span>
                  {currentUser.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 text-white flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate block">
                  @{currentUser.username}
                </span>
              </div>
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform duration-200" />
          </div>
        </div>
      )}
    </aside>
  );
};
