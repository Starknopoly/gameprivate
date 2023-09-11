import { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";

export default function TreasuryUI() {
    const { account,treasury } = store();
    const {
        networkLayer: {
            components,
            network: { graphSdk },
            systemCalls: { spawn },
        },
    } = useDojo();

    useEffect(()=>{
        if(!account){
            return
        }
        fetchTreasury()
    },[account])

    const fetchTreasury =async () => {
        const result = await graphSdk.getTownHallBalance()
        console.log("fetchTreasury : ",result);
        const gold = result.data.entities?.edges![0]?.node?.components![0] as any
        console.log(gold);
        store.setState({treasury:gold.gold})
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 200, height: 130, lineHeight: 0.9, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                <p>Treasury</p>
                <p>Balance : {treasury} Gold</p>
                <p>Price : 0.00001 ETH</p>
                <button>Buy Gold</button>
            </div>
        </ClickWrapper>
    )
}