import styled from "styled-components";
import { STARKBUCKS_ID } from "../config";
import { actionStore } from "../store/actionstore";
import { playerStore } from "../store/playerStore";
import { store } from "../store/store";
import { PlayerState } from "../types/playerState";
import { toastError, toastSuccess, toastWarning } from "../utils";
import { ClickWrapper } from "./clickWrapper";
import { Player } from "../generated/graphql";
import { EntityIndex, setComponent } from "@latticexyz/recs";

export default function BuyEnergyUI() {
    const { account, buildings, phaserLayer } = store();
    const { actions } = actionStore()
    const { player, playerState } = playerStore()

    const {
        scenes: {
            Main: {
                camera,
                maps: {
                    Main: { putTileAt },
                },
            },
        },
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

        const events = await buyEnergy(account,1)
        console.log("Buy Energy result",events);
        if(events.length==0){
            toastError("Buy energy fail.Please refresh and try.")
        }else{
            const playerEvent = events[0] as Player;
            const entity = parseInt(events[0].entity.toString()) as EntityIndex;
            setComponent(components.Player, entity, {
                banks:playerEvent.banks,
                nick_name: playerEvent.nick_name,
                position: playerEvent.position,
                joined_time: playerEvent.joined_time,
                direction: playerEvent.direction,
                gold: playerEvent.gold,
                steps: playerEvent.steps,
                last_point: playerEvent.last_point,
                last_time: playerEvent.last_time,
            });
            toastSuccess("Buy energy success")
        }
    }

    return (
        <ClickWrapper>
            <BottomContainer>
                <button onClick={() => clickBuyEnergy()} style={{ marginTop: 15 }}>Buy Energy</button>
            </BottomContainer>
        </ClickWrapper>
    )
}


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