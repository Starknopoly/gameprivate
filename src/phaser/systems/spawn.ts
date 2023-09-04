import { EntityIndex, Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH, Animations, MAP_WIDTH } from "../constants";
import { store } from "../../store/store";

export const spawn = (layer: PhaserLayer) => {
    // const {account} = store()
    const {
        world,
        scenes: {
            Main: { objectPool, camera },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    // defineEnterSystem(world, [Has(Player)], ({ entity }) => {
    // //     const playerObj = objectPool.get(entity, "Sprite");
    // //     console.log("defineEnterSystem");

    // //     playerObj.setComponent({
    // //         id: 'animation',
    // //         once: (sprite) => {
    // //             sprite.play(Animations.SwordsmanIdle);
    // //         }
    // //     });
    // });

    defineSystem(world, [Has(Player)], ({ entity }) => {
        const player_ = getComponentValueStrict(Player, entity);
        const playerObj = objectPool.get(entity, "Sprite")
        const size = MAP_WIDTH

        const position = player_.position - 1
        const ycount = Math.floor(position / size)

        var x = position % size
        if (ycount % 2 == 0) {
            x = position % size

            playerObj.setComponent({
                id: 'animation',
                once: (sprite) => {
                    sprite.play(Animations.SwordsmanIdle);
                }
            });
        }
        if (ycount % 2 == 1) {
            x = size - position % size - 1

            playerObj.setComponent({
                id: 'animation',
                once: (sprite) => {
                    sprite.play(Animations.SwordsmanIdleReverse);
                }
            });
        }
        const y = ycount * 2 + 1
        // console.log("");
        
        // defineSystem position:5580,x=-31,y=61
        console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y+",ycount:"+ycount);

        const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
        // console.log("defineSystem");
        // console.log(entity.toString())
        // console.log(pixelPosition?.x, pixelPosition?.y)

        playerObj.setComponent({
            id: 'position',
            once: (sprite) => {
                sprite.setPosition(pixelPosition?.x, pixelPosition?.y);
                camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
            }
        })

    });
    // input.onKeyPress(
    //     keys => keys.has("SPACE"),
    //     () => {
    //         spawn(account);
    //     });
};