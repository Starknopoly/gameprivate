import { Has, defineEnterSystem, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH, Animations } from "../constants";

export const spawn = (layer: PhaserLayer) => {
    const {
        world,
        scenes: {
            Main: { objectPool, camera },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { spawn },
            account
        },
    } = layer;

    defineEnterSystem(world, [Has(Player)], ({ entity }) => {
        const playerObj = objectPool.get(entity, "Sprite");
        console.log("defineEnterSystem");

        playerObj.setComponent({
            id: 'animation',
            once: (sprite) => {
                sprite.play(Animations.SwordsmanIdle);
            }
        });
    });

    defineSystem(world, [Has(Player)], ({ entity }) => {
        const player_ = getComponentValueStrict(Player, entity);

        const ycount = Math.floor(player_.position / 100)

        var x = player_.position % 100 - 50
        if (ycount % 2 == 0) {
            x = player_.position % 100 - 50
        }
        if (ycount % 2 == 1) {
            x = 50 - player_.position % 100 - 1
        }
        const y = ycount * 2 - 50 + 1

        console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);

        const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
        console.log("defineSystem");
        console.log(entity.toString())
        console.log(pixelPosition?.x, pixelPosition?.y)

        const player = objectPool.get(entity, "Sprite")

        player.setComponent({
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