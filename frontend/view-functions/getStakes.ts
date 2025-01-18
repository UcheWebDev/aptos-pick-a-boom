import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export interface StakeRequest {
    id: number;
    staker: string;
    opponent: string;
    amount: number;
    status: number;
    created_at: number;
}

export const getAllStakes = async () => {
    const response = await aptosClient()
        .view({
            payload: {
                function: `${MODULE_ADDRESS}::stake_manager::get_all_stakes_global`,
            },
        })
        .catch((error) => {
            console.error(error);
            return ["stakes does not exist"];
        });

    return response[0] ;
};