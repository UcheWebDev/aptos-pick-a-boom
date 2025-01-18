// src/hooks/useAptosBalance.ts
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";
import type { AccountInfo } from "@aptos-labs/wallet-adapter-react";

export const useAptosBalance = (account: AccountInfo | null) => {
    const [aptBalance, setAptBalance] = useState(0);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!account?.address) {
            setAptBalance(0);
            queryClient.invalidateQueries(["apt-balance"]);
        }
    }, [account?.address, queryClient]);

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["apt-balance", account?.address],
        queryFn: async () => {
            if (!account?.address) {
                return { balance: 0 };
            }

            try {
                const balance = await getAccountAPTBalance({
                    accountAddress: account.address,
                });
                return { balance };
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.toString(),
                });
                throw error;
            }
        },
        enabled: !!account?.address,
        refetchInterval: 10000,
        retry: 2,
        staleTime: 5000,
    });

    useEffect(() => {
        if (data?.balance !== undefined) {
            setAptBalance(data.balance);
        }
    }, [data]);

    return {
        aptBalance,
        isLoading,
        isError,
        isWalletConnected: !!account?.address,
        formattedBalance: aptBalance / Math.pow(10, 8),
    };
};