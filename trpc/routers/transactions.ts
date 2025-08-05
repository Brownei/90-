import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/lib/db";
import {
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
} from '@solana/web3.js';

export const transactionsRouter = createTRPCRouter({
  withdrawFunds: baseProcedure
    .input(
      z.object({
        amount: z.number(),
        condition: z.string(),
        against: z.number().nullish(),
        for: z.number(),
        hubId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { hubId, for: forBettor, against, condition, amount } = input
      await db.insert().values({
        amount,
        condition,
        against,
        for: forBettor,
        hubId,
        isOpen: true
      })
    }),

  sendFunds: baseProcedure
    .input(
      z.object({
        amount: z.number(),
        receiverAddr: z.string(),
        senderAddr: z.string()
      })
    )
    .mutation(async ({ input }) => {
      // Inside your component
      const { amount, receiverAddr, senderAddr } = input
      const walletPublicKey = new PublicKey(senderAddr);
      const instruction = SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: new PublicKey(receiverAddr),
        lamports: amount,
      });

      const message = new TransactionMessage({
        payerKey: walletPublicKey,
        instructions: [instruction],
        recentBlockhash
      });

      const transaction = new VersionedTransaction(message.compileToV0Message());

      const { hash } = await privy.walletApi.solana.signAndSendTransaction({
        walletId: 'insert-wallet-id',
        caip2: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', // Mainnet
        transaction: transaction,
      });
    }),
})


