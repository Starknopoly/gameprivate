import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { positionToCoorp, toastError } from "../utils";
import { EntityIndex, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import twitter from "/twitterlogo.png"
import telegram from "/telegram.png"

export default function BottomIcons() {
    const { account,phaserLayer } = store()

    const {
        scenes: {
            Main: { camera },
        },
        networkLayer
    } = phaserLayer!;

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
        window.open("https://twitter.com/stark_nopoly/")
    }

    const gotoTelegram = () => {
        window.open("https://t.me/starknopoly")
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>

            <button onClick={() => center()}>Zoom to Me</button>
            <div>
            <img style={{cursor:"pointer", marginTop: 15,marginRight:10 }} width={25} src={twitter} onClick={() => gotoTwitter()} />
            <img style={{cursor:"pointer", marginTop: 15 }} width={25} src={telegram} onClick={() => gotoTelegram()} />
            </div>

        </ClickWrapper>)
}