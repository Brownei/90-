import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { getServerSession } from 'next-auth';
import prisma from '@/utils/prisma';

// Verify a message signed by a Solana wallet
async function verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, message } = await req.json();

    if (!publicKey || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the signature
    const isValid = await verifySignature(message, signature, publicKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Get current session (if user is logged in with Twitter)
    const session = await getServerSession();
    let userId;

    if (session?.user) {
      // User is already logged in, link this wallet to their account
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: session.user.email },
            { 
              accounts: {
                some: {
                  providerAccountId: session.user.twitterId
                }
              }
            }
          ]
        }
      });

      if (user) {
        userId = user.id;

        // Check if wallet already exists
        const existingWallet = await prisma.wallet.findUnique({
          where: { publicKey }
        });

        if (existingWallet) {
          // Update the last signed in time
          await prisma.wallet.update({
            where: { id: existingWallet.id },
            data: { lastSignedIn: new Date() }
          });

          if (existingWallet.userId !== userId) {
            return NextResponse.json(
              { error: 'This wallet is already linked to another account' },
              { status: 409 }
            );
          }
        } else {
          // Create a new wallet for this user
          await prisma.wallet.create({
            data: {
              publicKey,
              provider: 'solana',
              userId: user.id,
              isMainWallet: (await prisma.wallet.count({ where: { userId: user.id } })) === 0
            }
          });
        }
      }
    } else {
      // No existing session, create a new user account
      // First check if the wallet already exists
      const existingWallet = await prisma.wallet.findUnique({
        where: { publicKey }
      });

      if (existingWallet) {
        // Update wallet's last signed in time
        await prisma.wallet.update({
          where: { id: existingWallet.id },
          data: { lastSignedIn: new Date() }
        });
        
        userId = existingWallet.userId;
      } else {
        // Create a new user and wallet
        const newUser = await prisma.user.create({
          data: {
            name: `Solana User ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
            wallets: {
              create: {
                publicKey,
                provider: 'solana',
                isMainWallet: true
              }
            }
          }
        });
        
        userId = newUser.id;
      }
    }

    // Fetch wallet data from Solana blockchain
    await updateWalletData(publicKey, userId);

    return NextResponse.json({
      success: true,
      publicKey,
      userId
    });
  } catch (error) {
    console.error('Error in Solana authentication:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Update wallet balance and token data
async function updateWalletData(publicKey: string, userId: string) {
  try {
    // Connect to Solana devnet
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    // Get wallet SOL balance
    const walletPublicKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(walletPublicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL
    
    // Update wallet in database
    await prisma.wallet.update({
      where: { publicKey },
      data: {
        solanaBalance: solBalance
      }
    });
    
    // Optionally, you could fetch token accounts and update them here
    // This involves using getTokenAccountsByOwner and is more complex
    
  } catch (error) {
    console.error('Error updating wallet data:', error);
    // We don't want to fail the auth if this fails
  }
} 