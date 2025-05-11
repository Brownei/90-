"use server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { db } from '../lib/db';
import { eq, and } from 'drizzle-orm';
import { tokens, wallets} from '../lib/db/schema';

const DEFAULT_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

/**
 * Gets the SOL balance for a wallet
 */
export async function getSolanaBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection(DEFAULT_RPC_ENDPOINT, 'confirmed');
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    throw error;
  }
}

/**
 * Get token accounts for a wallet
 */
export async function getTokenAccounts(walletAddress: string) {
  try {
    const connection = new Connection(DEFAULT_RPC_ENDPOINT, 'confirmed');
    const publicKey =  new PublicKey(walletAddress);
    
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    return tokenAccounts.value.map((tokenAccount) => {
      const accountData = tokenAccount.account.data.parsed.info;
      const mint = accountData.mint;
      const balance = accountData.tokenAmount.amount;
      const decimals = accountData.tokenAmount.decimals;
      const uiAmount = Number(balance) / Math.pow(10, decimals);
      
      return {
        mint,
        balance: Number(balance),
        decimals,
        uiAmount
      };
    });
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    return [];
  }
}

/**
 * Update wallet data in database
 */
export async function updateWalletData(walletAddress: string) {
  try {
    // Get SOL balance
    const solBalance = await getSolanaBalance(walletAddress);
    
    // Update in database
    await db.update(wallets)
      .set({ solanaBalance: solBalance })
      .where(eq(wallets.publicKey, walletAddress));
    
    // Get token accounts
    const tokenAccounts = await getTokenAccounts(walletAddress);
    
    // Get wallet from DB
    const [wallet] = await db.select()
      .from(wallets)
      .where(eq(wallets.publicKey, walletAddress));
    
    if (!wallet) return;
    
    // Update tokens in database
    for (const token of tokenAccounts) {
      // Check if token exists
      const [existingToken] = await db.select()
        .from(tokens)
        .where(
          and(
            eq(tokens.walletId, wallet.id),
            eq(tokens.mintAddress, token.mint)
          )
        );
      
      if (existingToken) {
        // Update existing token
        await db.update(tokens)
          .set({
            balance: solBalance,
            decimals: token.decimals
          })
          .where(eq(tokens.id, existingToken.id));
      } else {
        // Create new token
        await db.insert(tokens)
          .values({
            mintAddress: token.mint,
            balance: solBalance,
            decimals: token.decimals,
            walletId: wallet.id
          });
      }
    }
    
    return { solBalance, tokens: tokenAccounts };
  } catch (error) {
    console.error('Error updating wallet data:', error);
    throw error;
  }
}

/**
 * Airdrop SOL to a wallet (devnet only)
 */
export async function airdropSol(walletAddress: string, amount: number = 1): Promise<string> {
  try {
    if (!walletAddress) throw new Error('No wallet address provided');
    
    const connection = new Connection(DEFAULT_RPC_ENDPOINT, 'confirmed');
    const publicKey = new PublicKey(walletAddress);
    
    // Airdrop SOL to the wallet
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    // Confirm transaction
    await connection.confirmTransaction(signature);
    
    // Update our database
    await updateWalletData(walletAddress);
    
    return signature;
  } catch (error) {
    console.error('Error airdropping SOL:', error);
    throw error;
  }
} 
