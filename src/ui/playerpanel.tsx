import { EntityIndex, Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { useEffect, useState } from "react";
import { Player } from "../generated/graphql";
import { store } from "../store/store";
import { MAP_WIDTH } from "../phaser/constants";
import { positionToCoorp } from "../utils";

export default function PlayerPanel() {
    const { account, player: storePlayer } = store();
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

    const [player, setPlayer] = useState<Player>()
    const [position, setPosition] = useState<any>({ x: 0, y: 0 })

    useEffect(() => {
        if (!layer || !account) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValueStrict(Player, entity);

            if (account) {
                const entityId = parseInt(account.address) as EntityIndex;
                if (entity == entityId) {
                    store.setState({ player: player_ })
                } else {
                    return
                }
            }
            console.log("defineSystem account:" + account);
            if (player_) {
                setPlayer(player_)
            }
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)
            // const ycount = Math.floor(position / size)

            // var x = position % size
            // if (ycount % 2 == 0) {
            //     x = position % size
            // }
            // if (ycount % 2 == 1) {
            //     x = size - position % size
            // }
            // const y = ycount * 2 + 1
            // defineSystem position:5580,x=-31,y=61
            console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);

            setPosition({ x: x, y: y })
        });
    }, [layer, account])


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