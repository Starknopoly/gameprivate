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
            if(y%2==0){
                const coord = { x, y };
                const seed = noise(x, y);
    
                putTileAt(coord, Tileset.Grass, "Background");
                // [-1,1]
                if (seed >= 0.3) {
                    putTileAt(coord, Tileset.Mountains, "Foreground");
                } else if (seed < -0.3) {
                    putTileAt(coord, Tileset.Forest, "Foreground");
                }
            }else{
                const coord = { x, y };
                putTileAt(coord, Tileset.Road, "Foreground");
            }
        }
    }

}