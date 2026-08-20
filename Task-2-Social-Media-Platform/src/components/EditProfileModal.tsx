import React, { useState } from 'react';
import { User } from '../types';
import { useSocial } from '../context/SocialContext';
import { X, Camera, Link, MapPin, Check } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const { updateProfile } = useSocial();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name,
      bio,
      location,
      website,
      avatar,
      coverImage,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div
      id="edit-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Profile</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Cover & Avatar previews */}
          <div className="relative mb-8">
            <div className="h-32 rounded-2xl bg-zinc-800 overflow-hidden relative">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
              )}
            </div>
            <div className="absolute -bottom-6 left-6">
              <img
                src={avatar}
                alt="Avatar preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 shadow-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell the community about yourself, your stack, and interests..."
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full pl-9 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Website / GitHub URL
              </label>
              <div className="relative">
                <Link className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
