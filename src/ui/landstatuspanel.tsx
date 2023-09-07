import { useEffect, useMemo, useRef, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { store } from "../store/store";
import { Building } from "../types";
import { buildingIdToMapid, hexToString, positionToBuildingCoorp, truncateString } from "../utils";
import { Tileset } from "../artTypes/world";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";

export default function LandStatusPanel() {
    const { account, buildings, player } = store();

    const [currenLand, setCurrentLand] = useState<Building>()

    const accountRef = useRef<string>()
    // subscribe building change
    const {
        phaserLayer,
        networkLayer: {
            components: {
                Player: PlayerComponent,
                Land: LandComponent,
            },
            network: { graphSdk, wsClient }
        },
    } = useDojo();

    useEffect(() => {
        console.log("account change ", account?.address);
        accountRef.current = account?.address
    }, [account])

    useEffect(() => {
        const query = `subscription {
            entityUpdated{
              id
                keys
                componentNames
              updatedAt
            }
          }`;
        const subscription = wsClient
            .request({ query })
            // so lets actually do something with the response
            .subscribe({
                next({ data }) {
                    if (data) {
                        let entityUpdated = data.entityUpdated;
                        console.log("We got something:" + entityUpdated.componentNames);
                        if (entityUpdated.componentNames == LandComponent.metadata.name) {
                            fetchAllBuildings()
                        } else if (entityUpdated.componentNames == PlayerComponent.metadata.name) {
                            console.log("We got something player my account:" + accountRef.current + ",change account:" + entityUpdated.keys[0]);

                            if (entityUpdated.keys[0] != accountRef.current) {
                                fetchAllPlayers()
                            }
                        }
                        console.log("We got something!", data);
                    }
                },
            });
        return () => {
            subscription.unsubscribe()
        }
    }, [])


    const fetchAllPlayers = async () => {
        console.log("fetchAllPlayers");
        const allPlayers = await graphSdk.getAllPlayers()
        console.log("fetchAllPlayers allPlayers:");
        console.log(allPlayers);
        const edges = allPlayers.data.entities?.edges

        if (edges) {
            // console.log("fetchAllPlayers game total players:" + edges.length);
            for (let index = 0; index < edges.length; index++) {
                // console.log("fetchAllPlayers length", edges.length);
                const element = edges[index];
                const players = element?.node?.components
                // console.log(element?.node?.keys![0], element?.node?.components![0]?.__typename);
                if (players && players[0] && players[0].__typename == "Player") {
                    console.log(players[0]);
                    const player = players[0] as any
                    // console.log("fetchAllPlayers setComponent ", element.node?.keys![0]);
                    const entityId = parseInt(element.node?.keys![0]!) as EntityIndex
                    if (element.node?.keys![0] != accountRef.current) {
                        setComponent(PlayerComponent, entityId, {
                            position: player.position,
                            joined_time: player.joined_time,
                            direction: player.direction,
                            nick_name: player.nick_name,
                            gold: player.gold,
                            steps: player.steps,
                            last_point: player.last_point,
                            last_time: player.last_time
                        })
                    }
                    // getComponentValue()
                }
            }
        }
    }

    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        }
    } = phaserLayer;

    const fetchAllBuildings = async () => {
        console.log("fetchAllBuildings");
        const allBuildings = await graphSdk.getAllBuildings()
        console.log(allBuildings);
        const edges = allBuildings.data.entities?.edges
        if (!edges) {
            return
        }
        const bs = store.getState().buildings
        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            if (element) {
                if (element.node?.components) {
                    if (element.node.components[0]) {
                        const building = element.node.components[0]
                        if (building && building.__typename == "Land") {
                            const position = parseInt(element.node.keys![0]!, 16);
                            const type = building.building_type
                            const owner = building.owner
                            const price = building.price
                            const build = new Building(type, price, owner, position)
                            if (owner == account?.address) {
                                build.isMine = true;
                            }
                            // console.log(build);
                            bs.set(position, build)
                        }
                    }
                }
            }
        }
        store.setState({ buildings: bs })
    }

    useEffect(() => {
        console.log("buildings change size:" + buildings.size);
        buildings.forEach((build, position) => {
            const coord = positionToBuildingCoorp(position)
            const mapid = buildingIdToMapid(build.type)
            putTileAt({ x: coord.x, y: coord.y }, mapid, "Foreground");
            if (build.isMine) {
                console.log("buildings put is mine");
                putTileAt({ x: coord.x, y: coord.y }, Tileset.Heart, "Top");
            }
        })
    }, [buildings.keys()])

    useEffect(() => {
        if (!account) {
            return
        }
        fetchAllBuildings()
    }, [account])

    useEffect(() => {
        const build = buildings.get(player?.position)
        setCurrentLand(build)
    }, [player,buildings.keys()])



    const getOwnerName = useMemo(() => {
        if(!currenLand){
            return <span>0x000</span>
        }
        const entity = parseInt(currenLand?.owner) as EntityIndex;
        const player =  getComponentValue(PlayerComponent,entity)
        return <span>{hexToString(player?.nick_name)}</span>
    }, [currenLand])

    return (<div>
        <div style={{ width: 200, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Current Land</p>
            <p>Building : {currenLand ? <span>{currenLand.getName()}</span> : "None"}</p>
            <p>Owner : {getOwnerName}</p>
            <p>Price : {currenLand ? <span>${currenLand.price}</span> : "$0"}</p>
        </div>
    </div>)
}