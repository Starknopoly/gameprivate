import { useEffect, useMemo, useRef, useState } from "react";
import { store } from "../store/store";
import { Building, Player2Player } from "../types";
import { buildingIdToMapid, hexToString, positionToBuildingCoorp } from "../utils";
import { Tileset } from "../artTypes/world";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { playerStore } from "../store/playerStore";
import { buildStore } from "../store/buildstore";
import { LANDID_RESERVED, LandsOnChain } from "../config";

export default function LandStatusPanel() {
    const { account, phaserLayer } = store();
    const { buildings } = buildStore()
    const { player: storePlayer, players: storePlayers } = playerStore()
    const [currenLand, setCurrentLand] = useState<Building>()

    const accountRef = useRef<string>()

    const {
        scenes: {
            Main: { maps: {
                Main: { putTileAt },
            } },
        },
        networkLayer: {
            components: {
                Player: PlayerComponent,
                Land: LandComponent,
            },
            network: { graphSdk, wsClient }
        }
    } = phaserLayer!

    useEffect(() => {
        if (!account) {
            return
        }
        console.log("account change ", account?.address);
        accountRef.current = account?.address
        initMap()
    }, [account])

    const initMap = () => {
        const map = new Map<number, Building>()
        for (let index = 0; index < LandsOnChain.length; index++) {
            const element = LandsOnChain[index];
            if (!element) {
                const b = new Building(LANDID_RESERVED, 0, "", index);
                map.set(index, b);
            }
        }
        buildStore.setState({ buildings: map })
    }

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
                next({ data }: any) {
                    if (data) {
                        let entityUpdated = data.entityUpdated;
                        console.log("We got something:" + entityUpdated.componentNames);
                        console.log(entityUpdated);

                        if (entityUpdated.componentNames == LandComponent.metadata.name) {
                            fetchSingleBuilding(entityUpdated.keys[0])
                        } else if (entityUpdated.componentNames == PlayerComponent.metadata.name) {
                            console.log("We got something player my account:" + accountRef.current + ",change account:" + entityUpdated.keys[0]);

                            if (entityUpdated.keys[0] != "0x0" && entityUpdated.keys[0] != accountRef.current) {
                                // fetchAllPlayers()
                                fetchPlayerInfo(entityUpdated.keys[0])
                            }
                        } else if (entityUpdated.componentNames == "Townhall,Land" || entityUpdated.componentNames == "Townhall") {
                            fetchTreasury()
                        }
                        console.log("We got something!", data);
                    }
                },
            });
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchTreasury = async () => {
        const result = await graphSdk.getTownHallBalance()
        console.log("fetchTreasury : ", result);
        const gold = result.data.entities?.edges![0]?.node?.components![0] as any
        console.log(gold);
        store.setState({ treasury: gold.gold })
    }

    const fetchPlayerInfo = async (entity: string) => {
        const playerInfo = await graphSdk.getPlayerByKey({ key: entity })
        console.log("fetchPlayerInfo", playerInfo);
        const edges = playerInfo.data.entities?.edges

        if (edges) {
            // console.log("fetchPlayerInfo game total players:" + edges.length);
            for (let index = 0; index < edges.length; index++) {
                // console.log("fetchPlayerInfo length", edges.length);
                const element = edges[index];
                const players = element?.node?.components
                // console.log(element?.node?.keys![0], element?.node?.components![0]?.__typename);
                if (players && players[0] && players[0].__typename == "Player" && players[0].last_time != 0) {
                    console.log(players[0]);
                    if (element.node?.keys![0] == "0x0" || element.node?.keys![0] == accountRef.current) {
                        continue
                    }
                    const player = players[0] as any
                    const entityId = parseInt(element.node?.keys![0]!) as EntityIndex

                    // const temp = new Map(storePlayers);
                    // const player_ = Player2Player(player)
                    // player_.entity = entityId.toString()
                    // temp.set(entityId, player_)
                    // playerStore.setState({ players: temp })
                    // players.set(entityId,player_)

                    setComponent(PlayerComponent, entityId, {
                        banks: player.banks,
                        position: player.position,
                        joined_time: player.joined_time,
                        direction: player.direction,
                        nick_name: player.nick_name,
                        gold: player.gold,
                        steps: player.steps,
                        last_point: player.last_point,
                        last_time: player.last_time,
                        total_steps: player.total_steps,
                    })
                }
            }
        }
    }

    const fetchSingleBuilding = async (entity: string) => {
        console.log("fetchSingleBuilding " + entity);
        const building = await graphSdk.getBuildingByKey({ key: entity })
        console.log("fetchSingleBuilding ", building);
        const edges = building.data.entities?.edges
        if (!edges) {
            return
        }
        handleBuildEdges(edges)
    }

    const handleBuildEdges = (edges: any) => {
        const bs = buildStore.getState().buildings
        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            const building = element?.node?.components![0];
            if (building && building.__typename == "Land") {
                const position = parseInt(element?.node?.keys![0]!, 16);
                const type = building.building_type
                var owner = building.owner
                var price = building.price
                const bomb = building.bomb
                if (bomb) {
                    price = building.bomb_price
                }
                const build = new Building(type, price, owner, position)
                if (bomb) {
                    console.log("is bomb price:" + building.bomb_price);
                    owner = building.bomber
                }
                if (owner == accountRef.current) {
                    build.isMine = true;
                }
                if (type == 0) {
                    build.enable = bomb
                    bs.set(position, build)
                } else {
                    bs.set(position, build)
                }
            }
        }
        buildStore.setState({ buildings: bs })
    }


    const fetchAllBuildings = async () => {
        const allBuildings = await graphSdk.getAllBuildings()
        console.log("fetchAllBuildings");
        console.log(allBuildings);
        const edges = allBuildings.data.entities?.edges
        if (!edges) {
            return
        }
        handleBuildEdges(edges)
    }

    useEffect(() => {
        console.log("buildings change size:" + buildings.size);
        buildings.forEach((build, position) => {
            if (build.type != LANDID_RESERVED) {
                const coord = positionToBuildingCoorp(position)
                const mapid = buildingIdToMapid(build.type)
                if (build.enable) {
                    putTileAt({ x: coord.x, y: coord.y }, Tileset.Num0 + build.getLevel(), "Level");
                    putTileAt({ x: coord.x, y: coord.y }, mapid, "Foreground");
                } else {
                    putTileAt({ x: coord.x, y: coord.y }, Tileset.NoHeart, "Foreground");
                    putTileAt({ x: coord.x, y: coord.y }, Tileset.NoHeart, "Level");
                }
                if (build.isMine) {
                    putTileAt({ x: coord.x, y: coord.y }, Tileset.Heart, "Top");
                } else {
                    putTileAt({ x: coord.x, y: coord.y }, Tileset.NoHeart, "Top");
                }
            }
        })
    }, [buildings.values()])

    useEffect(() => {
        if (!account) {
            return
        }
        fetchAllBuildings()
    }, [account])

    useEffect(() => {
        console.log("current land change");
        if (!storePlayer) {
            return
        }
        const build = buildings.get(storePlayer.position)
        setCurrentLand(build)
    }, [storePlayer, buildings.values()])

    const getOwnerName = useMemo(() => {
        if (!currenLand) {
            return <span>0x000</span>
        }
        if (currenLand.type == 0) {
            return <span>You</span>
        }
        const entity = parseInt(currenLand?.owner) as EntityIndex;
        const player = getComponentValue(PlayerComponent, entity)
        return <span>{hexToString(player?.nick_name)}</span>
    }, [currenLand])

    return (<div>
        {/* <div style={{ width: 200, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Current Land</p>
            <p>Building : {currenLand ? <span>{currenLand.getName()}</span> : "None"}</p>
            <p>Owner : {getOwnerName}</p>
            <p>Price : {currenLand ? <span>${currenLand.price}</span> : "$0"}</p>
        </div> */}
    </div>)
}