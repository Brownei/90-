"use client";

import { useFundWallet } from '@privy-io/react-auth';
import { base } from 'viem/chains'
import React from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import { useAuth } from '@/utils/useAuth';
import { trpc } from '@/trpc/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthLogin } from '@/hooks/use-auth-login';
import { SolanaWallet } from '@web3auth/solana-provider';
import { IProvider } from '@web3auth/base';
import { useSessionStore } from '@/stores/use-session-store';
import { useAuthState } from '@/context';
import { usePrivy } from "@privy-io/react-auth";

const ProfilePage = () => {
  const { fundWallet } = useFundWallet();
  const { } = useWallet();
  const { user } = useAuthState();
  const { user: privyUser } = usePrivy();
  const { loggedIn, provider, isLoading } = useAuthLogin();
  const [tweetText, setTweetText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const postTweet = trpc.twitter.tweet.useMutation();


  console.log({ privyUser })
  function receiveMoney() {
    fundWallet(user?.wallet_addr as string, {
      chain: base,
      amount: '0.01', // SOL
      card: {
        preferredProvider: 'coinbase',
      },
      defaultFundingMethod: 'exchange',
      uiConfig: {
        receiveFundsTitle: 'Receive 0.05 ETH',
        receiveFundsSubtitle: 'Scan this code or copy your wallet address to receive funds on Base.'
      }
    });
  }

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    try {
      setIsSubmitting(true);
      // await postTweet.mutateAsync({ text: tweetText });
      setTweetText('');
      alert('Tweet posted successfully!');
    } catch (error) {
      console.error('Error posting tweet:', error);
      alert('Failed to post tweet. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <ProfileCard className="mb-8" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Connect Solana Wallet</h2>
          <p className="text-sm text-gray-600 mb-4">
            Connect your Solana wallet to access additional features and participate in the ecosystem.
          </p>
        </div>

        <button className='bg-gradient-to-l from-[#007CF0] from-[29%] to-[#00DFD8] to-[87%] px-3 py-1 rounded-full mb-10' onClick={receiveMoney}>Fund your 90+ account</button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Post a Tweet</h2>
          <form onSubmit={handleTweetSubmit}>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none"
              rows={4}
              placeholder="What's happening?"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              maxLength={280}
            />
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                {tweetText.length}/280 characters
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !tweetText.trim()}
                className="bg-ctaButton text-white px-4 py-2 rounded-full disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Tweet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
