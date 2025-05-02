import { NextRequest, NextResponse } from 'next/server';
import { airdropSol } from '@/utils/solanaHelpers';
import { getServerSession } from 'next-auth';
import prisma from '@/utils/prisma';

/**
 * Handles airdrop request
 * This endpoint allows requesting an airdrop on devnet for testing
 */
export async function POST(req: NextRequest) {
  try {
    // Get the wallet address from request
    const { walletAddress, amount } = await req.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Get the current user session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify that the wallet belongs to the user
    const wallet = await prisma.wallet.findFirst({
      where: {
        publicKey: walletAddress,
        user: {
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
      }
    });
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'This wallet does not belong to the authenticated user' },
        { status: 403 }
      );
    }
    
    // Request the airdrop
    const signature = await airdropSol(walletAddress, amount || 1);
    
    return NextResponse.json({
      success: true,
      signature,
      message: `Airdrop of ${amount || 1} SOL to ${walletAddress} successful!`
    });
  } catch (error) {
    console.error('Airdrop error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process airdrop',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 