import { ethers } from "ethers";
import { useERC20Balance } from "../hooks/useERC20Balance";
import { store } from "../store/store";
import { playerStore } from "../store/playerStore";

export default function WalletUI() {
    const {account} = store()
    const { player: storePlayer } = playerStore()
    const [balance, updateBalance] = useERC20Balance("", account);

    return (<div style={{ width: 200, height: 80, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
        <p>ETH : {ethers.utils.formatEther(balance as string)} ETH</p>
        <p>Gold : ${storePlayer?.gold}</p>
    </div>)
}