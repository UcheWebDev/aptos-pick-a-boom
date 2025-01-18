import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getMessageContent = async () => {
  const content = await aptosClient()
    .view({
      payload: {
        function: `${MODULE_ADDRESS}::stake_manager::get_contract_balance`,
      },
    })
    .catch((error) => {
      console.error('Error fetching contract balance:', error);
      return ["Error fetching contract balance:"];
    });

  return content[0];
};
