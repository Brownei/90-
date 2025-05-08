import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, users, comments, replies } from "@/lib/db";
import { eq } from "drizzle-orm";
import { encryptData } from "@/utils/utils";
import { pusherServer } from "@/lib/pusher/server";

export const messagesRouter = createTRPCRouter({
  sendMessages: baseProcedure
    .input(
      z.object({
        content: z.string(),
        hubId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({input}) => {
      const {content, userId, hubId} = input
      try {
        const getAuthor = await db.select({name: users.name, profileImage: users.image}).from(users).where(eq(users.id, userId))
        const {name, profileImage} = getAuthor[0]
        const newMessage = await db.insert(comments).values({
          hubId,
          content,
          userId,
        }).returning({id: comments.id, content: comments.content, hubId: comments.hubId, userId: comments.userId, time: comments.createdAt})
        const commentReplies = await db.select({id: replies.id, commentId: replies.commentId, content: replies.content, author: {id: users.id, name: users.name, profileImage: users.image}}).from(replies).where(eq(replies.commentId, newMessage[0].id)).innerJoin(users, eq(replies.userId, users.id))

        const payload = {
          message: newMessage[0].content,
          id: newMessage[0].id,
          hubId: newMessage[0].hubId,
          userId: newMessage[0].userId,
          author: {
            id: newMessage[0].userId,
            name,
            profileImage
          },
          time: newMessage[0].time,
          replies: commentReplies,
        }

        await pusherServer.trigger('comment-hub', 'new-message', {
          payload,
        })
      } catch (error) {
        console.log(error)
      }
  }),
});


