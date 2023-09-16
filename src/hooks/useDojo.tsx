import { Account, RpcProvider } from "starknet";
import { store } from "../store/store";
import { useBurner } from "@dojoengine/create-burner";
import { useEffect, useState } from "react";

export type UIStore = ReturnType<typeof useDojo>;

export const useDojo = () => {
    const { phaserLayer} = store();
    const provider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
    });

    // todo: allow connection with wallet providers
    const masterAccount = new Account(provider, import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!, import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!)
    const { create, list, get, account, select, isDeploying } = useBurner(
        {
            masterAccount: masterAccount,
            accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!,
            provider: provider
        }
    );

    useEffect(() => {
        console.log("usedojo account " + account);
        store.setState({ account:account })
    }, [account])

    if (phaserLayer === null) {
        throw new Error("Store not initialized");
    }

    return {
        account: {
            create,
            list,
            get,
            select,
            isDeploying
        }
    }
};