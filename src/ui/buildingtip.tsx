import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { mouseStore } from "../store/mouseStore";
import { useEffect, useState } from "react";
import { store } from "../store/store";
import { buildingCoorpToPosition, hexToString } from "../utils";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { tipStore } from "../store/tipStore";
import { playerStore } from "../store/playerStore";
import { buildStore } from "../store/buildstore";
import { LANDID_RESERVED } from "../config";
import { Building } from "../types";
export default function BuildingTip() {
    const { camera } = store()
    const {buildings} = buildStore()
    const {PlayerComponent} = playerStore()
    const { tooltip:ptooltip } = tipStore();
    const [tooltip, settooltip] = useState({ show: false, content: <></>, x: 0, y: 0 })

    const { x: ex, y: ey } = mouseStore()

    const getOwnerName = (currenLand: Building) => {
        if (!currenLand) {
            return <span>0x000</span>
        }
        const entity = parseInt(currenLand?.owner) as EntityIndex;
        const player = getComponentValue(PlayerComponent, entity)
        return <span>{hexToString(player?.nick_name as string)}</span>
    }

    useEffect(() => {
        if (!camera) {
            return
        }
        const x = (ex + camera.phaserCamera.worldView.x * 2) / 2;
        const y = (ey + camera.phaserCamera.worldView.y * 2) / 2;

        const coord = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT)
        const position = buildingCoorpToPosition(coord)
        const building = buildings.get(position)
        // console.log("hover 1:",ex,ey,x,y);
        // console.log("hover 2:",coord,position);
        
        if (building && building.enable && building.type!=LANDID_RESERVED) {
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

            {ptooltip.show && (
                <div
                    className="tooltip"
                    style={{ left: `${ptooltip.x}px`, top: `${ptooltip.y}px` }}
                >
                    {
                        ptooltip.content
                    }
                </div>
            )}

        </div>
    )
}