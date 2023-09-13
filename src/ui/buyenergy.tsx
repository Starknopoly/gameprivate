import { STARKBUCKS_ID } from "../config";
import { actionStore } from "../store/actionstore";
import { playerStore } from "../store/playerStore";
import { store } from "../store/store";
import { PlayerState } from "../types/playerState";
import { toastError, toastWarning } from "../utils";
import { ClickWrapper } from "./clickWrapper";

export default function BuyEnergy() {
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
            systemCalls: { buyBuilding },
        },
    } = phaserLayer!;

    const buyEnergy = async () => {
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
            if (building.type == STARKBUCKS_ID) {

            } else {
                toastWarning("Not Starkbucks")
                return
            }
        } else {
            toastWarning("No Starkbucks here")
            return
        }
    }

    return (
        <ClickWrapper>
            <div>
                <button onClick={() => buyEnergy()} style={{ marginTop: 15 }}>Buy Energy</button>
            </div>
        </ClickWrapper>
    )
}