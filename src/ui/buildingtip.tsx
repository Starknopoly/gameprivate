import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { ClickWrapper } from "./clickWrapper";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { useDojo } from "../hooks/useDojo";
import { mouseStore } from "../store/mouseStore";
import { useEffect, useState } from "react";
import { store } from "../store/store";
import { buildingCoorpToPosition, hexToString } from "../utils";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { ReactNode } from "react";
export default function BuildingTip() {
    const { buildings } = store()
    const [tooltip, settooltip] = useState({ show: false, content: <></>, x: 0, y: 0 })
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

    const getOwnerName = (currenLand: any) => {
        if (!currenLand) {
            return <span>0x000</span>
        }
        if (currenLand.type == 0) {
            return <span>You</span>
        }
        const entity = parseInt(currenLand?.owner) as EntityIndex;
        const player = getComponentValue(Player, entity)
        return <span>{hexToString(player?.nick_name)}</span>
    }

    useEffect(() => {
        // const x = 2 * (pixelPosition.px - camera.phaserCamera.worldView.x)
        // const y = 2 * (pixelPosition.py - camera.phaserCamera.worldView.y)
        // console.log("handleMouseMove ex,ey",ex,ey);

        const x = (ex + camera.phaserCamera.worldView.x * 2) / 2;
        const y = (ey + camera.phaserCamera.worldView.y * 2) / 2;
        // console.log("handleMouseMove camera:", camera.phaserCamera.worldView);

        const coord = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT)
        // const pixelPosition = tileCoordToPixelCoord({ x: 1, y: 1 }, TILE_WIDTH, TILE_HEIGHT);
        // console.log("handleMouseMove x:", x, y);
        // console.log("handleMouseMove pixelPosition", pixelPosition);
        // console.log("handleMouseMove coord:", coord);
        const position = buildingCoorpToPosition(coord)
        console.log("handleMouseMove", coord, position);
        const building = buildings.get(position)
        if (building && building.enable) {
            settooltip({
                show: true, x: ex + 80, y: ey - 40, content: <div>
                    <p>{building.getName()}</p>
                    <p>Owner : {getOwnerName(building)}</p>
                    <p>Price : ${building.price}</p>
                </div>

            })
        } else {
            settooltip({ show: false, x: 0, y: 0, content: <></> })
        }
    }, [ex, ey])

    return (
        <div>
            {tooltip.show && (
                <div
                    className="tooltip"
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                >
                    {
                        tooltip.content
                    }
                </div>
            )}
        </div>
    )
}