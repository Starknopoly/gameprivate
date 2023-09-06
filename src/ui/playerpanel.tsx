import { EntityIndex, Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { useEffect, useState } from "react";
import { Player } from "../generated/graphql";
import { store } from "../store/store";
import { Animations, MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { positionToCoorp } from "../utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";

export default function PlayerPanel() {
    const { account, player: storePlayer } = store();
    const { phaserLayer: layer } = useDojo()
    const {
        world,
        scenes: {
            Main: { objectPool, camera },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    const [player, setPlayer] = useState<Player>()
    const [position, setPosition] = useState<any>({ x: 0, y: 0 })

    useEffect(() => {
        if (!layer || !account) {
            return
        }
        console.log("defineSystem");

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValueStrict(Player, entity);
            const myEntityId = parseInt(account.address) as EntityIndex;

            if (entity == myEntityId) {
                store.setState({ player: player_ })
                setPlayer(player_)
                console.log("defineSystem player change is myself");
            }else{
                console.log("defineSystem player change not myself");
            }

            console.log("defineSystem account:" + account.address);

            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);
            const playerObj = objectPool.get(entity, "Sprite")

            const size = MAP_WIDTH

            const ycount = Math.floor(position / size)
            //1,4,7
            if (ycount % 2 == 0) {
                playerObj.setComponent({
                    id: 'animation',
                    once: (sprite) => {
                        sprite.play(Animations.SwordsmanIdle);
                    }
                });
            }
            if (ycount % 2 == 1) {
                playerObj.setComponent({
                    id: 'animation',
                    once: (sprite) => {
                        sprite.play(Animations.SwordsmanIdleReverse);
                    }
                });
            }

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
            playerObj.setComponent({
                id: 'position',
                once: (sprite) => {
                    sprite.setPosition(pixelPosition?.x, pixelPosition?.y);
                    // console.log("entity "+entity+",id:"+id);
                    if (entity == myEntityId) {
                        camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
                    }
                }
            })

            setPosition({ x: x, y: y })
        });
    }, [layer, account])


    return (
        <div>
            <div style={{ width: 200, height: 230, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                <p style={{ color: "white" }}>Player Status</p>
                <p>Money : ${player?.gold}</p>
                <p>Energy : {player?.steps}</p>
                <p>Postion : {position.x},{position.y}</p>
                <p>Bank : 0</p>
                <p>Hotel : 0</p>
                <p>Starkbucks : 0</p>
            </div>
        </div>)
}