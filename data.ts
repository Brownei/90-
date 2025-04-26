export type Game = {
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  matchTime: string,
  homeImage: string,
  awayImage: string
}



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


