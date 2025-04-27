import { defaultMessages } from "@/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  avatarUrl: string;
  username: string;
  time: string;
  content: string;
  isRef: boolean
  reactions?: string[];
  actionNos: number;
  replies?: Reply[]; // 🆕 allow replies inside
  reactionsToRef?: {
    "laughing": number,
    "clapping": number,
    "thumbs-down": number,
  }
}

type Reaction =
  "laughing" |
  "clapping" |
  "thumbs-down"


export interface Reply {
  id: string;
  avatarUrl: string;
  username: string;
  time: string;
  content: string;
}

interface MessageStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  addReaction: (messageId: string, reaction: string) => void;
  addReply: (messageId: string, reply: Reply) => void;
  addActionNos: (messageId: string, emoji: number) => void;
  addReactionsToRef: (messageId: string, type: Reaction) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: defaultMessages,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message]
        })),

      addReactionsToRef: (messageId, type) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId
              ? ({
                ...m,
                reactionsToRef: {
                  ...m.reactionsToRef, // Retain existing reactions
                  [type]: (m.reactionsToRef?.[type] || 0) + 1, // Increment the specific reaction
                },
              } as Message)
              : m
          ),
        })),

      addReaction: (messageId, reaction) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? {
                ...msg,
                reactions: msg.reactions ? [...msg.reactions, reaction] : [reaction]
              }
              : msg
          )
        })),

      addReply: (messageId, reply) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? {
                ...msg,
                replies: msg.replies ? [...msg.replies, reply] : [reply]
              }
              : msg
          )
        })),

      addActionNos: (messageId, number) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId
              ? {
                ...msg,
                actionNos: msg.actionNos + number
              }
              : msg
          )
        }))
    }),
    { name: "messages-store" }
  )
);

