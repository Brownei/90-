"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/utils/useAuth';
import { trpc } from '@/trpc/client';
import { useAuthLogin } from '@/hooks/use-auth-login';

interface ProfileCardProps {
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className = '' }) => {
  const { user, loggedIn, isLoading, logout } = useAuthLogin();
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

  if (!loggedIn && (user === null || undefined)) {
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
        {user?.profileImage ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src={user.profileImage}
              alt={user.name || 'User'}
              className="object-cover size-[104px]"
              quality={100}
              width={500}
              height={500}
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">{user?.name?.charAt(0) || 'U'}</span>
          </div>
        )}

        <h2 className="text-xl font-bold mb-1">{user?.name || 'User'}</h2>

       
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard; 
