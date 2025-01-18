import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";


export const unStakeFunc = (stakeId): InputTransactionData => {
    return {
        data: {
            function: `${MODULE_ADDRESS}::stake_manager::unstake`,
            functionArguments: [stakeId],
        },
    };
};
