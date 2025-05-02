import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { Connection, PublicKey } from '@solana/web3.js';

export async function POST(req: NextRequest) {
  try {
    // Get data from request
    const userData = await req.json();
    
    // Get current session if available
    const session = await getServerSession();
    let userId = null;

    // Check if there's an existing user with this email
    let user = null;
    if (userData.email) {
      user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
    }

    // If no user found, check by wallet public key
    if (!user && userData.publicKey) {
      const wallet = await prisma.wallet.findUnique({
        where: { publicKey: userData.publicKey },
        include: { user: true },
      });
      if (wallet) {
        user = wallet.user;
      }
    }

    // If user exists, update them
    if (user) {
      // Update user information
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userData.name || user.name,
          image: userData.profileImage || user.image,
        },
      });
      userId = user.id;
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name: userData.name || `User ${userData.verifierId?.slice(0, 6) || 'New'}`,
          email: userData.email,
          image: userData.profileImage,
        },
      });
      userId = newUser.id;
    }
    
    // If we have a public key, create or update the wallet
    let walletId = null;
    if (userData.publicKey) {
      const existingWallet = await prisma.wallet.findUnique({
        where: { publicKey: userData.publicKey },
      });
      
      if (existingWallet) {
        // Update existing wallet
        const updatedWallet = await prisma.wallet.update({
          where: { id: existingWallet.id },
          data: { 
            lastSignedIn: new Date(),
            userId: userId, // Link wallet to the current user
          }
        });
        walletId = updatedWallet.id;
      } else {
        // Create new wallet
        const newWallet = await prisma.wallet.create({
          data: {
            publicKey: userData.publicKey,
            provider: 'web3auth',
            userId: userId,
            isMainWallet: true,
          }
        });
        walletId = newWallet.id;
      }
      
      // Update wallet balance
      await updateWalletBalance(userData.publicKey, walletId);
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "User data stored successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error storing user data:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to store user data"
    }, { status: 500 });
  }
}

// Function to update the wallet balance
async function updateWalletBalance(publicKey: string, walletId: string) {
  try {
    // Connect to Solana network
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    // Get wallet SOL balance
    const walletPublicKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(walletPublicKey);
    const solBalance = balance / 1e9; // Convert lamports to SOL
    
    // Update wallet in database
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        solanaBalance: solBalance
      }
    });
    
    return { success: true, balance: solBalance };
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    return { success: false, error };
  }
} 