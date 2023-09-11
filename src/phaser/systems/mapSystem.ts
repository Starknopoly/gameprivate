import { Tileset } from "../../artTypes/world";
import { PhaserLayer } from "..";
import { createNoise2D } from "simplex-noise";
import { MAP_WIDTH } from "../constants";

export function mapSystem(layer: PhaserLayer) {
    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        },
    } = layer;

    const noise = createNoise2D();
    const size = MAP_WIDTH



    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let index = 0; index < 2; index++) {
                //0,3,6,
                const yy = y * 3 + index;
                // console.log(yy);

                if (index == 0) {
                    const coord = { x, y: yy };
                    const seed = noise(x, yy);
                    putTileAt(coord, Tileset.Grass, "Background");
                    if (seed >= 0.3) {
                        putTileAt(coord, Tileset.Mountains, "Foreground");
                    } else if (seed < -0.3) {
                        putTileAt(coord, Tileset.Forest, "Foreground");
                    }
                } else {
                    const coord = { x, y: yy };
                    putTileAt(coord, Tileset.Road, "Foreground");
                }
            }
        }
    }

    for (let y = 0; y < size-1; y++) {
        for (let x = 0; x < 2; x++) {
            if (x == 0) {
                for (let index = 0; index < 4; index++) {
                    if (y % 2 == 1) {
                        var yy = y * 3 + index + 1
                        var xx = x -1
                        const coord = { x:xx, y: yy };
                        putTileAt(coord, Tileset.Stair, "Foreground");
                    }
                }
            } else {
                for (let index = 0; index < 4; index++) {
                    if (y % 2 == 0) {
                        var yy = y * 3 + index + 1
                        var xx = size
                        const coord = { x:xx, y: yy };
                        putTileAt(coord, Tileset.Stair, "Foreground");
                    }
                }
            }
        }

    }
    putTileAt({x:0,y:0}, Tileset.Stair, "Background");
}