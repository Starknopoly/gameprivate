import { useEffect, useMemo, useState } from "react";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";
import { EntityIndex, Has, defineSystem, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import {  hexToString, positionToCoorp, truncateString } from "../utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";

export default function NamesUI() {
    const { account } = store();
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
        if (!layer || !account) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValue(Player, entity);
            if(!player_){
                return;
            }
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);

            const nameObj = objectPool.get("text_" + entity, "Text")
            nameObj.setComponent({
                id: 'position',
                once: (text) => {
                    text.setPosition(pixelPosition?.x, pixelPosition?.y - 14);
                    text.setBackgroundColor("rgba(0,0,0,0.6)")
                    text.setFontSize(12)
                    const myId = parseInt(account?.address!) as EntityIndex
                    if (myId == entity) {
                        text.setBackgroundColor("rgba(255,0,0,0.6)")
                        text.setText("Me")
                    } else {
                        text.setText(hexToString(player_.nick_name));
                    }
                }
            })
        });
    }, [layer, account])


    return (<></>)
}