import { Tileset } from "../../artTypes/world";
import { PhaserLayer } from "..";
import { createNoise2D } from "simplex-noise";

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

    for (let x = -500; x < 500; x++) {
        for (let y = -500; y < 500; y++) {
            if (y % 2 == 0) {
                const coord = { x, y };
                const seed = noise(x, y);
                putTileAt(coord, Tileset.Grass, "Background");
                if (seed >= 0.3) {
                    putTileAt(coord, Tileset.Mountains, "Foreground");
                } else if (seed < -0.3) {
                    putTileAt(coord, Tileset.Forest, "Foreground");
                }
                const id = Math.ceil(seed * 100) % 12
                // console.log("id:"+id);
                
                if (id == 0) {
                    putTileAt(coord, Tileset.Bank, "Foreground");
                } else if (id == 1) {
                    putTileAt(coord, Tileset.Starkbucks, "Foreground");
                } else if (id == 2) {
                    putTileAt(coord, Tileset.Hotel, "Foreground");
                }
            } else {
                const coord = { x, y };
                putTileAt(coord, Tileset.Road, "Foreground");
            }
        }
    }

}