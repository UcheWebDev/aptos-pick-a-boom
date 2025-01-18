import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "@/constants";


export const stakeFunc = (amount, totalCut: string, totalGames: string, pairId): InputTransactionData => {
  return {
    data: {
      function: `${MODULE_ADDRESS}::stake_manager::create_stake`,
      functionArguments: [amount, totalCut, totalGames, pairId],
    },
  };
};
