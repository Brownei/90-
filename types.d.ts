
// Define the response type for matches
interface Match {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  tournament: string;
  category: string;
  isLive: boolean;
  date: string;
}

interface MatchesResponse {
  matches: Match[];
  count: number;
  error?: string;
}
