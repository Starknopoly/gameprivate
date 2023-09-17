import { Tileset } from "../../artTypes/world";
import { PhaserLayer } from "..";
import { createNoise2D } from "simplex-noise";
import { MAP_WIDTH } from "../constants";
import { store } from "../../store/store";
import { playerStore } from "../../store/playerStore";
import { getRandomIntBetween } from "../../utils";
import { buildStore } from "../../store/buildstore";
import { Building } from "../../types";
import { LANDID_RESERVED, LandsOnChain } from "../../config";

export function mapSystem(layer: PhaserLayer) {
    const {
        scenes: {
            Main: {
                camera,
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    const noise = createNoise2D();
    const size = MAP_WIDTH

    store.setState({ camera: camera })
    playerStore.setState({ PlayerComponent: Player })

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            for (let index = 0; index < 2; index++) {
                //0,3,6,
                const yy = y * 3 + index;
                // console.log(yy);

                if (index == 0) {
                    const coord = { x, y: yy };
                    // const seed = noise(x, yy);
                    const seed = getRandomIntBetween(0, 1)
                    putTileAt(coord, Tileset.Grass, "Background");
                    // if (seed >= 0.3) {
                    //     putTileAt(coord, Tileset.Mountains, "Foreground");
                    // } else if (seed < -0.3) {
                    //     putTileAt(coord, Tileset.Forest, "Foreground");
                    // }

                    var position = y * size + x;
                    if (y % 2 == 0) {

                    } else {
                        // position = y * size - x;
                        position = y * size + size - x - 1;
                    }
                    const canBuild = LandsOnChain[position];
                    // console.log("postion:" + position + ",can:" + canBuild);
                    if (canBuild) {

                    } else {
                        if (seed == 0) {
                            putTileAt(coord, Tileset.Mountains, "Foreground");
                        } else {
                            putTileAt(coord, Tileset.Forest, "Foreground");
                        }
                    }

                } else {
                    const coord = { x, y: yy };
                    putTileAt(coord, Tileset.Road, "Foreground");
                }
            }
        }
    }

    for (let y = 0; y < size - 1; y++) {
        for (let x = 0; x < 2; x++) {
            if (x == 0) {
                for (let index = 0; index < 4; index++) {
                    if (y % 2 == 1) {
                        var yy = y * 3 + index + 1
                        var xx = x - 1
                        const coord = { x: xx, y: yy };
                        putTileAt(coord, Tileset.Stair, "Foreground");
                    }
                }
            } else {
                for (let index = 0; index < 4; index++) {
                    if (y % 2 == 0) {
                        var yy = y * 3 + index + 1
                        var xx = size
                        const coord = { x: xx, y: yy };
                        putTileAt(coord, Tileset.Stair, "Foreground");
                    }
                }
            }
        }
    }
    putTileAt({ x: 0, y: 0 }, Tileset.Mountains, "Foreground");
}