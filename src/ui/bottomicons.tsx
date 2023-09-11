import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { positionToCoorp, toastError } from "../utils";
import { EntityIndex, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import twitter from "/twitterlogo.png"

export default function BottomIcons() {
    const {
        phaserLayer,
        networkLayer
    } = useDojo();
    const { account } = store()

    const {
        scenes: {
            Main: { camera },
        }
    } = phaserLayer;

    const center = () => {
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }

        const entityId = parseInt(account.address) as EntityIndex;
        const player_ = getComponentValue(networkLayer.components.Player, entityId);
        if(!player_){
            toastError("Start game first.")
            return;
        }
        const { x, y } = positionToCoorp(player_.position)
        const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
        camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
    }

    const gotoTwitter = () => {
        window.open("https://twitter.com/")
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <button onClick={() => center()}>Find Me</button>
            <img style={{ marginTop: 10 }} width={25} src={twitter} onClick={() => gotoTwitter()} />
        </ClickWrapper>)
}