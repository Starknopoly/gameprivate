import { PhaserLayer } from "..";
import { Direction } from "../../dojo/createSystemCalls";

export const controls = (layer: PhaserLayer) => {

    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { },
            account
        },
    } = layer;

    // input.onKeyPress(
    //     keys => keys.has("W"),
    //     () => {
    //         move(account, Direction.Up);
    //     });

    // input.onKeyPress(
    //     keys => keys.has("A"),
    //     () => {
    //         movetest(account, Direction.Left);
    //     }
    // );

    // input.onKeyPress(
    //     keys => keys.has("S"),
    //     () => {
    //         move(account, Direction.Down);
    //     }
    // );

    // input.onKeyPress(
    //     keys => keys.has("D"),
    //     () => {
    //         movetest(account, Direction.Right);
    //     }
    // );
};