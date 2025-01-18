export interface BetHistoryItem {
    id: number;
    type: string;
    count: string;
    stake: number;
    odds: number;
    potentialWin: number;
    status: "won" | "lost";
    wonAmount?: number;
  }