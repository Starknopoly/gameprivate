import styled from "styled-components";
import { EnergyPrice, STARKBUCKS_ID } from "../config";
import { playerStore } from "../store/playerStore";
import { store } from "../store/store";
import { PlayerState } from "../types/playerState";
import { toastError, toastInfo, toastSuccess, toastWarning } from "../utils";
import { ClickWrapper } from "./clickWrapper";
import { Player } from "../generated/graphql";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useMemo, useState } from "react";
import { buildStore } from "../store/buildstore";
import { Player2Player } from "../types";

export default function BuyEnergyUI() {
    const { account, phaserLayer } = store();
    const { buildings } = buildStore()
    const { player, playerState } = playerStore()

    const [showBox, setShow] = useState(false)
    const [buyAmount, setBuyAmount] = useState(1)

    const {
        networkLayer: {
            components,
            systemCalls: { buyEnergy },
        },
    } = phaserLayer!;

    const clickBuyEnergy = async () => {
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }
        if (!player) {
            toastError("Start game first.")
            return
        }
        if (playerState != PlayerState.IDLE && playerState != PlayerState.WALK_END) {
            return
        }
        const postion = player.position
        const building = buildings.get(postion)

        if (building) {
            if (building.type != STARKBUCKS_ID) {
                toastWarning("Not Starkbucks")
                return
            }
        } else {
            toastWarning("No Starkbucks here")
            return
        }
        setBuyAmount(1)
        setShow(pre => !pre)
    }

    const buyConfirm = async () => {
        if (!account || !player) {
            return
        }

        if (player.gold < buyAmount * EnergyPrice) {
            toastWarning("Gold is not enough")
            return
        }
        toastInfo("Buy energy...")
        const events = await buyEnergy(account, buyAmount)
        console.log("Buy Energy result", events);
        if (events.length == 0) {
            toastError("Buy energy fail.Please refresh and try.")
        } else {
            const playerEvent = events[0] as Player;
            const entity = parseInt(events[0].entity.toString()) as EntityIndex;
            const player = Player2Player(playerEvent);
            player.entity = entity.toString();
            playerStore.setState({ player: player })
            toastSuccess("Buy energy success")
            setShow(false)
        }
    }

    const add = () => {
        setBuyAmount(pre => pre + 1)
    }

    const sub = () => {
        if (buyAmount > 1) {
            setBuyAmount(pre => pre - 1)
        }
    }

    return (
        <ClickWrapper>
            <BottomContainer>
                <button onClick={() => clickBuyEnergy()} style={{ marginTop: 15 }}>Buy Energy</button>
            </BottomContainer>
            <BuyBoxContainer>
                {
                    showBox &&
                    <div style={{ width: 200, height: 180, lineHeight: "16px", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                        <p >Buy Energy</p>
                        <p style={{ marginTop: "30px" }}>Price : $100/Energy</p>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px" }}>
                            <p style={{ marginRight: "10px" }}>Amount : </p>
                            <p style={{ cursor: "pointer" }} onClick={() => sub()}>-</p>
                            <p style={{ marginRight: "10px", marginLeft: "10px" }}>{buyAmount}</p>
                            <p style={{ cursor: "pointer" }} onClick={() => add()}>+</p>
                        </div>
                        <div style={{ display: "flex", gap: "0px", lineHeight: "0px", marginTop: "10px" }}>
                            <p style={{ marginRight: "20px" }}>Total : ${buyAmount * EnergyPrice}</p>
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
    bottom: 10%;
    right: 5%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;

const BottomContainer = styled.div`
    position: absolute;
    bottom: 25%;
    right: 3%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;