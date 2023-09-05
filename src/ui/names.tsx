import { useEffect, useMemo, useState } from "react";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";
import { EntityIndex, Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { positionToCoorp, truncateString } from "../utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";

export default function NamesUI() {
    const { account, player: storePlayer, playersAddress } = store();
    const { phaserLayer: layer } = useDojo()
    const {
        world,
        scenes: {
            Main: { objectPool },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    useEffect(() => {
        console.log("nameui playersAddress change");
        // console.log(playersAddress);
        playersAddress?.forEach((value, key) => {
            const player_ = getComponentValueStrict(Player, key);
            const nameObj = objectPool.get("text_" + key, "Text")
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
            nameObj.setComponent({
                id: 'position',
                once: (text) => {
                    text.setPosition(pixelPosition?.x, pixelPosition?.y - 14);
                    text.setBackgroundColor("rgba(0,0,0,0.6)")
                    text.setFontSize(12)
                    const entity = parseInt(account?.address!) as EntityIndex
                    if (entity == key) {
                        console.log("set name me");
                        text.setText("Me")
                    } else {
                        text.setText(truncateString(value, 4, 3))
                    }
                }
            })
        })
    }, [playersAddress])

    useEffect(() => {
        if (!layer || !account) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValueStrict(Player, entity);
            const nameObj = objectPool.get("text_" + entity, "Text")
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
            nameObj.setComponent({
                id: 'position',
                once: (text) => {
                    text.setPosition(pixelPosition?.x, pixelPosition?.y - 14);
                }
            })
        });
    }, [layer, account])


    return (<></>)
}