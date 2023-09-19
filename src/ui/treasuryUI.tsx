import { useEffect, useMemo, useState } from "react";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import styled from "styled-components";
import { playerStore } from "../store/playerStore";
import { calTotal, toastError, toastInfo, toastSuccess, toastWarning } from "../utils";
import { ethers } from "ethers";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { ETH, Player } from "../dojo/createSystemCalls";

export default function TreasuryUI() {
    const { account, treasury, networkLayer } = store();
    const [showBox, setShow] = useState(false)
    const [buyAmount, setBuyAmount] = useState<number>(1)
    const { player,PlayerComponent,eth } = playerStore()

    const {
        network: { graphSdk },
        systemCalls: { buyGold },
    } = networkLayer!

    useEffect(() => {
        if (!account) {
            return
        }
        fetchTreasury()
    }, [account])

    const fetchTreasury = async () => {
        const result = await graphSdk.getTownHallBalance()
        console.log("fetchTreasury : ", result);
        const gold = result.data.entities?.edges![0]?.node?.components![0] as any
        console.log(gold);
        store.setState({ treasury: gold.gold })
    }

    const buyConfirm = async () => {
        if (!account || !player) {
            return
        }
        if (buyAmount == 0) {
            toastWarning("Can't buy zero")
            return
        }
        if (buyAmount > 10000) {
            toastWarning("Can't buy more than 10000gold")
            return
        }
        if(eth<calTotal(treasury,buyAmount)){
            toastWarning("ETH is not enough")
            return
        }
        toastInfo("Buy Gold...")
        const result = await buyGold(account, buyAmount)
        console.log("buyConfirm", result);
        if (result && result.length > 0) {
            toastSuccess("Buy Gold Success!")
            const playerEvent = result[0] as Player
            const entity = parseInt(account.address) as EntityIndex
            setComponent(PlayerComponent, entity, {
                banks: playerEvent.banks,
                nick_name: playerEvent.nick_name,
                position: playerEvent.position,
                joined_time: playerEvent.joined_time,
                direction: playerEvent.direction,
                gold: playerEvent.gold,
                steps: playerEvent.steps,
                last_point: playerEvent.last_point,
                last_time: playerEvent.last_time,
                total_steps: playerEvent.total_steps,
                total_used_eth:playerEvent.total_used_eth
            });
            const eth = result[1] as ETH
            playerStore.setState({eth:eth.balance})
        } else {
            toastError("Buy Failed")
        }
        setShow(false)
    }


    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        // setNickName(value);
        if (value) {
            setBuyAmount(parseFloat(value))
        } else {
            setBuyAmount(0)
        }
    }

    const getPrice = useMemo(() => {
        var amount = buyAmount
        var gold = treasury
        if (amount == 0) {
            amount = 1
        }
        if (gold == 0) {
            return 0
        }
        const eth_need = calTotal(gold, amount)
        const price = eth_need / BigInt(amount)
        return parseFloat(ethers.utils.formatEther(price)).toFixed(6)
    }, [buyAmount, treasury])

    const getTotal = useMemo(() => {
        if (buyAmount == 0 || treasury == 0) {
            return 0
        }
        const eth_need = calTotal(treasury, buyAmount)
        return parseFloat(ethers.utils.formatEther(eth_need)).toFixed(6)
    }, [treasury, buyAmount])


    const clickBuy = ()=>{
        setShow(pre => !pre)
        setBuyAmount(1)
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 200, height: 130, lineHeight: 0.9, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                <p>Treasury</p>
                <p>Balance : {treasury} Gold</p>
                <p>Price : 0.00001 ETH</p>
                <button onClick={() => clickBuy()}>Buy Gold</button>
            </div>
            <BuyBoxContainer>
                {
                    showBox &&
                    <div style={{ width: 200, height: 180, lineHeight: "16px", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                        <p >Buy Gold</p>
                        <p style={{ marginTop: "30px" }}>Price : {getPrice} e</p>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px" }}>
                            <p style={{ marginRight: "10px" }}>Amount : </p>
                            <input value={buyAmount} style={{ width: 100 }} onChange={inputChange} type="number" />
                        </div>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px", marginTop: "10px" }}>
                            <p style={{ marginRight: "20px" }}>Total : {getTotal} e</p>
                            <button onClick={() => buyConfirm()}>Buy</button>
                        </div>
                    </div>
                }

            </BuyBoxContainer>
        </ClickWrapper>
    )
}

const BuyBoxContainer = styled.div`
    position: absolute;
    bottom: -130px;
    right: 150px;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;
