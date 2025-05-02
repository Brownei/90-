"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/utils/useAuth';
import { trpc } from '@/trpc/client';

interface ProfileCardProps {
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className = '' }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  // const { data: twitterUserInfo, isLoading: isLoadingTwitterInfo } = trpc.twitter.getUserInfo.useQuery(
  //   { userId: user?.id },
  //   { enabled: isAuthenticated && !!user?.id }
  // );

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex flex-col items-center">
        {user.image ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src={user.image}
              alt={user.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">{user.name?.charAt(0) || 'U'}</span>
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-1">{user.name || 'User'}</h2>
        
        {/* {isLoadingTwitterInfo ? (
          <p className="text-gray-500 text-sm mb-4">Loading Twitter info...</p>
        ) : twitterUserInfo ? (
          <>
            <p className="text-gray-500 text-sm mb-4">@{twitterUserInfo.username}</p>
            {twitterUserInfo.description && (
              <p className="text-gray-700 text-center mb-4">{twitterUserInfo.description}</p>
            )}
            {twitterUserInfo.verified && (
              <div className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Verified
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm mb-4">@{user.username || user.name}</p>
        )}
         */}
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
        >
          Disconnect X
        </button>
      </div>
    </div>
  );
};

export default ProfileCard; 