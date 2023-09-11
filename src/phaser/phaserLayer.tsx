import { useEffect } from "react";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { store } from "../store/store";
import { usePhaserLayer } from "../hooks/usePhaserLayer";
import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants";
import { useDojo } from "../hooks/useDojo";
import { mouseStore } from "../store/mouseStore";

type Props = {
    networkLayer: NetworkLayer | null;
};

// TODO: this is where we need to set the burner account from local storage.

export const PhaserLayer = ({ networkLayer }: Props) => {

    const { phaserLayer, ref } = usePhaserLayer({ networkLayer });

    const handleMouseMove = (e: any) => {
        // setTooltip({ show: true, x: e.clientX + 10, y: e.clientY + 10 });
        // const ex = e.clientX
        // const ey = e.clientY

        // const x = (ex + camera.phaserCamera.worldView.x) / 2;
        // const y = (ey + camera.phaserCamera.worldView.y) / 2
        // console.log("handleMouseMove camera", camera.phaserCamera.worldView);
        // console.log("handleMouseMove x=", ex, camera.phaserCamera.worldView.x);


        // const coord = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT)
        // const pixelPosition = tileCoordToPixelCoord({ x: 1, y: 1 }, TILE_WIDTH, TILE_HEIGHT);
        // console.log("handleMouseMove", x, y);
        // console.log("handleMouseMove pixelPosition", pixelPosition);
        // console.log("handleMouseMove ", e.clientX, e.clientY);
        mouseStore.setState({x: e.clientX,y: e.clientY,hover:true})
    };

    const handleMouseLeave = () => {
        console.log("handleMouseLeave");
        mouseStore.setState({x:0,y:0,hover:false})
        // setTooltip({ show: false, x: 0, y: 0 });
    };

    useEffect(() => {
        if (phaserLayer) {
            store.setState({ phaserLayer });

            console.log("Setting phaser layer");
        }
    }, [phaserLayer]);

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={ref}
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
            }}
        />
    );
};