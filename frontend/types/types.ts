// types.ts
export type Match = {
    id: string;
    matchId: string;
    matchTime: string;
    league: string;
    ccode: string;
    homeTeam: string;
    awayTeam: string;
    homeLogo: string;
    awayLogo: string;
    live: boolean;
    started: boolean;
    finished: boolean;
    cancelled: boolean;
    homeScore?: number;
    awayScore?: number;
};

export type Selection = {
    matchId: string;
    prediction: "home" | "draw" | "away" | "over" | "under";
    homeTeam: string;
    awayTeam: string;
};

export type ExistingSelection = {
    match_id: string;
    prediction: "home" | "draw" | "away" | "over" | "under";
};

export const getResultText = (
    prediction: "home" | "draw" | "away" | "over" | "under",
    homeTeam: string,
    awayTeam: string,
    marketType: string
) => {
    if (marketType === 'outcome') {
        switch (prediction) {
            case "home":
                return `${homeTeam} Win`;
            case "draw":
                return "Draw";
            case "away":
                return `${awayTeam} Win`;
            default:
                return "";
        }
    }
    return prediction === "over" ? "Over 2.5" : "Under 2.5";
};