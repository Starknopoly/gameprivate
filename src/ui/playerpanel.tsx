import { Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { useEffect, useState } from "react";
import { Player } from "../generated/graphql";

export default function PlayerPanel() {
    const { phaserLayer: layer } = useDojo()
    const {
        world,
        scenes: {
            Main: { },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    const [player,setPlayer] = useState<Player>()
    const [position,setPosition] = useState<any>({x:0,y:0})

    useEffect(() => {
        if (!layer) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValueStrict(Player, entity);
            if(player_){
                setPlayer(player_)
            }

            const ycount = Math.floor(player_.position / 100)

            var x = player_.position % 100 - 50
            if (ycount % 2 == 0) {
                x = player_.position % 100 - 50
            }
            if (ycount % 2 == 1) {
                x = 50 - player_.position % 100 - 1
            }
            const y = ycount * 2 - 50 + 1
            // defineSystem position:5580,x=-31,y=61
            console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);


            setPosition({x:x,y:y})
        });
    }, [layer])


    return (
        <div>
            <div style={{ width: 200, height: 230, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                <p style={{ color: "white" }}>Player Status</p>
                <p>Money : ${player?.gold}</p>
                <p>Energy : {player?.steps}</p>
                <p>Postion : {position.x},{position.y}</p>
                <p>Bank : 0</p>
                <p>Hotel : 0</p>
                <p>Starkbucks : 0</p>
            </div>
        </div>)
}