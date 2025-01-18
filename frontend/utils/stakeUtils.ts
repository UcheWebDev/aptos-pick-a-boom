// Utility functions for stake data handling
export const formatStakeAmount = (amount) => {
    // Convert from octas to APT (1 APT = 100000000 octas)
    return (parseInt(amount) / 100000000);
};

export const formatTimeStamp = (aptosTimestamp) => {
    const date = new Date(aptosTimestamp / 1_000);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options)
};

export const getStakeStatus = (status) => {
    switch (parseInt(status)) {
        case 1:
            return 'Open';
        case 2:
            return 'Paired';
        case 3:
            return 'Completed';
        default:
            return 'Unknown';
    }
};

export const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const calculateTopStakers = (stakes, MIN_APT_AMOUNT) => {
    try {
        const stakerMap = new Map();

        // First pass: collect all stakes and total amounts
        stakes
            .filter((stake) => Number(stake.amount) >= MIN_APT_AMOUNT)
            .forEach((stake) => {
                const creator = stake.creator;
                const amount = Number(stake.amount);
                const isWin = stake.winner === creator;

                if (stakerMap.has(creator)) {
                    const existing = stakerMap.get(creator);
                    stakerMap.set(creator, {
                        address: creator,
                        totalStaked: existing.totalStaked + amount,
                        stakeCount: existing.stakeCount + 1,
                        winCount: existing.winCount + (isWin ? 1 : 0),
                        totalStakes: [...existing.totalStakes, amount],
                    });
                } else {
                    stakerMap.set(creator, {
                        address: creator,
                        totalStaked: amount,
                        stakeCount: 1,
                        winCount: isWin ? 1 : 0,
                        totalStakes: [amount],
                    });
                }
            });

        // Calculate additional stats and format
        return Array.from(stakerMap.values())
            .sort((a, b) => b.totalStaked - a.totalStaked)
            .slice(0, 5)
            .map((staker) => ({
                ...staker,
                totalStaked: formatStakeAmount(staker.totalStaked),
                winRate: ((staker.winCount / staker.stakeCount) * 100).toFixed(1),
                averageStake: formatStakeAmount(
                    staker.totalStakes.reduce((sum, amount) => sum + amount, 0) / staker.stakeCount,
                ),
            }));
    } catch (err) {
        console.error("Error calculating top stakers:", err);
        return [];
    }
};

export const parseStakeData = (stake) => {
    return {
        id: stake.id,
        amount: formatStakeAmount(stake.amount),
        pairedAmount: stake.paired_amount,
        creator: stake.creator,
        createdAt: formatTimeStamp(stake.created_at),
        status: getStakeStatus(stake.status),
        pairedWith: stake.paired_with.vec[0] || null,
        pair_id: stake.pair_id || null,
        winner: stake.winner.vec[0] || null,
    };
};