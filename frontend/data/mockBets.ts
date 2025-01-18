import { Bet } from '../types/bet';
import { CircleDollarSign, Dices, Sword } from 'lucide-react';

export const mockBets = [
    {
        id: '1',
        game: 'Blackjack',
        user: 'Hidden',
        time: '8:42 PM',
        betAmount: '50.00 USDT',
        multiplier: '0.00x',
        payout: '-50.00 USDT',
        isPositive: false,
    },
    {
        id: '2',
        game: 'Dice',
        user: 'XACAH07',
        time: '8:42 PM',
        betAmount: '3.50 USDT',
        multiplier: '1.01x',
        payout: '3.53 USDT',
        isPositive: true,
    },
    {
        id: '3',
        game: 'Stormforged',
        user: 'Hidden',
        time: '8:42 PM',
        betAmount: '1.40 USD',
        multiplier: '0.20x',
        payout: '-1.12 USD',
        isPositive: false,
    },
];