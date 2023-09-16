import { useEffect, useMemo, useState } from "react";
import { Account, Contract, json, Provider, constants, uint256, Call, cairo, CallData, TransactionStatus, RpcProvider } from "starknet";
import { RPCProvider, Query } from "@dojoengine/core";
import abiJson from './ERC20.json';
import fs from "fs";

// todo: move to other place.
export const transferETH = async(fromAccount : Account,to: String, amount: string | number | bigint) =>{
    try {
        let account = fromAccount;
        const compiledErc20 = abiJson;
        const erc20Address = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" // eth token address
        const erc20 = new Contract(compiledErc20.abi, erc20Address, account);
        erc20.connect(account);
        
        const toTransferTk =  cairo.uint256(amount)
        const transferOptions = {
            contractAddress: erc20Address,
            entrypoint: "transfer",
            calldata: CallData.compile([to, toTransferTk]),
        };
        // const curNonce = await account.getNonce();
        // const nonce = "0x" +  (parseInt(curNonce) + 1).toString(16)

        const nonce = await account.getNonce();

        const { transaction_hash } = await account.execute(transferOptions, undefined, {
            nonce,
            maxFee: 0
        });
        const result = await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
            // successStates: [TransactionStatus.ACCEPTED_ON_L2],
        });

        // Query updated balance
        // const ret = await erc20.balanceOf(account.address);
        // const balance_num = uint256.uint256ToBN(ret.balance).toString()

        if (!result) {
            console.log("Transaction did not complete successfully.")
            // throw new Error("Transaction did not complete successfully.");
            return
        }
        return result;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}


export const useERC20Balance = (erc20Address: string, account: Account | null) => {

    if (!erc20Address) {
        erc20Address = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" // eth token address
    }

    const provider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
    });
    const compiledErc20 = abiJson

    const [balance, setBalance] = useState('0');

    useEffect(() => {
        if (!account) {
            return
        }
        const updateBalance = async () => {
            // const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for testnet 
            const erc20 = new Contract(compiledErc20.abi, erc20Address, account);
            erc20.connect(account);
            const ret = await erc20.balanceOf(account.address);
            const balance_num = uint256.uint256ToBN(ret.balance).toString()

            // TODO: balance need to convert readable number
            // return value "1234567890123456" should convert to 0.0123456789123456 eth
            console.log(`${account.address} --- eth balance: ${balance_num}`)
            setBalance(balance_num) 
        }

        updateBalance();
    }, [erc20Address, account]);

    return balance;
};