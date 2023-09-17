import { useEffect, useState } from "react";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import styled from "styled-components";
import { playerStore } from "../store/playerStore";
import { EnergyPrice } from "../config";

export default function TreasuryUI() {
    const { account, treasury, networkLayer } = store();
    const [showBox, setShow] = useState(false)
    const [buyAmount,setBuyAmount] = useState<number>(0)
    const { player, playerState } = playerStore()
    const price = 0.0001

    const {
        network: { graphSdk }
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
    }

    const buyGold = async () => {
        setShow(pre=>!pre)
    }

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        // setNickName(value);
        setBuyAmount(parseFloat(value))
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 200, height: 130, lineHeight: 0.9, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                <p>Treasury</p>
                <p>Balance : {treasury} Gold</p>
                <p>Price : 0.00001 ETH</p>
                <button onClick={() => buyGold()}>Buy Gold</button>
            </div>
            <BuyBoxContainer>
                {
                    showBox &&
                    <div style={{ width: 200, height: 180, lineHeight: "16px", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                        <p >Buy Gold</p>
                        <p style={{ marginTop: "30px" }}>Price : 0.00001 e</p>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px" }}>
                            <p style={{ marginRight: "10px" }}>Amount : </p>
                            {/* <p style={{cursor:"pointer"}} onClick={()=>sub()}>-</p> */}
                            <input value={buyAmount} style={{width:100}} onChange={inputChange} type="number"/>
                            {/* <p style={{ marginRight: "10px", marginLeft: "10px" }}>{buyAmount}</p> */}
                            {/* <p style={{cursor:"pointer"}} onClick={()=>add()}>+</p> */}
                        </div>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px",marginTop:"10px" }}>
                            <p style={{ marginRight: "20px" }}>Total : {(buyAmount*price).toFixed(5)} e</p>
                            <button onClick={()=>buyConfirm()}>Buy</button>
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
