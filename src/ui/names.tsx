import { useEffect, useMemo, useState } from "react";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";
import { EntityIndex, Has, defineSystem, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { positionToCoorp, truncateString } from "../utils";
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

    // useEffect(() => {
    //     console.log("nameui playersAddress change");
    //     // console.log(playersAddress);
    //     playersAddress?.forEach((value, key) => {
    //         // console.log("name value:"+value);
    //         console.log(key,value);
    //         const player_ = getComponentValue(Player, key);
    //         if(!player_){
    //             return
    //         }
    //         const nameObj = objectPool.get("text_" + key, "Text")
    //         const position = player_.position - 1
    //         const { x, y } = positionToCoorp(position)

    //         const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    //         nameObj.setComponent({
    //             id: 'position',
    //             once: (text) => {
    //                 text.setPosition(pixelPosition?.x, pixelPosition?.y - 14);
    //                 text.setBackgroundColor("rgba(0,0,0,0.6)")
    //                 text.setFontSize(12)
    //                 const entity = parseInt(account?.address!) as EntityIndex
    //                 // console.log("entity:"+entity+",key:"+key);
    //                 if (entity == key) {
    //                     text.setBackgroundColor("rgba(255,0,0,0.6)")
    //                     text.setText("Me")
    //                 } else {
    //                     text.setText(truncateString(value, 4, 3))
    //                 }
    //             }
    //         })
    //     })
    // }, [playersAddress.keys()])

    useEffect(() => {
        if (!layer || !account) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValue(Player, entity);
            if(!player_){
                return;
            }
            const nameObj = objectPool.get("text_" + entity, "Text")
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
            nameObj.setComponent({
                id: 'position',
                once: (text) => {
                    text.setPosition(pixelPosition?.x, pixelPosition?.y - 14);
                    const key = parseInt(account?.address!) as EntityIndex
                    if (entity == key) {
                        text.setText("Me")
                    }
                }
            })
        });
    }, [layer, account])


    return (<></>)
}