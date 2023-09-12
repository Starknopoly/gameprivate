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
        mouseStore.setState({x: e.clientX,y: e.clientY})
    };

    const handleMouseLeave = () => {
        console.log("handleMouseLeave");
        mouseStore.setState({x:0,y:0})
    };

    useEffect(() => {
        if (phaserLayer) {
            store.setState({ phaserLayer });

            console.log("Setting phaser layer");
        }
    }, [phaserLayer]);

    return (
        <div
            // onMouseMove={handleMouseMove}
            // onMouseLeave={handleMouseLeave}
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