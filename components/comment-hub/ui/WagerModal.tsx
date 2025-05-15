import { BettingClient } from '@/client/betting-client';
import { useAuthLogin } from '@/hooks/use-auth-login';
import { db, users, wallets } from '@/lib/db';
import { web3authAtom } from '@/stores/navStore';
import { trpc } from '@/trpc/client';
import { useAuth } from '@/utils/useAuth';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { useWallet } from '@solana/wallet-adapter-react';
import {  Keypair, PublicKey } from '@solana/web3.js';
import { eq } from 'drizzle-orm';
import { useAtom } from 'jotai';
import React, {  useState } from 'react';

interface WagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (condition: string, stake: number) => void;
  selectedGame: any
  username?: string;
  insufficientBalance?: boolean;
  escrowAccount: string
}

const WagerModal: React.FC<WagerModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedGame,
  onProceed, 
  username = '', 
  escrowAccount,
  insufficientBalance,
}) => {
  const [wagerCondition, setWagerCondition] = useState('');
  const { publicKey,} = useWallet()
  const {user} = useAuthLogin()
  const bettingClient = new BettingClient(publicKey!)
  const [stakeAmount, setStakeAmount] = useState('');
  const [forUsername, setForUsername] = useState(username);
  const [againstUsername, setAgainstUsername] = useState('');
  const wagerMutation = trpc.wagers.placeWager.useMutation();
  // const {data: escrowAccount, isLoading, error} = trpc.users.getEscrowAccount.useQuery()
  
  if (!isOpen) return null;

  const handleProceed = async (home: string, away: string, hubId: number, startTime: number) => {
    if (wagerCondition && stakeAmount && escrowAccount) {
      // onProceed(wagerCondition, parseFloat(stakeAmount));
      const transaction = await bettingClient.initialize(2)
      // console.log(transaction)

      const newMatchTx = await bettingClient.createMatch(home, away, String(hubId), startTime)
      const betTx = await bettingClient.placeBet(
        String(hubId), 
        Number(stakeAmount), 
        wagerCondition, 
        new PublicKey(user?.address!), 
        new PublicKey(escrowAccount)
      )

      await wagerMutation.mutateAsync({
        condition: wagerCondition,
        for: Number(user?.id!),
        amount: Number(stakeAmount),
        hubId,
      })

      console.log({newMatchTx, betTx, transaction})
    }
  };

  return (
    <div onClick={(e)=>{
      onClose();
      e.stopPropagation();
    }} className="fixed inset-0 bg-black/50 flex items-center justify-center !z-[999999999999] p-4">
      <div  onClick={(e) => {e.stopPropagation();}} className="bg-white w-full max-w-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center flex-1">{insufficientBalance ? "WAGER💰" : "WAGER"}</h2>
          <button onClick={onClose} className="text-black text-2xl ml-2">×</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-bold text-sm mb-2">FOR</p>
            <div className="border border-gray-300 rounded px-2 py-1">
              <input
                type="text"
                className="w-full text-sm outline-none"
                placeholder="@Username"
                value={forUsername ? `@${forUsername}` : ''}
                onChange={(e) => setForUsername(e.target.value.replace('@', ''))}
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-sm mb-2">AGAINST</p>
            <div className="border border-gray-300 rounded px-2 py-1">
              <input 
                type="text" 
                className="w-full text-sm outline-none" 
                placeholder="@Username"
                value={againstUsername ? `@${againstUsername}` : ''}
                onChange={(e) => setAgainstUsername(e.target.value.replace('@', ''))}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="font-bold text-sm mb-2">WAGER CONDITION<span className="text-red-500">*</span></p>
          <div className="border border-gray-300 rounded px-2 py-2">
            <input 
              type="text" 
              className="w-full text-sm outline-none"
              placeholder="Barcelona to win and Yamal to score"
              value={wagerCondition}
              onChange={(e) => setWagerCondition(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <p className="font-bold text-sm mb-2">STAKE<span className="text-red-500">*</span></p>
          <div className="border border-gray-300 rounded px-2 py-2">
            <input 
              type="text" 
              className="w-full text-sm outline-none"
              placeholder="$10"
              value={stakeAmount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                setStakeAmount(val);
              }}
            />
          </div>
        </div>
        
        {insufficientBalance && (
          <p className="text-xs text-red-500 mb-2">Insufficient wallet balance</p>
        )}

        <div className="flex justify-end">
          <button 
            className="bg-green-700 disabled:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
            onClick={
              async () => await handleProceed(
                selectedGame.team.home,
                selectedGame.team.away,
                selectedGame.id,
                selectedGame.team.startTime
              )
            }
            disabled={!wagerCondition || !stakeAmount}
          >
            Book
          </button>
        </div>
        
        {insufficientBalance && (
          <p className="text-xs text-center mt-2">Funds from external wallet</p>
        )}
      </div>
    </div>
  );
};

export default WagerModal; 
