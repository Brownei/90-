import { Message } from "./stores/use-messages-store";

export type Game = {
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  matchTime: string,
  homeImage: string,
  awayImage: string
}

export const defaultMessages: Message[] = [
  {
    id: "1",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "John Doe",
    time: "9:00 AM",
    content: "Hey everyone! 👋",
    reactions: ["👋", "🔥"],
    actionNos: 7000,
    isRef: false,
    replies: [
      {
        id: "1-1",
        avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        username: "Jane Smith",
        time: "9:02 AM",
        content: "Hey John! 😄",
      }
    ]
  },
  {
    id: "2",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    username: "Chris Evans",
    isRef: false,
    time: "9:10 AM",
    content: "Did you guys watch the game last night?",
    reactions: ["⚽", "👏"],
    actionNos: 700
  },
  {
    id: "3",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    isRef: false,
    username: "Emily Carter",
    time: "9:15 AM",
    content: "Wow, I still can't believe that final goal! 🤯 It was absolutely insane, the way everything came together in the last few seconds! The tension, the excitement, the sheer unpredictability – that moment was unforgettable! What a game!",
    reactions: ["🤯", "🔥", "❤️"],
    actionNos: 700
  },
  {
    id: "4",
    avatarUrl: "https://media.tenor.com/XPbK0iLSsIgAAAAm/touchdown-referee.webp",
    username: "REF",
    isRef: true,
    time: "75'",
    content: "🟥 76’ RED CARD! – Sergio Ramos Second yellow. PSG down to 10 men. Classic Ramos moment.",
    reactions: ["🤯", "🔥", "❤️"],
    actionNos: 700,
    reactionsToRef: {
        "laughing": 20,
        "clapping": 10,
        "thumbs-down": 5,
      }
  }
];


export const games: Game[] = [
  {
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeScore: 2,
    awayScore: 1,
    matchTime: "67'",
    homeImage: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    awayImage: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
  },
  {
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    homeScore: 1,
    awayScore: 1,
    matchTime: "43'",
    homeImage: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
    awayImage: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
  },
  {
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    homeScore: 3,
    awayScore: 0,
    matchTime: "82'",
    homeImage: "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_München_logo_%282017%29.svg",
    awayImage: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg"
  },
  {
    homeTeam: "Inter Milan",
    awayTeam: "AC Milan",
    homeScore: 2,
    awayScore: 2,
    matchTime: "75'",
    homeImage: "https://upload.wikimedia.org/wikipedia/en/0/05/Inter_Milan.svg",
    awayImage: "https://upload.wikimedia.org/wikipedia/en/d/d0/AC_Milan_logo.svg"
  }
];


