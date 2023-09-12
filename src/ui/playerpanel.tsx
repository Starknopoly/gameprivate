import { EntityIndex, Has, defineSystem, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { useEffect, useRef, useState } from "react";

import { store } from "../store/store";
import { Animations, MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { hexToString, positionToCoorp } from "../utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { BANK_ID, HOTEL_ID, STARKBUCKS_ID } from "../config";

export default function PlayerPanel() {
    const { account, player: storePlayer, buildings } = store();
    const { phaserLayer: layer } = useDojo()

    const spriteListen = useRef<Map<EntityIndex, boolean>>(new Map())
    const [bankAmount, setBank] = useState(0)
    const [hotelAmount, setHotel] = useState(0)
    const [bucksAmount, setBucks] = useState(0)

    const {
        world,
        game,
        scenes: {
            Main: { objectPool, camera, maps },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    useEffect(() => {
        if (!layer || !account) {
            return
        }
        console.log("defineSystem");

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValue(Player, entity);
            if (!player_) {
                return;
            }
            const myEntityId = parseInt(account.address) as EntityIndex;

            if (entity == myEntityId) {
                console.log("playerpanel is myself nick name", player_.nick_name);
                store.setState({ player: player_ })
            }

            // console.log("defineSystem account:" + account.address);

            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            // console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);
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
                    // console.log("player obj:",entity, sprite,sprite.width);
                    sprite.setPosition(pixelPosition?.x, pixelPosition?.y);
                    // console.log("entity "+entity+",id:"+id);
                    if (entity == myEntityId) {
                        camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
                    }
                    if (sprite.width > 1) {
                        setHoverListener(entity, sprite)
                    }
                }
            })
        });
    }, [layer, account])

    const setHoverListener = (entity: EntityIndex, sprite: Phaser.GameObjects.Sprite) => {
        if (spriteListen.current.get(entity)) {
            return
        }
        spriteListen.current.set(entity, true)
        // console.log("setHoverListener ",sprite);

        sprite.setInteractive()
        sprite.on('pointerover', function (pointer: any) {
            console.log('Mouse is over the sprite!' + entity);
            // store.setState({ tooltip: { show: true, x: e.clientX + 10, y: e.clientY + 10 } })
            const player_ = getComponentValue(Player, entity);
            if (player_) {
                const position = player_.position - 1
                const { x, y } = positionToCoorp(position)
                const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
                console.log("pointerover", position, x, y, pixelPosition);
                console.log("camera", camera.phaserCamera.worldView);
                console.log("camera zoom", camera.phaserCamera.zoom, game.scale);

                const px = 2 * (pixelPosition.x - camera.phaserCamera.worldView.x)
                const py = 2 * (pixelPosition.y - camera.phaserCamera.worldView.y)
                console.log("px,py", px, py);

                store.setState({
                    tooltip: {
                        show: true, x: px + 40, y: py - 60, content: <><p>{hexToString(player_.nick_name)}</p>
                            <p>Gold : ${player_.gold}</p></>
                    }
                })
            }
        });
        sprite.on('pointerout', function (pointer: any) {
            console.log('Mouse left the sprite!' + entity);
            store.setState({ tooltip: { show: false, x: 0, y: 0, content: null } })
        });
    }

    useEffect(() => {
        console.log("building change size:"+buildings.size);
        var bank = 0
        var hotel = 0
        var starkbucks = 0        
        buildings.forEach((build, _) => {
            if (build.owner == account?.address) {
                switch (build.type) {
                    case BANK_ID: bank++; break;
                    case HOTEL_ID: hotel++; break;
                    case STARKBUCKS_ID: starkbucks++; break;
                }
            }
        })
        setBucks(starkbucks)
        setBank(bank)
        setHotel(hotel)
    }, [buildings.keys()])

    return (
        <div>
            <div style={{ width: 200, height: 230, lineHeight: 0.9, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                {/* <p style={{ color: "white" }}>Player Status</p> */}
                <p>Name : {hexToString(storePlayer?.nick_name)}</p>
                <p>Gold : ${storePlayer?.gold}</p>
                <p>Energy : {storePlayer?.steps}</p>
                <p>Postion : {storePlayer?.position}</p>
                <p>Bank : {bankAmount}</p>
                <p>Hotel : {hotelAmount}</p>
                <p>Starkbucks : {bucksAmount}</p>
            </div>
        </div>)
}