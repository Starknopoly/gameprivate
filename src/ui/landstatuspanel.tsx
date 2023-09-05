import { useEffect } from "react";
import { useDojo } from "../hooks/useDojo";
import { store } from "../store/store";
import { Building } from "../types";
import { buildingIdToMapid, positionToBuildingCoorp } from "../utils";

export default function LandStatusPanel() {
    const { account, buildings } = store();

    const {
        phaserLayer,
        networkLayer: {
            components,
            network: { graphSdk },
            systemCalls: { spawn },
        },
    } = useDojo();

    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        }
    } = phaserLayer;

    // building_type
    // : 
    // 1
    // owner
    // : 
    // "0x2e718687c96c1912743a9564acac04d04e8e886c548d88169661ff450758ec6"
    // price
    // : 
    // 100
    // __typename
    // : 
    // "Land"
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
                            console.log(build);
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
        })
    }, [buildings.keys()])

    useEffect(() => {
        if (!account) {
            return
        }
        fetchAllBuildings()
    }, [account])

    return (<div>
        <div style={{ width: 200, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Current Land</p>
            <p>Building : Bank</p>
            <p>Owner : 0x000</p>
            <p>Price : $100</p>
        </div>
    </div>)
}