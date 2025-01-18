import { ReactNode } from 'react';

export type Tab = 'casino' | 'sports';

export type Bet = {
    id: string;
    game: string;
    icon: ReactNode;
    user: string;
    time: string;
    betAmount: string;
    multiplier: string;
    payout: string;
    isPositive: boolean;
};