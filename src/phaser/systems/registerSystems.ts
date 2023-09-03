import { PhaserLayer } from "..";
import { spawn } from "./spawn";
import { controls } from "./controls";
import { mapSystem } from "./mapSystem";

export const registerSystems = (layer: PhaserLayer) => {
    spawn(layer);
    controls(layer);
    mapSystem(layer)
};