import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { ClickWrapper } from "./clickWrapper";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { useDojo } from "../hooks/useDojo";
import { mouseStore } from "../store/mouseStore";
import { useEffect } from "react";

export default function BuildingTip() {
    const { phaserLayer: {
        world,
        game,
        scenes: {
            Main: { objectPool, camera, maps },
        },
        networkLayer: {
            components: { Player }
        },
    } } = useDojo()

    const { x: ex, y: ey } = mouseStore()

    useEffect(() => {
        // const x = 2 * (pixelPosition.px - camera.phaserCamera.worldView.x)
        // const y = 2 * (pixelPosition.py - camera.phaserCamera.worldView.y)

        const x = (ex + camera.phaserCamera.worldView.x) / 2;
        const y = (ey + camera.phaserCamera.worldView.y) / 2
        console.log("handleMouseMove camera", camera.phaserCamera.worldView);
        console.log("handleMouseMove x=", ex, camera.phaserCamera.worldView.x);


        const coord = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT)
        const pixelPosition = tileCoordToPixelCoord({ x: 1, y: 1 }, TILE_WIDTH, TILE_HEIGHT);
        console.log("handleMouseMove", x, y);
        console.log("handleMouseMove pixelPosition", pixelPosition);
        console.log("handleMouseMove ", ex, ey, coord);
    }, [ex, ey])

    return (
        <div
        >
        </div>)
}