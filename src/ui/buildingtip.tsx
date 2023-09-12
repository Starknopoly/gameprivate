import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { useDojo } from "../hooks/useDojo";
import { mouseStore } from "../store/mouseStore";
import { useEffect, useState } from "react";
import { store } from "../store/store";
import { buildingCoorpToPosition, hexToString } from "../utils";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
export default function BuildingTip() {
    const { buildings,camera,PlayerComponent } = store()
    const [tooltip, settooltip] = useState({ show: false, content: <></>, x: 0, y: 0 })

    // const { phaserLayer: {
    //     networkLayer: {
    //         components: { Player }
    //     },
    // } } = useDojo()

    const { x: ex, y: ey } = mouseStore()

    const getOwnerName = (currenLand: any) => {
        if (!currenLand) {
            return <span>0x000</span>
        }
        if (currenLand.type == 0) {
            return <span>You</span>
        }
        const entity = parseInt(currenLand?.owner) as EntityIndex;
        const player = getComponentValue(PlayerComponent, entity)
        return <span>{hexToString(player?.nick_name as string)}</span>
    }

    useEffect(() => {
        if(!camera){
            return
        }
        const x = (ex + camera.phaserCamera.worldView.x * 2) / 2;
        const y = (ey + camera.phaserCamera.worldView.y * 2) / 2;

        const coord = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT)
        const position = buildingCoorpToPosition(coord)
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