import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, users, comments, replies, hubs, wagers } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { encryptData } from "@/utils/utils";
import { pusherServer } from "@/lib/pusher/server";
import { Message, Reply } from "@/stores/use-messages-store";

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

getAllMessages: baseProcedure
  .input(z.object({
    hubName: z.string()
  }))
  .query(async ({ input }) => {
    const { hubName } = input;

    // Get hub
    const hub = await db
      .select({ id: hubs.id })
      .from(hubs)
      .where(eq(hubs.name, hubName))
      .then(res => res[0]);

    if (!hub) throw new Error("Hub not found");

    // Fetch comments with authors
    const rawComments = await db
      .select({
        id: comments.id,
        message: comments.content,
        hubId: comments.hubId,
        userId: comments.userId,
        time: comments.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorImage: users.image
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.hubId, hub.id));

    const commentIds = rawComments.map(c => c.id);

    // Fetch replies with authors
    const rawReplies = await db
      .select({
        id: replies.id,
        commentId: replies.commentId,
        content: replies.content,
        userId: replies.userId,
        authorId: users.id,
        authorName: users.name,
        authorImage: users.image
      })
      .from(replies)
      .leftJoin(users, eq(replies.userId, users.id))
      .where(inArray(replies.commentId, commentIds));

    // Group replies under their comment
    const repliesByComment: Record<number, Reply[]> = {};
    for (const r of rawReplies) {
      if (!repliesByComment[r.commentId!]) repliesByComment[r.commentId!] = [];
      repliesByComment[r.commentId!].push({
        id: r.id,
        commentId: r.commentId!,
        content: r.content,
        author: {
          id: r.authorId!,
          name: r.authorName!,
          profileImage: r.authorImage!,
        },
      });
    }

    // Structure final output
    const messages: Message[] = rawComments.map((c) => ({
      id: c.id!,
      message: c.message!,
      hubId: c.hubId!,
      userId: c.userId!,
      time: c.time!,
      author: c.authorId
        ? {
            id: c.authorId!,
            name: c.authorName!,
            profileImage: c.authorImage!,
          }
        : undefined,
      replies: repliesByComment[c.id] || [],
    }));

    return messages;
  })
});


