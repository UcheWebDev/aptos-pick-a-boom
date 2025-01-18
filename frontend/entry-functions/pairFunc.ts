import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";


export const pairFunc = (amount, creatorAddress, stakeId): InputTransactionData => {
    return {
        data: {
            function: `${MODULE_ADDRESS}::stake_manager::pair_stake`,
            functionArguments: [stakeId, amount],
        },
    };
};
