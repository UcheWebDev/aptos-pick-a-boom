
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";


export const confirmFunc = (stakeId, address): InputTransactionData => {
    return {
        data: {
            function: `${MODULE_ADDRESS}::stake_manager::complete_stake`,
            functionArguments: [stakeId, address],
        },
    };
};
